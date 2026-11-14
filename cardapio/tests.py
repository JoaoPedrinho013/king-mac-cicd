import json
import os
from unittest import mock

from django.test import SimpleTestCase, override_settings

from .menu import CATEGORIES, PAYMENT_METHODS, PRODUCTS, build_menu


class MenuDataTests(SimpleTestCase):
    def test_required_categories(self):
        ids = {c["id"] for c in CATEGORIES}
        self.assertTrue({"hamburgueres", "combos", "batatas", "sobremesas", "bebidas", "cervejas"} <= ids)

    def test_products_reference_valid_category(self):
        ids = {c["id"] for c in CATEGORIES}
        for product in PRODUCTS:
            self.assertIn(product["category"], ids, product["name"])

    def test_product_ids_unique_and_prices_positive(self):
        ids = [p["id"] for p in PRODUCTS]
        self.assertEqual(len(ids), len(set(ids)))
        for product in PRODUCTS:
            self.assertIsInstance(product["price"], int)
            self.assertGreater(product["price"], 0)

    def test_every_category_has_products(self):
        used = {p["category"] for p in PRODUCTS}
        self.assertEqual(used, {c["id"] for c in CATEGORIES})

    def test_payment_methods(self):
        ids = {m["id"] for m in PAYMENT_METHODS}
        self.assertTrue({"pix", "credito", "debito", "dinheiro"} <= ids)

    def test_build_menu_structure(self):
        menu = build_menu()
        self.assertEqual(menu["brand"], "King Mac")
        self.assertGreaterEqual(menu["delivery_fee"], 0)


@override_settings(
    STORAGES={
        "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
        "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
    }
)
class ViewTests(SimpleTestCase):
    def test_home_renders_brand_and_embeds_menu(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "King Mac")
        self.assertContains(response, 'id="menu-data"')
        self.assertContains(response, "King Bacon")

    def test_menu_api(self):
        response = self.client.get("/api/menu/")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(len(data["products"]), len(PRODUCTS))

    def test_health_json(self):
        response = self.client.get("/health/")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content)
        self.assertEqual(data["status"], "ok")
        self.assertEqual(data["products"], len(PRODUCTS))

    def test_health_reports_version_from_env(self):
        with mock.patch.dict(os.environ, {"APP_VERSION": "abc123"}):
            data = json.loads(self.client.get("/health/").content)
        self.assertEqual(data["version"], "abc123")
