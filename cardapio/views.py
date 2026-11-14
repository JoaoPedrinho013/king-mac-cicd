import os

from django.http import JsonResponse
from django.shortcuts import render

from .menu import PRODUCTS, build_menu


def home(request):
    return render(request, "cardapio/home.html", {"menu": build_menu()})


def menu_api(request):
    return JsonResponse(build_menu())


def health(request):
    return JsonResponse(
        {
            "status": "ok",
            "service": "king-mac",
            "version": os.environ.get("APP_VERSION", "dev"),
            "products": len(PRODUCTS),
        }
    )
