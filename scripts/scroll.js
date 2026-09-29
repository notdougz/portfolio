let smoothScroll;

export function setSmoothScroll(instance) {
  smoothScroll = instance;
}

export function scrollToPosition(top, behavior = "smooth") {
  if (smoothScroll) {
    smoothScroll.scrollTo(top, {
      immediate: behavior === "instant",
      duration: behavior === "instant" ? 0 : 0.9,
    });
  } else {
    window.scrollTo({ top, behavior });
  }
}
