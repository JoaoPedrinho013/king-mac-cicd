"""Gera uma versão estática do cardápio em dist/ para o GitHub Pages.

O cardápio roda inteiro no navegador (dados vêm embutidos na página), então
basta renderizar a página inicial e copiar os arquivos estáticos.
Uso: python build_static.py
"""
import json
import os
import shutil
from pathlib import Path

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
os.environ.setdefault("DEBUG", "True")

import django  # noqa: E402

django.setup()

from django.test import Client  # noqa: E402

ROOT = Path(__file__).resolve().parent
DIST = ROOT / "dist"


def main():
    client = Client(HTTP_HOST="localhost")
    html = client.get("/").content.decode("utf-8")
    # Pages de projeto fica em /<repositório>/, então os caminhos precisam ser relativos.
    html = (
        html.replace('"/static/', '"static/')
        .replace('href="/api/menu/"', 'href="api/menu.json"')
        .replace('href="/health/"', 'href="api/health.json"')
    )

    if DIST.exists():
        shutil.rmtree(DIST)
    (DIST / "api").mkdir(parents=True)
    shutil.copytree(ROOT / "cardapio" / "static" / "cardapio", DIST / "static" / "cardapio")
    (DIST / "index.html").write_text(html, encoding="utf-8")
    (DIST / ".nojekyll").write_text("", encoding="utf-8")
    for name, url in (("menu", "/api/menu/"), ("health", "/health/")):
        data = json.loads(client.get(url).content)
        (DIST / "api" / f"{name}.json").write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"Site estático gerado em {DIST}")


if __name__ == "__main__":
    main()
