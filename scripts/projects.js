const viewport = document.querySelector(".project-viewport");
const previous = document.querySelector(".project-prev");
const next = document.querySelector(".project-next");
const progress = document.querySelector(".project-progress > span");
const current = document.querySelector("#project-current");
const total = document.querySelector("#project-total");
const listeners = new AbortController();
const { signal } = listeners;
const cards = () => [
  ...viewport.querySelectorAll(".project-card:not([hidden])"),
];
const maxScroll = () =>
  Math.max(0, viewport.scrollWidth - viewport.clientWidth);
let updateFrame;
let focusFrame;

function positions() {
  const items = cards();
  const first = items[0]?.offsetLeft || 0;
  const max = maxScroll();
  return items.map((card) => Math.min(max, card.offsetLeft - first));
}

function update() {
  const max = maxScroll();
  const left = Math.max(0, Math.min(max, viewport.scrollLeft));
  const ratio = max ? left / max : 0;
  const count = cards().length;
  const points = positions();
  const index = !count
    ? -1
    : left >= max - 2 && max > 0
      ? count - 1
      : points.reduce(
          (closest, point, i) =>
            Math.abs(point - left) < Math.abs(points[closest] - left)
              ? i
              : closest,
          0,
        );
  current.textContent = String(index + 1).padStart(2, "0");
  total.textContent = String(count).padStart(2, "0");
  progress.style.transform = `scaleX(${count ? (1 + ratio * (count - 1)) / count : 1})`;
  previous.disabled = left < 2 || !max;
  next.disabled = left >= max - 2 || !max;
}

function scheduleUpdate() {
  cancelAnimationFrame(updateFrame);
  updateFrame = requestAnimationFrame(update);
}

function scrollToProject(left, source = "control") {
  const target = Math.min(maxScroll(), Math.max(0, left || 0));
  const behavior =
    document.documentElement.dataset.motion === "reduced" || source === "focus"
      ? "instant"
      : "smooth";
  const event = new CustomEvent("portfolio:project-navigate", {
    cancelable: true,
    detail: { left: target, source, behavior },
  });
  if (document.dispatchEvent(event))
    viewport.scrollTo({ left: target, behavior });
  scheduleUpdate();
}

function navigate(direction) {
  const points = positions();
  const here = viewport.scrollLeft;
  const left =
    direction > 0
      ? (points.find((point) => point > here + 8) ?? points.at(-1))
      : (points.findLast((point) => point < here - 8) ?? 0);
  scrollToProject(left);
}

previous.addEventListener("click", () => navigate(-1), { signal });
next.addEventListener("click", () => navigate(1), { signal });
viewport.addEventListener(
  "keydown",
  (event) => {
    // Links, gallery buttons and future form controls retain their own keys.
    if (
      event.target !== viewport ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    )
      return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      navigate(event.key === "ArrowRight" ? 1 : -1);
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      scrollToProject(event.key === "Home" ? 0 : maxScroll());
    }
  },
  { signal },
);

viewport.addEventListener(
  "focusin",
  (event) => {
    const target = event.target;
    if (
      !target.closest(".project-card") ||
      !target.matches(":focus-visible") ||
      !maxScroll()
    )
      return;
    cancelAnimationFrame(focusFrame);
    focusFrame = requestAnimationFrame(() => {
      if (document.activeElement !== target) return;
      const bounds = target.getBoundingClientRect();
      const view = viewport.getBoundingClientRect();
      const inset = 18;
      let left = viewport.scrollLeft;
      if (bounds.left < view.left + inset)
        left -= view.left + inset - bounds.left;
      else if (bounds.right > view.right - inset)
        left += bounds.right - (view.right - inset);
      // Focus can natively move scrollLeft before this event. Synchronize an active
      // pin immediately, instead of letting its scrub move the focused link away.
      if (
        Math.abs(left - viewport.scrollLeft) > 1 ||
        viewport.closest(".is-pinned")
      ) {
        scrollToProject(left, "focus");
      }
    });
  },
  { signal },
);

viewport.addEventListener("scroll", scheduleUpdate, { passive: true, signal });
document.addEventListener(
  "portfolio:layout",
  () => {
    viewport.scrollTo({ left: 0, behavior: "instant" });
    scheduleUpdate();
  },
  { signal },
);
document.addEventListener("portfolio:projects-ready", scheduleUpdate, {
  signal,
});
const observer = new ResizeObserver(scheduleUpdate);
observer.observe(viewport);
const grid = viewport.querySelector(".project-grid");
if (grid) observer.observe(grid);
update();

if (import.meta.hot)
  import.meta.hot.dispose(() => {
    listeners.abort();
    observer.disconnect();
    cancelAnimationFrame(updateFrame);
    cancelAnimationFrame(focusFrame);
  });
