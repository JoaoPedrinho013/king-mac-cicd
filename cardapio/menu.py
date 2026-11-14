"""Dados mocados do cardápio da King Mac. Preços em centavos."""

CATEGORIES = [
    {"id": "hamburgueres", "name": "Hambúrgueres", "icon": "🍔"},
    {"id": "combos", "name": "Combos", "icon": "🍟"},
    {"id": "batatas", "name": "Batatas e acompanhamentos", "icon": "🥔"},
    {"id": "sobremesas", "name": "Sorvetes e tortas", "icon": "🍦"},
    {"id": "bebidas", "name": "Refrigerantes e sucos", "icon": "🥤"},
    {"id": "cervejas", "name": "Cervejas", "icon": "🍺"},
]

PRODUCTS = [
    # Hambúrgueres
    {"id": "h1", "category": "hamburgueres", "name": "King Mac", "icon": "🍔", "price": 2790,
     "description": "Dois hambúrgueres de carne, queijo, alface, cebola e molho especial no pão com gergelim."},
    {"id": "h2", "category": "hamburgueres", "name": "King Bacon", "icon": "🥓", "price": 3190,
     "description": "Hambúrguer artesanal de 180 g, cheddar, bacon crocante e maionese defumada."},
    {"id": "h3", "category": "hamburgueres", "name": "Cheese Clássico", "icon": "🧀", "price": 2290,
     "description": "Hambúrguer de 120 g, queijo prato, picles e ketchup."},
    {"id": "h4", "category": "hamburgueres", "name": "Frango Crocante", "icon": "🍗", "price": 2690,
     "description": "Filé de frango empanado, alface, tomate e maionese temperada."},
    {"id": "h5", "category": "hamburgueres", "name": "Veggie King", "icon": "🥬", "price": 2890,
     "description": "Hambúrguer de grão-de-bico, rúcula, tomate seco e molho de ervas."},
    # Combos
    {"id": "c1", "category": "combos", "name": "Combo King Mac", "icon": "🍔", "price": 3990,
     "description": "King Mac + batata média + refrigerante 500 ml."},
    {"id": "c2", "category": "combos", "name": "Combo King Bacon", "icon": "🥓", "price": 4390,
     "description": "King Bacon + batata média + refrigerante 500 ml."},
    {"id": "c3", "category": "combos", "name": "Combo Duplo", "icon": "👥", "price": 6990,
     "description": "2 Cheese Clássico + 2 batatas médias + 2 refrigerantes 500 ml."},
    {"id": "c4", "category": "combos", "name": "Combo Kids", "icon": "🎈", "price": 2690,
     "description": "Mini hambúrguer + batata pequena + suco + brinde surpresa."},
    # Batatas e acompanhamentos
    {"id": "b1", "category": "batatas", "name": "Batata Frita Pequena", "icon": "🍟", "price": 1090,
     "description": "Batata frita crocante e sequinha."},
    {"id": "b2", "category": "batatas", "name": "Batata Frita Grande", "icon": "🍟", "price": 1790,
     "description": "Porção grande para dividir (ou não)."},
    {"id": "b3", "category": "batatas", "name": "Batata Cheddar e Bacon", "icon": "🧀", "price": 2290,
     "description": "Batata frita coberta com cheddar cremoso e bacon em cubos."},
    {"id": "b4", "category": "batatas", "name": "Onion Rings", "icon": "🧅", "price": 1690,
     "description": "Anéis de cebola empanados, 8 unidades."},
    {"id": "b5", "category": "batatas", "name": "Nuggets (10 un.)", "icon": "🍗", "price": 1990,
     "description": "Nuggets de frango com molho barbecue."},
    # Sorvetes e tortas
    {"id": "s1", "category": "sobremesas", "name": "Sundae de Chocolate", "icon": "🍨", "price": 1190,
     "description": "Sorvete de creme com calda de chocolate."},
    {"id": "s2", "category": "sobremesas", "name": "Sundae de Morango", "icon": "🍓", "price": 1190,
     "description": "Sorvete de creme com calda de morango."},
    {"id": "s3", "category": "sobremesas", "name": "Milk-shake de Baunilha", "icon": "🥛", "price": 1690,
     "description": "300 ml, cremoso e bem gelado."},
    {"id": "s4", "category": "sobremesas", "name": "Torta de Maçã", "icon": "🥧", "price": 1090,
     "description": "Torta frita com recheio de maçã e canela."},
    {"id": "s5", "category": "sobremesas", "name": "Torta de Limão", "icon": "🍋", "price": 1290,
     "description": "Fatia de torta de limão com merengue."},
    # Bebidas
    {"id": "d1", "category": "bebidas", "name": "Refrigerante Cola 500 ml", "icon": "🥤", "price": 790,
     "description": "Servido com gelo e limão."},
    {"id": "d2", "category": "bebidas", "name": "Refrigerante Guaraná 500 ml", "icon": "🥤", "price": 790,
     "description": "Servido com gelo."},
    {"id": "d3", "category": "bebidas", "name": "Suco de Laranja 400 ml", "icon": "🍊", "price": 990,
     "description": "Suco natural, sem açúcar adicionado."},
    {"id": "d4", "category": "bebidas", "name": "Água Mineral 500 ml", "icon": "💧", "price": 490,
     "description": "Com ou sem gás."},
    # Cervejas
    {"id": "e1", "category": "cervejas", "name": "Cerveja Pilsen Long Neck", "icon": "🍺", "price": 1190,
     "description": "355 ml, bem gelada. Venda proibida para menores de 18 anos."},
    {"id": "e2", "category": "cervejas", "name": "Cerveja IPA Long Neck", "icon": "🍻", "price": 1590,
     "description": "355 ml, amargor marcante. Venda proibida para menores de 18 anos."},
    {"id": "e3", "category": "cervejas", "name": "Chope Pilsen 400 ml", "icon": "🍺", "price": 1390,
     "description": "Tirado na hora. Venda proibida para menores de 18 anos."},
]

PAYMENT_METHODS = [
    {"id": "pix", "name": "Pix", "icon": "⚡"},
    {"id": "credito", "name": "Cartão de crédito", "icon": "💳"},
    {"id": "debito", "name": "Cartão de débito", "icon": "💳"},
    {"id": "vale", "name": "Vale-refeição", "icon": "🎫"},
    {"id": "dinheiro", "name": "Dinheiro na entrega", "icon": "💵"},
]

DELIVERY_FEE = 600


def build_menu():
    return {
        "brand": "King Mac",
        "categories": CATEGORIES,
        "products": PRODUCTS,
        "payment_methods": PAYMENT_METHODS,
        "delivery_fee": DELIVERY_FEE,
    }
