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

// Where a section "sits": its kicker or title just under the header. The pinned
// projects section sits where its pin starts holding the screen.
// Layout position, ignoring the offsets entrance animations apply while hidden.
function documentTop(element) {
  let top = 0;
  for (let node = element; node; node = node.offsetParent)
    top += node.offsetTop;
  return top;
}

export function anchorTop(target) {
  const header = document.querySelector(".site-header")?.offsetHeight || 78;
  const top = documentTop(target);
  if (target.querySelector(".project-pin")) {
    const pinned = target.classList.contains("is-pinned");
    const offset = pinned
      ? parseFloat(target.style.getPropertyValue("--project-offset"))
      : header + 20;
    return Math.max(
      0,
      top + parseFloat(getComputedStyle(target).paddingTop) - offset,
    );
  }
  const content = target.querySelector(".section-kicker, h2") || target;
  return Math.max(0, documentTop(content) - header - 20);
}
