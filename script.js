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

  var index = 0;

  totalEl.textContent = slides.length;

  // Точки-навигация
  var dots = slides.map(function (_, i) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "dot";
    b.setAttribute("aria-label", "Слайд " + (i + 1));
    b.addEventListener("click", function () { show(i); });
    dotsWrap.appendChild(b);
    return b;
  });

  function show(i) {
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

    try {
      history.replaceState(null, "", "#" + (index + 1));
    } catch (e) { /* file:// может запрещать replaceState — не критично */ }
  }

  function next() { show(index + 1); }
  function prev() { show(index - 1); }

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  // Клавиатура
  document.addEventListener("keydown", function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;

    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      prev();
    } else if (e.key === "Home") {
      e.preventDefault();
      show(0);
    } else if (e.key === "End") {
      e.preventDefault();
      show(slides.length - 1);
    } else if (e.key === "f" || e.key === "F" || e.key === "а" || e.key === "А") {
      toggleFullscreen();
    }
  });

  // Полный экран
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(function () {});
    } else {
      document.exitFullscreen().catch(function () {});
    }
  }

  fsBtn.addEventListener("click", toggleFullscreen);

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
    if (!petTarget) return;
    for (var i = 0; i < 9; i++) {
      var h = document.createElement("span");
      h.className = "heart";
      h.textContent = "♥";
      h.style.left = 12 + Math.random() * 70 + "%";
      h.style.top = 18 + Math.random() * 55 + "%";
      h.style.fontSize = 14 + Math.random() * 18 + "px";
      h.style.animationDelay = Math.random() * 0.3 + "s";
      petTarget.appendChild(h);
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

  // Открытие сразу на нужном слайде (#5)
  var fromHash = parseInt(location.hash.replace("#", ""), 10);
  show(Number.isFinite(fromHash) ? fromHash - 1 : 0);
})();
