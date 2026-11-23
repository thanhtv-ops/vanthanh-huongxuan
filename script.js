(function () {
  var doc = document.documentElement;
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  doc.classList.add("js");

  /* ---------- Đếm ngược ---------- */
  var target = new Date("2027-01-02T09:00:00+07:00").getTime();
  var el = { d: document.getElementById("d"), h: document.getElementById("h"), m: document.getElementById("m"), s: document.getElementById("s") };
  function pad(n) { return n < 10 ? "0" + n : "" + n; }
  function tick() {
    var s = Math.floor(Math.max(0, target - Date.now()) / 1000);
    el.d.textContent = Math.floor(s / 86400);
    el.h.textContent = pad(Math.floor(s % 86400 / 3600));
    el.m.textContent = pad(Math.floor(s % 3600 / 60));
    el.s.textContent = pad(s % 60);
  }
  tick(); setInterval(tick, 1000);

  /* ---------- Sao chép địa chỉ ---------- */
  var btn = document.getElementById("copy"), toast = document.getElementById("toast");
  var addr = "Aqua Jardin, Sảnh Haru - Tầng 1, 307 Nơ Trang Long, P. Bình Lợi Trung, Tp. Hồ Chí Minh";
  btn.addEventListener("click", function () {
    var done = function (msg) { toast.textContent = msg; };
    try {
      navigator.clipboard.writeText(addr).then(function () { done("Đã sao chép địa chỉ."); }, function () { done(addr); });
    } catch (e) { done(addr); }
  });

  /* ---------- Hiện dần khi cuộn ---------- */
  var reveals = [].slice.call(document.querySelectorAll(".reveal"));
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (r) { io.observe(r); });
    // Phòng trường hợp trình duyệt không báo: sau 4 giây hiện hết
    setTimeout(function () { reveals.forEach(function (r) { r.classList.add("in"); }); }, 4000);
  } else {
    reveals.forEach(function (r) { r.classList.add("in"); });
  }

  /* ---------- Thanh tiến trình, xe moto và parallax ---------- */
  var bar = document.querySelector(".progress .bar");
  var rider = document.querySelector(".progress .rider");
  var dock = document.querySelector(".dock");
  var leaves = [].slice.call(document.querySelectorAll(".leaf"));
  var pxs = [].slice.call(document.querySelectorAll(".px"));
  pxs.forEach(function (box) {
    var m = parseFloat(box.getAttribute("data-px")) || 0.07;
    box.pxMargin = m;
    box.querySelector(".px-img").style.setProperty("--s", (1 + 2 * m).toFixed(3));
  });
  var ticking = false;
  function frame() {
    ticking = false;
    var vh = window.innerHeight;
    var max = Math.max(1, doc.scrollHeight - vh);
    var p = Math.min(1, Math.max(0, window.scrollY / max));
    bar.style.transform = "scaleX(" + p + ")";
    rider.style.transform = "translateX(" + (p * (window.innerWidth - 34)) + "px)";
    dock.classList.toggle("show", window.scrollY > 360);
    if (reduce) return;
    leaves.forEach(function (lf) {
      var r = lf.parentNode.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var d = r.top + r.height / 2 - vh / 2;
      lf.style.setProperty("--ly", (d * parseFloat(lf.getAttribute("data-speed"))).toFixed(1) + "px");
      lf.style.setProperty("--lr", (d * 0.06).toFixed(1) + "deg");
    });
    pxs.forEach(function (box) {
      var r = box.getBoundingClientRect();
      if (r.bottom < -80 || r.top > vh + 80) return;
      var img = box.querySelector(".px-img");
      // Ảnh phóng 1.14 nên mỗi cạnh dư 7% chiều cao; dịch chuyển theo tỉ lệ để không lộ nền
      var t = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
      t = Math.max(-1, Math.min(1, t));
      img.style.setProperty("--py", (-t * r.height * box.pxMargin).toFixed(1) + "px");
    });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  frame();

  /* ---------- Xem ảnh lớn ---------- */
  var imgs = [].slice.call(document.querySelectorAll("img[data-full]"));
  var lb = document.getElementById("lb"), lbImg = document.getElementById("lb-img"), lbCount = document.getElementById("lb-count");
  var cur = 0, lastFocus = null;
  function show(i) {
    cur = (i + imgs.length) % imgs.length;
    lbImg.src = imgs[cur].getAttribute("data-full");
    lbImg.alt = imgs[cur].alt;
    lbCount.textContent = (cur + 1) + " / " + imgs.length;
    [imgs[(cur + 1) % imgs.length], imgs[(cur - 1 + imgs.length) % imgs.length]].forEach(function (n) {
      new Image().src = n.getAttribute("data-full");
    });
  }
  function open(i) {
    lastFocus = document.activeElement;
    lb.hidden = false; document.body.classList.add("lb-open");
    show(i); lb.querySelector(".lb-x").focus();
  }
  function close() {
    lb.hidden = true; document.body.classList.remove("lb-open");
    lbImg.removeAttribute("src");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  imgs.forEach(function (im, i) {
    var host = im.closest("figure") || im;
    host.addEventListener("click", function () { open(i); });
  });
  lb.querySelector(".lb-x").addEventListener("click", close);
  lb.querySelector(".prev").addEventListener("click", function () { show(cur - 1); });
  lb.querySelector(".next").addEventListener("click", function () { show(cur + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(cur - 1);
    else if (e.key === "ArrowRight") show(cur + 1);
  });
  var x0 = null;
  lb.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
  });
})();

/* nhạc nền: mặc định bật. Trình duyệt chặn tự phát có tiếng nên sẽ phát ngay
   khi khách chạm/bấm lần đầu; khách có thể tắt bằng nút ở góc phải. */
(function () {
  var a = document.getElementById("bgm"), b = document.getElementById("music");
  if (!a || !b) return;
  a.volume = 0.6;
  var userOff = false;
  function ui(on) {
    b.setAttribute("aria-pressed", on ? "true" : "false");
    b.setAttribute("aria-label", on ? "Tắt nhạc nền" : "Bật nhạc nền");
  }
  function start(ev) {
    if (ev && ev.target && b.contains(ev.target)) return;
    if (userOff || !a.paused) return;
    var p = a.play();
    if (p && p.then) p.then(function () { ui(true); unbind(); }).catch(function () {});
  }
  var evs = ["pointerdown", "touchend", "click", "keydown"];
  function unbind() { evs.forEach(function (e) { window.removeEventListener(e, start, true); }); }
  evs.forEach(function (e) { window.addEventListener(e, start, true); });
  start(); // thử phát ngay khi mở trang
  b.addEventListener("click", function (ev) {
    ev.stopPropagation();
    if (a.paused) { userOff = false; a.play().then(function () { ui(true); }).catch(function () {}); }
    else { userOff = true; a.pause(); ui(false); }
  });
  document.addEventListener("visibilitychange", function () {
    if (document.hidden) { if (!a.paused) { a.pause(); a.dataset.auto = "1"; } }
    else if (a.dataset.auto === "1" && !userOff) { a.dataset.auto = ""; a.play().catch(function () {}); }
  });
})();

/* màn hình mở thiệp: một cú chạm để vào thiệp và bật nhạc */
(function () {
  var cv = document.getElementById("cover"), btn = document.getElementById("open"), a = document.getElementById("bgm"), m = document.getElementById("music");
  if (!cv || !btn) return;
  function open() {
    document.body.classList.remove("locked");
    cv.classList.add("gone");
    setTimeout(function () { cv.parentNode && cv.parentNode.removeChild(cv); }, 1000);
    if (a && a.paused) a.play().then(function () {
      if (m) { m.setAttribute("aria-pressed", "true"); m.setAttribute("aria-label", "Tắt nhạc nền"); }
    }).catch(function () {});
  }
  btn.addEventListener("click", open);
  cv.addEventListener("click", function (e) { if (e.target === cv) open(); });
  setTimeout(function () { btn.focus && btn.focus({ preventScroll: true }); }, 50);
})();
