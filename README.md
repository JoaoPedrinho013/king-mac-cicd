# DjangoCICD

Cardápio digital simulado da **King Mac** (Django), usado como aplicação de demonstração do pipeline de CI/CD com GitHub Actions (build, lint, testes, cobertura, vulnerabilidades, Docker Hub e deploy por SSH).

- Hambúrgueres, combos, batatas, sorvetes e tortas, refrigerantes/sucos e cervejas, com dados mocados em `cardapio/menu.py`.
- Carrinho, login/cadastro, formas de pagamento (Pix, crédito, débito, vale-refeição, dinheiro) e histórico de pedidos, tudo simulado. Ao confirmar, aparece o aviso de que o pedido nunca chega.
- Carrinho, conta e pedidos ficam no `localStorage` do navegador. Para apagar, limpe os dados do site (Ctrl+Shift+Del) ou use as ferramentas do navegador. Um Ctrl+Shift+R (recarregar sem cache) não apaga o `localStorage`.

Rotas: `/` (cardápio), `/api/menu/` (JSON do cardápio) e `/health/` (JSON de saúde).

## Rodar localmente

```powershell
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements-dev.txt
$env:DEBUG = "True"
python manage.py runserver
```

Acesse http://127.0.0.1:8000/.

## Testes, cobertura e lint

```powershell
$env:DEBUG = "True"
python manage.py test
coverage run manage.py test; coverage report   # mínimo 80%
ruff check .
pip-audit -r requirements.txt
```

## Rodar com Docker

```bash
docker build -t django-cicd .
docker run --rm -p 8000:8000 -e SECRET_KEY=troque-isto -e ALLOWED_HOSTS=localhost django-cicd
```

Variáveis de ambiente: `SECRET_KEY` (obrigatória em produção), `DEBUG` (padrão `False`), `ALLOWED_HOSTS` (separados por vírgula), `CSRF_TRUSTED_ORIGINS` (opcional).

## GitHub Actions (`.github/workflows/ci-cd.yml`)

Jobs encadeados: `build` → `lint` → `test` → `coverage` → `security` (pip-audit + Trivy) → `docker` (push) → `deploy` (SSH). Os dois últimos só rodam em push na `main`.

Configure em **Settings → Secrets and variables → Actions**:

| Secret | Conteúdo |
|---|---|
| `DOCKERHUB_USERNAME` | usuário do Docker Hub |
| `DOCKERHUB_TOKEN` | access token do Docker Hub (Read & Write) |
| `SSH_HOST` | IP/host do servidor de produção |
| `SSH_USER` | usuário SSH do servidor |
| `SSH_KEY` | chave privada SSH (conteúdo completo) |
| `APP_SECRET_KEY` | `SECRET_KEY` do Django em produção |

O servidor precisa ter Docker instalado e a chave pública correspondente em `~/.ssh/authorized_keys`. O deploy usa `docker pull` e recria o container `django-cicd` na porta 80.

### Como demonstrar (01/12/2026)

1. Faça uma alteração visível (ex.: texto na landing page) e dê push na `main`.
2. Mostre a aba **Actions** com os jobs executando em sequência.
3. Mostre a imagem com tags `latest` e SHA no Docker Hub.
4. Acesse `http://<SSH_HOST>/` e `http://<SSH_HOST>/health/` (o campo `version` traz o SHA do commit).
5. Opcional: quebre um teste de propósito para mostrar o pipeline parando antes da publicação.
