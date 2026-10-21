(function () {
  "use strict";

  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  var prevBtn = document.getElementById("prev");
  var nextBtn = document.getElementById("next");
  var currentEl = document.getElementById("current");
  var totalEl = document.getElementById("total");
  var progressBar = document.getElementById("progressBar");
  var dotsWrap = document.getElementById("dots");
  var fsBtn = document.getElementById("fullscreen");
  var petBtn = document.getElementById("petBtn");
  var petTarget = document.getElementById("petTarget");
  var petLayer = document.querySelector(".pet-layer");

  var index = 0;
  var settingHash = false;

  totalEl.textContent = slides.length;

  // Точки-навигация
  var dots = slides.map(function (_, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "dot";
    b.setAttribute("aria-label", "Слайд " + (i + 1));
    b.addEventListener("click", function () { show(i, true); });
    dotsWrap.appendChild(b);
    return b;
  });

  function isInteractive(el) {
    if (!el || !el.closest) return false;
    return !!el.closest('button, a, input, textarea, select, summary, [contenteditable="true"], [contenteditable=""]');
  }

  function show(i, push) {
    index = Math.max(0, Math.min(slides.length - 1, i));

    slides.forEach(function (slide, n) {
      var active = n === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", active ? "false" : "true");
    });

    dots.forEach(function (d, n) {
      d.classList.toggle("is-active", n === index);
      if (n === index) d.setAttribute("aria-current", "true");
      else d.removeAttribute("aria-current");
    });

    currentEl.textContent = index + 1;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === slides.length - 1;
    progressBar.style.width = ((index + 1) / slides.length) * 100 + "%";

    if (push) {
      settingHash = true;
      try { location.hash = String(index + 1); } catch (e) { /* file:// */ }
    } else {
      try { history.replaceState(null, "", "#" + (index + 1)); } catch (e) { /* file:// */ }
    }
  }

  function next() { show(index + 1, true); }
  function prev() { show(index - 1, true); }

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  // Ссылки #3 и кнопки Back/Forward
  window.addEventListener("hashchange", function () {
    if (settingHash) { settingHash = false; return; }
    var n = parseInt(location.hash.replace("#", ""), 10);
    if (Number.isFinite(n)) show(n - 1, false);
  });

  // Клавиатура
  document.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;

    // Пробел не должен красть активацию у кнопок и ссылок
    if (e.key === " " && isInteractive(e.target)) return;

    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      prev();
    } else if (e.key === "Home") {
      e.preventDefault();
      show(0, true);
    } else if (e.key === "End") {
      e.preventDefault();
      show(slides.length - 1, true);
    } else if (e.key === "f" || e.key === "F" || e.key === "а" || e.key === "А") {
      toggleFullscreen();
    }
  });

  // Полный экран
  function updateFullscreenButton() {
    var on = !!document.fullscreenElement;
    fsBtn.setAttribute("aria-pressed", on ? "true" : "false");
    fsBtn.setAttribute("aria-label", on ? "Выйти из полноэкранного режима" : "Полный экран");
    fsBtn.title = on ? "Выйти из полноэкранного режима (F)" : "Полный экран (F)";
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      var p = document.documentElement.requestFullscreen();
      if (p && p.catch) p.catch(function () {});
    } else {
      var q = document.exitFullscreen();
      if (q && q.catch) q.catch(function () {});
    }
  }

  fsBtn.addEventListener("click", toggleFullscreen);
  document.addEventListener("fullscreenchange", updateFullscreenButton);

  // Свайпы
  var touchStartX = 0;
  var touchStartY = 0;

  document.addEventListener("touchstart", function (e) {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  document.addEventListener("touchend", function (e) {
    var dx = e.changedTouches[0].clientX - touchStartX;
    var dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) next(); else prev();
    }
  }, { passive: true });

  // «Погладить кота» — сердечки
  function spawnHearts() {
    var layer = petLayer || petTarget;
    if (!layer) return;
    for (var i = 0; i < 9; i++) {
      var h = document.createElement("span");
      h.className = "heart";
      h.setAttribute("aria-hidden", "true");
      h.textContent = "♥";
      h.style.left = 12 + Math.random() * 70 + "%";
      h.style.top = 18 + Math.random() * 55 + "%";
      h.style.fontSize = 14 + Math.random() * 18 + "px";
      h.style.animationDelay = Math.random() * 0.3 + "s";
      layer.appendChild(h);
      (function (node) {
        setTimeout(function () { node.remove(); }, 2600);
      })(h);
    }
  }

  if (petBtn) {
    var defaultLabel = petBtn.textContent;
    petBtn.addEventListener("click", function () {
      spawnHearts();
      petBtn.textContent = "Мур-р-р ♥";
      setTimeout(function () { petBtn.textContent = defaultLabel; }, 1400);
    });
  }

  // Стартовый слайд: hash или первый
  var fromHash = parseInt(location.hash.replace("#", ""), 10);
  show(Number.isFinite(fromHash) ? fromHash - 1 : 0, false);
  updateFullscreenButton();
})();
