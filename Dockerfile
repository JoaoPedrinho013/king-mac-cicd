# ---- Estágio 1: instala dependências em um venv ----
FROM python:3.13-slim AS builder
ENV PIP_NO_CACHE_DIR=1 PIP_DISABLE_PIP_VERSION_CHECK=1
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
COPY requirements.txt .
RUN pip install -r requirements.txt

# ---- Estágio 2: imagem final enxuta, sem root ----
FROM python:3.13-slim
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PATH="/opt/venv/bin:$PATH"
ARG APP_VERSION=dev
ENV APP_VERSION=$APP_VERSION
RUN useradd --system --create-home --uid 10001 app
WORKDIR /app
COPY --from=builder /opt/venv /opt/venv
# Segurança: atualiza o zlib e remove pip/setuptools (não são usados em produção e trazem libs embutidas com CVEs)
RUN apt-get update \
    && apt-get install -y --no-install-recommends --only-upgrade zlib1g \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /usr/local/lib/python3.13/site-packages/pip* /usr/local/lib/python3.13/site-packages/setuptools* \
       /usr/local/lib/python3.13/site-packages/wheel* /usr/local/lib/python3.13/site-packages/pkg_resources \
       /usr/local/lib/python3.13/site-packages/_distutils_hack /opt/venv/lib/python3.13/site-packages/pip* \
       /usr/local/bin/pip*
COPY --chown=app:app . .
# collectstatic precisa de uma SECRET_KEY apenas durante o build (valor descartável)
RUN SECRET_KEY=build-only python manage.py collectstatic --noinput && chown -R app:app /app/staticfiles
USER app
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s \
  CMD python -c "import urllib.request,sys; sys.exit(0 if urllib.request.urlopen('http://127.0.0.1:8000/health/', timeout=2).status==200 else 1)" || exit 1
CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2", "--access-logfile", "-"]
