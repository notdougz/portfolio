// Full-screen curtain shared by the first-visit intro and the PT/EN switch.
// The inline script in <head> adds `curtain-in` before the first paint when a
// curtain should already be covering the page on arrival.
const root = document.documentElement;
const reduced = matchMedia("(prefers-reduced-motion: reduce)");
const LABELS = {
  en: { code: "EN", note: "switching to English" },
  pt: { code: "PT", note: "mudando para português" },
};
const INTRO_HOLD = 1150;
let opened = false;

function remember(key, value) {
  try {
    if (value === null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, value);
  } catch {
    /* Storage may be disabled; the curtain simply won't carry over. */
  }
}

export function openCurtain() {
  if (opened) return;
  opened = true;
  remember("lang-curtain", null);
  remember("intro-seen", "1");
  if (!root.classList.contains("curtain-in")) {
    document.dispatchEvent(new Event("portfolio:curtain-open"));
    return;
  }
  const hold = root.classList.contains("curtain-intro") ? INTRO_HOLD : 120;
  setTimeout(
    () => {
      root.classList.remove("curtain-in");
      root.classList.add("curtain-out");
      document.dispatchEvent(new Event("portfolio:curtain-open"));
      document
        .querySelector(".curtain-blue")
        .addEventListener(
          "animationend",
          () =>
            root.classList.remove(
              "curtain-out",
              "curtain-intro",
              "curtain-lang",
            ),
          { once: true },
        );
    },
    Math.max(0, hold - performance.now()),
  );
}

function currentSection() {
  let current = "";
  for (const section of document.querySelectorAll("main section[id]"))
    if (section.getBoundingClientRect().top <= 180) current = section.id;
  return current;
}

const languageLink = document.querySelector(".language-switch");
languageLink?.addEventListener("click", (event) => {
  if (
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return;
  // Land on the same section in the other language.
  const section = currentSection();
  languageLink.hash = section ? `#${section}` : "";
  if (reduced.matches) return;
  event.preventDefault();
  const target = languageLink.hreflang.startsWith("en") ? "en" : "pt";
  const { code, note } = LABELS[target];
  const panel = document.querySelector(".curtain-panel");
  panel
    .querySelector(".curtain-code")
    .replaceChildren(
      ...[...code].map((letter) =>
        Object.assign(document.createElement("span"), { textContent: letter }),
      ),
    );
  panel.querySelector("[data-curtain-lang]").textContent = note;
  root.classList.remove("curtain-in", "curtain-out", "curtain-intro");
  root.classList.add("curtain-lang", "curtain-leave");
  remember("lang-curtain", target);
  setTimeout(() => location.assign(languageLink.href), 820);
});

// Coming back through the history cache must not leave the page covered.
addEventListener("pageshow", (event) => {
  if (event.persisted)
    root.classList.remove("curtain-leave", "curtain-lang", "curtain-in");
});
