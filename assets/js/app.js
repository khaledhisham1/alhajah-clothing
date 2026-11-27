(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const img = k => `assets/img/${k}.jpg`;
  const egp = n => n.toLocaleString("ar-EG") + " ج.م";
  const esc = s => String(s).replace(/[<>&"]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" }[c]));
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const byId = id => PRODUCTS.find(p => p.id === id);
  let bag = JSON.parse(localStorage.getItem("ah_bag") || "[]");

  /* ---------------- INTRO ---------------- */
  const intro = $("#intro");
  function openIntro() {
    if (intro.classList.contains("open")) return;
    intro.classList.add("open");
    document.body.classList.remove("intro-on");
    sessionStorage.setItem("ah_intro", "1");
    setTimeout(() => intro.classList.add("done"), reduced ? 0 : 1500);
  }
  $("#enterBtn").onclick = openIntro;
  $("#skipBtn").onclick = () => { intro.classList.add("open", "done"); document.body.classList.remove("intro-on"); sessionStorage.setItem("ah_intro", "1"); };
  document.addEventListener("keydown", e => { if (!intro.classList.contains("done") && e.key === "Enter") openIntro(); });
  if (sessionStorage.getItem("ah_intro") || reduced) $("#skipBtn").click();
  setTimeout(() => intro.classList.add("ready"), 2600); // safety

  /* ---------------- HEADER ---------------- */
  $("#menuBtn").onclick = () => $("#hnav").classList.toggle("open");
  $$("#hnav a").forEach(a => a.addEventListener("click", () => $("#hnav").classList.remove("open")));
  $("#waContact").href = `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent("أهلاً، عايزة أسأل عن موديل")}`;

  /* ---------------- CARDS ---------------- */
  const card = p => `<a class="pcard rv" href="#/p/${p.id}">
      <div class="pc-img">${p.tag ? `<span class="pc-tag">${p.tag}</span>` : ""}<img src="${img(p.img)}" alt="${esc(p.name)}" loading="lazy"><span class="pc-quick">شوفي التفاصيل</span></div>
      <div class="pc-info"><div><h4>${p.name}</h4><small>${COLLECTIONS[p.col].ar}</small><div class="pc-dots">${p.colors.map(c => `<i style="background:${c[1]}" title="${c[0]}"></i>`).join("")}</div></div><span class="pc-price">${p.price.toLocaleString("en")} EGP</span></div></a>`;

  $("#homeGrid").innerHTML = ["a1", "r1", "a4", "r3", "a2", "r5", "d2", "a5"].map(id => card(byId(id))).join("");
  $("#storyStrip").innerHTML = [["a4", "الحِنّة"], ["a5", "الاستقبال"], ["d4", "أول أيام البيت"]].map(([id, l]) => `<a href="#/p/${id}"><img src="${img(byId(id).img)}" alt=""><span>${l}</span></a>`).join("");
  $("#fabRow").innerHTML = FABRICS.map(f => `<div class="fab rv"><img src="${img(f.img)}" alt="${f.ar}"><span>${f.ar}</span></div>`).join("");

  /* ---------------- SIZE ADVISOR ---------------- */
  $("#advForm").onsubmit = e => {
    e.preventDefault();
    const f = new FormData(e.target), h = +f.get("h"), w = +f.get("w");
    if (!h || !w) return;
    const r = recommendLength(h, w);
    localStorage.setItem("ah_len", r.length);
    $("#advResult").innerHTML = `<div class="adv-out"><div><b>${r.length}</b><span>طول الإسدال (سم)</span></div><div><b>${r.width}</b><span>المقاس</span></div><p>هنختارلك الطول ده لوحده في صفحة أي منتج تفتحيها.</p></div>`;
  };

  /* ---------------- ROUTER ---------------- */
  const views = { home: $("#viewHome"), shop: $("#viewShop"), product: $("#viewProduct"), checkout: $("#viewCheckout") };
  function show(v) { Object.entries(views).forEach(([k, el]) => el.hidden = k !== v); }
  let shopState = { col: "all", sort: "def" };

  function route() {
    const h = location.hash;
    if (h.startsWith("#/p/")) { renderProduct(h.slice(4)); show("product"); scrollTo(0, 0); }
    else if (h.startsWith("#/shop")) { shopState.col = h.split("/")[2] || "all"; renderShop(); show("shop"); scrollTo(0, 0); }
    else if (h === "#/checkout") { renderCheckout(); show("checkout"); scrollTo(0, 0); }
    else if (h === "#/" || h === "" || h === "#") { show("home"); if (h === "#/") scrollTo(0, 0); }
    else { show("home"); const t = document.querySelector(h); if (t) setTimeout(() => t.scrollIntoView({ behavior: "smooth" }), 40); } // in-page anchors
    observe();
  }
  addEventListener("hashchange", route);

  /* ---------------- SHOP ---------------- */
  $("#colSeg").onclick = e => { const b = e.target.closest("button"); if (b) location.hash = "#/shop/" + b.dataset.col; };
  $("#sortSel").onchange = e => { shopState.sort = e.target.value; renderShop(); };
  function renderShop() {
    const c = COLLECTIONS[shopState.col];
    $("#shopKicker").textContent = c ? c.en : "The Atelier";
    $("#shopTitle").textContent = c ? c.ar : "كل القطع";
    $$("#colSeg button").forEach(b => b.classList.toggle("on", b.dataset.col === shopState.col));
    let list = PRODUCTS.filter(p => shopState.col === "all" || p.col === shopState.col);
    if (shopState.sort === "low") list = [...list].sort((a, b) => a.price - b.price);
    if (shopState.sort === "high") list = [...list].sort((a, b) => b.price - a.price);
    $("#shopGrid").innerHTML = list.map(card).join("");
    observe();
  }

  /* ---------------- PRODUCT ---------------- */
  let sel = {};
  function renderProduct(id) {
    const p = byId(id); if (!p) { location.hash = "#/"; return; }
    sel = { id, fabric: FABRICS[0].id, color: 0, length: localStorage.getItem("ah_len") || null, qty: 1 };
    const related = PRODUCTS.filter(x => x.col === p.col && x.id !== p.id).slice(0, 4);
    views.product.innerHTML = `
      <div class="pp">
        <div class="crumbs"><a href="#/">الرئيسية</a> / <a href="#/shop/${p.col}">${COLLECTIONS[p.col].ar}</a> / ${p.name}</div>
        <div class="pp-gal" id="ppGal"><img src="${img(p.img)}" alt="${esc(p.name)}"></div>
        <div class="pp-info">
          <span class="kicker">${COLLECTIONS[p.col].en}</span>
          <h1>${p.name}</h1>
          <div class="pp-price">${egp(p.price)}</div>
          <div><div class="opt-lbl"><span>الخامة: <b id="fabName">${FABRICS[0].ar}</b></span></div>
            <div class="fab-opts" id="fabOpts">${FABRICS.map((f, i) => `<button class="fab-opt ${i ? "" : "on"}" data-f="${f.id}"><span style="background-image:url(${img(f.img)})"></span>${f.ar}</button>`).join("")}</div></div>
          <div><div class="opt-lbl"><span>اللون: <b id="colName">${p.colors[0][0]}</b></span></div>
            <div class="col-opts" id="colOpts">${p.colors.map((c, i) => `<button class="col-opt ${i ? "" : "on"}" data-c="${i}" style="background:${c[1]}" aria-label="${c[0]}"></button>`).join("")}</div></div>
          <div><div class="opt-lbl"><span>الطول (سم)${sel.length ? " - حسب مساعد المقاس" : ""}</span><a href="#advisor">مساعد المقاس</a></div>
            <div class="len-opts" id="lenOpts">${LENGTHS.map(l => `<button class="len-opt ${l === sel.length ? "on" : ""}" data-l="${l}">${l}</button>`).join("")}</div></div>
          <div class="qty-row"><div class="qty"><button data-q="1">+</button><b id="ppQty">1</b><button data-q="-1">−</button></div><button class="btn gold" id="addBag">أضيفي للحقيبة</button></div>
          <p class="err" id="ppErr"></p>
          <div class="acc">
            <details open><summary>عن القطعة</summary><p>قصّة واسعة ومريحة، ونزول القماش ناعم. مناسبة ${p.col === "daily" ? "للبيت والصلاة والخروج القريب" : "للمناسبات والتصوير"}.</p></details>
            <details><summary>الخامة والعناية</summary><p>غسيل يدوي أو على برنامج هادي، وكي على حرارة متوسطة من الوش التاني.</p></details>
            <details><summary>التوصيل والاستبدال</summary><p>شحن لكل المحافظات، ومصاريف الشحن ${BRAND.shipping} ج.م. تفاصيل الاستبدال بتتأكد مع المصنع.</p></details>
          </div>
        </div>
      </div>
      <section class="related"><div class="sec-title row"><div><span class="kicker">من نفس الكولكشن</span><h3>ممكن يعجبك كمان</h3></div></div><div class="pgrid">${related.map(card).join("")}</div></section>`;

    const gal = $("#ppGal"), gi = gal.querySelector("img");
    gal.onmousemove = e => { const r = gal.getBoundingClientRect(); gi.style.transformOrigin = `${(e.clientX - r.left) / r.width * 100}% ${(e.clientY - r.top) / r.height * 100}%`; gi.style.transform = "scale(1.7)"; };
    gal.onmouseleave = () => gi.style.transform = "";
    $("#fabOpts").onclick = e => { const b = e.target.closest(".fab-opt"); if (!b) return; sel.fabric = b.dataset.f; $("#fabName").textContent = FABRICS.find(f => f.id === sel.fabric).ar; $$("#fabOpts .fab-opt").forEach(x => x.classList.toggle("on", x === b)); };
    $("#colOpts").onclick = e => { const b = e.target.closest(".col-opt"); if (!b) return; sel.color = +b.dataset.c; $("#colName").textContent = p.colors[sel.color][0]; $$("#colOpts .col-opt").forEach(x => x.classList.toggle("on", x === b)); };
    $("#lenOpts").onclick = e => { const b = e.target.closest(".len-opt"); if (!b) return; sel.length = b.dataset.l; $("#ppErr").textContent = ""; $$("#lenOpts .len-opt").forEach(x => x.classList.toggle("on", x === b)); };
    views.product.querySelector(".qty").onclick = e => { const b = e.target.closest("[data-q]"); if (!b) return; sel.qty = Math.max(1, sel.qty + +b.dataset.q); $("#ppQty").textContent = sel.qty; };
    $("#addBag").onclick = () => {
      if (!sel.length) { $("#ppErr").textContent = "اختاري الطول الأول، أو استخدمي مساعد المقاس"; return; }
      const k = bag.find(i => i.id === sel.id && i.fabric === sel.fabric && i.color === sel.color && i.length === sel.length);
      k ? k.qty += sel.qty : bag.push({ ...sel });
      saveBag(); toast("اتضافت للحقيبة"); openBag();
    };
  }

  /* ---------------- BAG ---------------- */
  const bagEl = $("#bag"), veil = $("#veil");
  const subtotal = () => bag.reduce((a, i) => a + byId(i.id).price * i.qty, 0);
  function saveBag() {
    localStorage.setItem("ah_bag", JSON.stringify(bag));
    const c = $("#bagCount"); c.textContent = bag.reduce((a, i) => a + i.qty, 0); c.classList.add("bump"); setTimeout(() => c.classList.remove("bump"), 400);
  }
  const itemDesc = i => { const p = byId(i.id); return `${FABRICS.find(f => f.id === i.fabric).ar} / ${p.colors[i.color][0]} / طول ${i.length}`; };
  function openBag() {
    bagEl.innerHTML = `<div class="bag-h"><h3>الحقيبة</h3><button class="x" data-close aria-label="إغلاق">×</button></div>
      <div class="bag-b">${bag.length ? bag.map((i, k) => { const p = byId(i.id); return `<div class="bi"><img src="${img(p.img)}" alt=""><div><h5>${p.name}</h5><small>${itemDesc(i)}</small>
        <div class="qty" data-k="${k}" style="display:inline-flex;margin-top:6px"><button data-d="1">+</button><b>${i.qty}</b><button data-d="-1">−</button></div></div>
        <div style="text-align:left"><div style="font-family:var(--latin);font-size:18px">${(p.price * i.qty).toLocaleString("en")}</div><button class="rm" data-rm="${k}">إزالة</button></div></div>`; }).join("") : `<p class="empty">الحقيبة فاضية</p>`}</div>
      <div class="bag-f">${bag.length ? `<div class="row"><span>الإجمالي قبل الشحن</span><span>${egp(subtotal())}</span></div><a href="#/checkout" class="btn gold full" data-close>إتمام الطلب</a>` : `<a href="#/shop/all" class="btn line full" data-close>تصفحي المعرض</a>`}</div>`;
    bagEl.classList.add("on"); veil.classList.add("on"); document.body.classList.add("lock");
  }
  function closeBag() { bagEl.classList.remove("on"); veil.classList.remove("on"); document.body.classList.remove("lock"); }
  $("#bagBtn").onclick = openBag; veil.onclick = closeBag;
  bagEl.addEventListener("click", e => {
    if (e.target.closest("[data-close]")) return closeBag();
    const rm = e.target.closest("[data-rm]"); if (rm) { bag.splice(+rm.dataset.rm, 1); saveBag(); return openBag(); }
    const d = e.target.closest("[data-d]"); if (d) { const it = bag[+d.closest("[data-k]").dataset.k]; it.qty += +d.dataset.d; if (it.qty < 1) bag.splice(bag.indexOf(it), 1); saveBag(); openBag(); }
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeBag(); });

  /* ---------------- CHECKOUT ---------------- */
  function renderCheckout() {
    if (!bag.length) { views.checkout.innerHTML = `<div class="co"><h1>الحقيبة فاضية</h1><a href="#/shop/all" class="btn gold">تصفحي المعرض</a></div>`; return; }
    views.checkout.innerHTML = `<div class="co">
      <h1>إتمام الطلب</h1>
      <div class="co-steps"><span class="on"><b>01</b>البيانات</span><span><b>02</b>التأكيد</span><span><b>03</b>الإرسال</span></div>
      <form class="co-form" id="coForm" novalidate>
        <div class="two"><label class="fld">الاسم<input name="name" autocomplete="name"></label><label class="fld">رقم الموبايل<input name="phone" inputmode="tel" autocomplete="tel"></label></div>
        <div class="two"><label class="fld">المحافظة<select name="gov">${["الجيزة", "القاهرة", "الإسكندرية", "القليوبية", "الشرقية", "الدقهلية", "الغربية", "محافظة تانية"].map(g => `<option>${g}</option>`).join("")}</select></label><label class="fld">المدينة / المنطقة<input name="city"></label></div>
        <label class="fld">العنوان بالتفصيل<input name="address" autocomplete="street-address"></label>
        <label class="fld">ميعاد المناسبة (اختياري)<input name="event" type="date"></label>
        <div class="fld">طريقة الدفع
          <div class="pays"><label><input type="radio" name="pay" value="الدفع عند الاستلام" checked>عند الاستلام<small>كاش للمندوب</small></label><label><input type="radio" name="pay" value="فودافون كاش (محاكاة)">فودافون كاش<small>محاكاة في الديمو</small></label></div></div>
        <label class="fld">ملاحظات<textarea name="notes" rows="2"></textarea></label>
        <p class="err" id="coErr"></p>
        <button class="btn gold full" type="submit">تأكيد وإرسال الطلب</button>
      </form>
      <aside class="summary"><h4>ملخص الطلب</h4>
        ${bag.map(i => { const p = byId(i.id); return `<div class="sum-item"><img src="${img(p.img)}" alt=""><div>${p.name} × ${i.qty}<small>${itemDesc(i)}</small></div><span>${(p.price * i.qty).toLocaleString("en")}</span></div>`; }).join("")}
        <div class="row"><span>المنتجات</span><span>${egp(subtotal())}</span></div>
        <div class="row"><span>الشحن</span><span>${egp(BRAND.shipping)}</span></div>
        <div class="row t"><span>الإجمالي</span><b>${(subtotal() + BRAND.shipping).toLocaleString("en")} EGP</b></div>
      </aside></div>`;
    $("#coForm").onsubmit = submitOrder;
  }

  function submitOrder(e) {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target)), err = $("#coErr");
    if (!f.name.trim()) return err.textContent = "اكتبي الاسم";
    if (!/^01[0125]\d{8}$/.test(f.phone.trim())) return err.textContent = "رقم الموبايل لازم 11 رقم ويبدأ بـ 01";
    if (!f.address.trim()) return err.textContent = "اكتبي العنوان";
    const id = "AH-" + Math.floor(1000 + Math.random() * 9000), total = subtotal() + BRAND.shipping;
    const lines = bag.map(i => `- ${byId(i.id).name} (${itemDesc(i)}) × ${i.qty}`).join("\n");
    const msg = `طلب جديد ${id}\n${lines}\nالإجمالي: ${total} ج.م\nالاسم: ${f.name}\nالموبايل: ${f.phone}\nالعنوان: ${[f.gov, f.city, f.address].filter(Boolean).join(" - ")}${f.event ? `\nميعاد المناسبة: ${f.event}` : ""}\nالدفع: ${f.pay}${f.notes ? `\nملاحظات: ${f.notes}` : ""}`;
    views.checkout.innerHTML = `<div class="confirm">
      <div><span class="kicker">شكراً يا ${esc(f.name)}</span><h1>طلبك اتسجل،<br>وبيتبعت للمصنع</h1><div class="order-no">${id}</div>
        <p class="muted" style="margin:14px 0 24px">ده شكل الطلب وهو بيوصل للحاجة على الواتساب. هيتواصلوا معاكي للتأكيد.</p>
        <div class="hero-cta"><a class="btn gold" target="_blank" rel="noopener" href="https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(msg)}">افتحي الطلب في واتساب</a><a href="#/" class="link-u">رجوع للمعرض</a></div></div>
      <div><div class="wa-card"><div class="wa-head"><i>ح</i><div>الحاجة<small>متصل الآن</small></div></div><div class="wa-body" id="waBody"></div></div><p class="sim">محاكاة لإرسال الطلب، من غير ربط حقيقي بالواتساب.</p></div></div>`;
    const body = $("#waBody");
    const add = (t, c) => { const m = document.createElement("div"); m.className = "msg " + c; m.innerHTML = t; body.appendChild(m); };
    add(esc(msg) + `<span class="st">✓✓</span>`, "me");
    setTimeout(() => { const t = document.createElement("div"); t.className = "typing"; t.innerHTML = "<i></i><i></i><i></i>"; body.appendChild(t);
      setTimeout(() => { t.remove(); add(`أهلاً بيكي يا ${esc(f.name)}، طلبك ${id} وصل. هنراجع المقاسات ونأكد معاكي ميعاد التسليم.`, "them"); }, 1500); }, reduced ? 0 : 900);
    bag = []; saveBag();
  }

  /* ---------------- REVEAL + TOAST ---------------- */
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target); } }), { threshold: .12 });
  function observe() { $$(".rv:not(.in)").forEach(el => io.observe(el)); }
  let tt; function toast(t) { const el = $("#toast"); el.textContent = t; el.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => el.classList.remove("on"), 1900); }

  saveBag(); route();
})();
