(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const currentEl = document.getElementById("current");
  const totalEl = document.getElementById("total");

  let index = 0;

  totalEl.textContent = slides.length;

  function show(i) {
    index = Math.max(0, Math.min(slides.length - 1, i));

    slides.forEach((slide, n) => {
      slide.classList.toggle("is-active", n === index);
    });

    currentEl.textContent = index + 1;
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === slides.length - 1;

    history.replaceState(null, "", "#" + (index + 1));
  }

  function next() {
    show(index + 1);
  }

  function prev() {
    show(index - 1);
  }

  nextBtn.addEventListener("click", next);
  prevBtn.addEventListener("click", prev);

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
      e.preventDefault();
      next();
    }
    if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      prev();
    }
    if (e.key === "Home") {
      e.preventDefault();
      show(0);
    }
    if (e.key === "End") {
      e.preventDefault();
      show(slides.length - 1);
    }
  });

  // Свайпы на телефоне
  let touchStartX = 0;

  document.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  document.addEventListener("touchend", (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 60) {
      delta < 0 ? next() : prev();
    }
  }, { passive: true });

  // Открытие сразу на нужном слайде (например, #5)
  const fromHash = parseInt(location.hash.replace("#", ""), 10);
  show(Number.isFinite(fromHash) ? fromHash - 1 : 0);
})();
