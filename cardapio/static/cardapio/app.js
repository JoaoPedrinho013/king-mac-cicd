/* King Mac - cardápio digital simulado.
   Carrinho, conta e pedidos ficam no localStorage do navegador:
   limpar os dados do site (Ctrl+Shift+Del) apaga tudo. */
(function () {
  "use strict";

  const MENU = JSON.parse(document.getElementById("menu-data").textContent);
  const KEY = "kingmac:v1";
  const $ = (id) => document.getElementById(id);
  const brl = (cents) => (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const byId = Object.fromEntries(MENU.products.map((p) => [p.id, p]));

  // ---------- estado persistido ----------
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY));
      if (s && typeof s === "object") return { cart: {}, user: null, users: {}, orders: [], ...s };
    } catch (e) { /* storage indisponível ou corrompido */ }
    return { cart: {}, user: null, users: {}, orders: [] };
  }
  let state = load();
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignora */ }
  }

  // ---------- helpers de DOM ----------
  function h(tag, attrs, ...kids) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (k === "class") node.className = v;
      else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
      else if (v !== false && v != null) node.setAttribute(k, v === true ? "" : v);
    }
    for (const kid of kids.flat()) if (kid != null) node.append(kid.nodeType ? kid : document.createTextNode(kid));
    return node;
  }
  function toast(msg) {
    const t = $("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast.id);
    toast.id = setTimeout(() => t.classList.remove("show"), 2200);
  }
  const clear = (n) => { while (n.firstChild) n.removeChild(n.firstChild); return n; };

  // ---------- carrinho ----------
  const cartCount = () => Object.values(state.cart).reduce((a, b) => a + b, 0);
  const subtotal = () => Object.entries(state.cart).reduce((a, [id, q]) => a + byId[id].price * q, 0);
  function add(id, d) {
    const q = (state.cart[id] || 0) + d;
    if (q <= 0) delete state.cart[id]; else state.cart[id] = q;
    save(); refresh();
  }
  function refresh() {
    $("cart-count").textContent = cartCount();
    $("btn-account").textContent = state.user ? "Olá, " + state.user.name.split(" ")[0] : "Entrar";
    if ($("dlg-cart").open) renderCart();
  }

  // ---------- cardápio ----------
  function renderMenu() {
    const menu = clear($("menu")), tabs = clear($("tabs"));
    for (const c of MENU.categories) {
      tabs.append(h("a", { href: "#cat-" + c.id }, c.icon + " " + c.name));
      const grid = h("div", { class: "grid" });
      for (const p of MENU.products.filter((x) => x.category === c.id)) {
        grid.append(h("article", { class: "item" },
          h("div", { class: "pic", "aria-hidden": "true" }, p.icon),
          h("div", { class: "info" },
            h("h3", {}, p.name),
            h("p", {}, p.description),
            h("div", { class: "buy" },
              h("span", { class: "price" }, brl(p.price)),
              h("button", { class: "btn", type: "button", onclick: () => { add(p.id, 1); toast(p.name + " adicionado"); } }, "Adicionar")))));
      }
      menu.append(h("section", { class: "cat", id: "cat-" + c.id }, h("h2", {}, c.icon + " " + c.name), grid));
    }
  }

  function renderCart() {
    const body = clear($("cart-body"));
    const ids = Object.keys(state.cart);
    if (!ids.length) {
      body.append(h("p", { class: "empty" }, "Seu carrinho está vazio."));
      return;
    }
    for (const id of ids) {
      const p = byId[id];
      body.append(h("div", { class: "line" },
        h("div", { class: "nm" }, p.icon + " " + p.name, h("small", {}, brl(p.price))),
        h("div", { class: "qty" },
          h("button", { type: "button", "aria-label": "Diminuir", onclick: () => add(id, -1) }, "−"),
          h("strong", {}, state.cart[id]),
          h("button", { type: "button", "aria-label": "Aumentar", onclick: () => add(id, 1) }, "+"))));
    }
    const sub = subtotal();
    body.append(
      h("div", { class: "sum" }, h("span", {}, "Subtotal"), h("span", {}, brl(sub))),
      h("div", { class: "sum" }, h("span", {}, "Entrega"), h("span", {}, brl(MENU.delivery_fee))),
      h("div", { class: "sum total" }, h("span", {}, "Total"), h("span", {}, brl(sub + MENU.delivery_fee))),
      h("div", { class: "stack" },
        h("button", { class: "btn block", type: "button", onclick: openCheckout }, "Finalizar pedido"),
        h("button", { class: "btn ghost block", type: "button", onclick: () => { state.cart = {}; save(); refresh(); } }, "Limpar carrinho")));
  }

  // ---------- conta (login simulado) ----------
  function renderAccount(mode) {
    const body = clear($("account-body"));
    if (state.user) {
      $("account-title").textContent = "Minha conta";
      body.append(h("p", {}, h("strong", {}, state.user.name), h("br"), state.user.email));
      body.append(h("h3", {}, "Meus pedidos"));
      if (!state.orders.length) body.append(h("p", { class: "empty" }, "Nenhum pedido ainda."));
      for (const o of state.orders) {
        body.append(h("div", { class: "order" },
          h("strong", {}, "#" + o.id + " · " + brl(o.total)), " ", h("span", { class: "tag" }, "Em preparo… para sempre"),
          h("small", {}, new Date(o.at).toLocaleString("pt-BR") + " · " + o.payment),
          h("small", {}, o.items.map((i) => i.qty + "x " + i.name).join(", "))));
      }
      body.append(h("div", { class: "stack" },
        h("button", { class: "btn ghost block", type: "button", onclick: () => { state.user = null; save(); refresh(); $("dlg-account").close(); toast("Você saiu da conta"); } }, "Sair")));
      return;
    }
    const signup = mode === "signup";
    $("account-title").textContent = signup ? "Criar conta" : "Entrar";
    const err = h("p", { class: "err", role: "alert" });
    const f = h("form", { novalidate: true },
      signup ? [h("label", { for: "f-name" }, "Nome"), h("input", { id: "f-name", autocomplete: "name" })] : null,
      h("label", { for: "f-email" }, "E-mail"), h("input", { id: "f-email", type: "email", autocomplete: "email" }),
      h("label", { for: "f-pass" }, "Senha"), h("input", { id: "f-pass", type: "password", autocomplete: signup ? "new-password" : "current-password" }),
      err,
      h("button", { class: "btn block", type: "submit" }, signup ? "Criar conta" : "Entrar"),
      h("p", { class: "switch" }, signup ? "Já tem conta? " : "Novo por aqui? ",
        h("button", { type: "button", onclick: () => renderAccount(signup ? "login" : "signup") }, signup ? "Entrar" : "Criar conta")));
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = $("f-email").value.trim().toLowerCase(), pass = $("f-pass").value;
      const name = signup ? $("f-name").value.trim() : "";
      if (signup && name.length < 2) return void (err.textContent = "Informe seu nome.");
      if (!/^\S+@\S+\.\S+$/.test(email)) return void (err.textContent = "E-mail inválido.");
      if (pass.length < 4) return void (err.textContent = "A senha precisa ter ao menos 4 caracteres.");
      if (signup) {
        if (state.users[email]) return void (err.textContent = "Este e-mail já está cadastrado.");
        state.users[email] = { name, pass };
      } else if (!state.users[email] || state.users[email].pass !== pass) {
        return void (err.textContent = "E-mail ou senha incorretos.");
      }
      state.user = { name: state.users[email].name, email };
      save(); refresh(); $("dlg-account").close(); toast("Bem-vindo, " + state.user.name.split(" ")[0] + "!");
    });
    body.append(f, h("p", { class: "switch" }, "Login simulado: os dados ficam apenas neste navegador."));
  }

  // ---------- checkout ----------
  function openCheckout() {
    if (!cartCount()) return;
    if (!state.user) {
      $("dlg-cart").close();
      renderAccount("login");
      $("dlg-account").showModal();
      toast("Entre na sua conta para finalizar");
      return;
    }
    renderCheckout();
    $("dlg-cart").close();
    $("dlg-checkout").showModal();
  }

  function renderCheckout() {
    const body = clear($("checkout-body"));
    const total = subtotal() + MENU.delivery_fee;
    const extra = h("div", { id: "pay-extra" });
    const err = h("p", { class: "err", role: "alert" });
    const pays = h("div", { class: "pay", role: "radiogroup", "aria-label": "Forma de pagamento" });
    MENU.payment_methods.forEach((m, i) => {
      pays.append(h("input", { type: "radio", name: "pay", id: "pay-" + m.id, value: m.id, checked: i === 0, onchange: () => showExtra(m.id) }),
        h("label", { for: "pay-" + m.id }, m.icon + " " + m.name));
    });
    function showExtra(id) {
      clear(extra);
      if (id === "pix") {
        extra.append(h("div", { class: "pixbox" }, "Chave Pix copia e cola (simulada):", h("br"),
          "00020126KINGMAC0000SIMULADO5204000053039865802BR5908KING MAC6009SAO PAULO"));
      } else if (id === "credito" || id === "debito") {
        extra.append(
          h("label", { for: "c-num" }, "Número do cartão"), h("input", { id: "c-num", inputmode: "numeric", placeholder: "0000 0000 0000 0000", maxlength: "19", autocomplete: "off" }),
          h("div", { class: "row2" },
            h("div", {}, h("label", { for: "c-val" }, "Validade"), h("input", { id: "c-val", placeholder: "MM/AA", maxlength: "5", autocomplete: "off" })),
            h("div", {}, h("label", { for: "c-cvv" }, "CVV"), h("input", { id: "c-cvv", inputmode: "numeric", maxlength: "4", autocomplete: "off" }))),
          id === "credito" ? [h("label", { for: "c-par" }, "Parcelas"),
            h("select", { id: "c-par" }, [1, 2, 3].map((n) => h("option", { value: n }, n + "x de " + brl(Math.ceil(total / n)) + " sem juros")))] : null);
      } else if (id === "vale") {
        extra.append(h("label", { for: "v-num" }, "Número do cartão-benefício"), h("input", { id: "v-num", inputmode: "numeric", autocomplete: "off" }));
      } else {
        extra.append(h("label", { for: "d-troco" }, "Troco para (opcional)"), h("input", { id: "d-troco", inputmode: "decimal", placeholder: "Ex.: 100" }));
      }
    }
    const f = h("form", { novalidate: true },
      h("label", { for: "k-addr" }, "Endereço de entrega"), h("input", { id: "k-addr", autocomplete: "street-address", placeholder: "Rua, número, bairro" }),
      h("label", {}, "Forma de pagamento"), pays, extra, err,
      h("div", { class: "sum total" }, h("span", {}, "Total a pagar"), h("span", {}, brl(total))),
      h("button", { class: "btn block", type: "submit" }, "Confirmar pedido"));
    showExtra(MENU.payment_methods[0].id);
    f.addEventListener("submit", (e) => {
      e.preventDefault();
      const method = f.querySelector("input[name=pay]:checked").value;
      const addr = $("k-addr").value.trim();
      if (addr.length < 5) return void (err.textContent = "Informe o endereço de entrega.");
      if (method === "credito" || method === "debito") {
        if ($("c-num").value.replace(/\D/g, "").length < 13) return void (err.textContent = "Número do cartão inválido.");
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test($("c-val").value)) return void (err.textContent = "Validade inválida (MM/AA).");
        if ($("c-cvv").value.replace(/\D/g, "").length < 3) return void (err.textContent = "CVV inválido.");
      }
      if (method === "vale" && $("v-num").value.replace(/\D/g, "").length < 8) return void (err.textContent = "Número do cartão inválido.");
      const label = MENU.payment_methods.find((m) => m.id === method).name;
      const order = {
        id: String(Date.now()).slice(-6), at: Date.now(), total, payment: label, address: addr,
        items: Object.entries(state.cart).map(([id, qty]) => ({ name: byId[id].name, qty })),
      };
      state.orders.unshift(order);
      state.cart = {};
      save(); refresh();
      $("dlg-checkout").close();
      showDone(order);
    });
    body.append(h("p", { class: "switch" }, "Pagamento simulado: nenhum dado é enviado a lugar nenhum."), f);
  }

  function showDone(order) {
    const body = clear($("done-body"));
    body.append(h("div", { class: "done" },
      h("div", { class: "big" }, "👑"),
      h("h2", {}, "Pedido #" + order.id + " confirmado!"),
      h("p", {}, "Total de " + brl(order.total) + " via " + order.payment + "."),
      h("p", {}, h("strong", {}, "Aviso: "), "isto é uma simulação. Seu pedido nunca será preparado nem chegará. 😄"),
      h("div", { class: "stack" },
        h("button", { class: "btn block", type: "button", onclick: () => $("dlg-done").close() }, "Entendi"),
        h("button", { class: "btn ghost block", type: "button", onclick: () => { $("dlg-done").close(); renderAccount(); $("dlg-account").showModal(); } }, "Ver meus pedidos"))));
    $("dlg-done").showModal();
  }

  // ---------- eventos ----------
  $("btn-cart").addEventListener("click", () => { renderCart(); $("dlg-cart").showModal(); });
  $("btn-account").addEventListener("click", () => { renderAccount("login"); $("dlg-account").showModal(); });
  $("btn-wipe").addEventListener("click", () => {
    if (!confirm("Apagar carrinho, conta, contas cadastradas e pedidos deste navegador?")) return;
    try { localStorage.removeItem(KEY); } catch (e) { /* ignora */ }
    state = { cart: {}, user: null, users: {}, orders: [] };
    document.querySelectorAll("dialog").forEach((d) => d.open && d.close());
    refresh();
    toast("Seus dados foram apagados");
  });
  document.querySelectorAll("dialog").forEach((d) =>
    d.addEventListener("click", (e) => { if (e.target === d) d.close(); }));
  // destaque da aba da categoria visível
  const observer = new IntersectionObserver((entries) => {
    for (const en of entries) if (en.isIntersecting) {
      document.querySelectorAll(".tabs a").forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + en.target.id));
    }
  }, { rootMargin: "-30% 0px -60% 0px" });

  renderMenu();
  document.querySelectorAll(".cat").forEach((s) => observer.observe(s));
  refresh();
})();
