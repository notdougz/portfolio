import "./projects.js";
import "./life.js";
import { t } from "./i18n.js";
import { scrollToPosition } from "./scroll.js";

const root = document.documentElement;
const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
const updateMotionPreference = () => {
  root.dataset.motion = motionPreference.matches ? "reduced" : "full";
};
updateMotionPreference();
motionPreference.addEventListener("change", updateMotionPreference);
const themeButton = document.querySelector(".theme-toggle");
function setTheme(theme) {
  root.dataset.theme = theme;
  const light = theme === "light";
  themeButton.setAttribute(
    "aria-label",
    t(`Ativar tema ${light ? "escuro" : "claro"}`),
  );
  themeButton.setAttribute("aria-pressed", String(light));
  document.querySelector('meta[name="theme-color"]').content = light
    ? "#f4f6fa"
    : "#080b10";
}
try {
  setTheme(
    localStorage.getItem("douglas-theme") === "light" ? "light" : "dark",
  );
} catch {
  setTheme("dark");
}
themeButton.addEventListener("click", () => {
  const theme = root.dataset.theme === "dark" ? "light" : "dark";
  setTheme(theme);
  try {
    localStorage.setItem("douglas-theme", theme);
  } catch {
    /* Storage may be disabled. */
  }
});
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");
function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", t("Abrir menu"));
  navigation.classList.remove("open");
}
menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  menuButton.setAttribute("aria-expanded", String(open));
  menuButton.setAttribute("aria-label", t(open ? "Fechar menu" : "Abrir menu"));
  navigation.classList.toggle("open", open);
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && navigation.classList.contains("open")) {
    closeMenu();
    menuButton.focus();
  }
});
document.addEventListener("click", (event) => {
  if (!event.target.closest(".site-header")) closeMenu();
});
matchMedia("(min-width: 1000px)").addEventListener("change", (event) => {
  if (event.matches) closeMenu();
});
const header = document.querySelector(".site-header");
const navLinks = [...navigation.querySelectorAll("a")];
const sections = [...document.querySelectorAll("main section[id]")];
let scrollQueued = false;
function updateScroll() {
  header.classList.toggle("scrolled", scrollY > 30);
  let current = "";
  for (const section of sections)
    if (section.getBoundingClientRect().top <= 180) current = "#" + section.id;
  for (const link of navLinks) {
    const active = link.getAttribute("href") === current;
    link.classList.toggle("active", active);
    if (active) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  }
  scrollQueued = false;
}
addEventListener(
  "scroll",
  () => {
    if (!scrollQueued) {
      scrollQueued = true;
      requestAnimationFrame(updateScroll);
    }
  },
  { passive: true },
);
updateScroll();
const galleries = {
  barbearia: {
    title: "Sistema de agendamentos",
    code: "https://github.com/notdougz/projeto-barbearia",
    images: [
      ["dashboard.png", "Visão geral do dashboard"],
      ["agendamentos.png", "Calendário de agendamentos"],
      ["lista-clientes.png", "Gestão de clientes"],
      ["servicos.png", "Gestão de serviços"],
      ["financeiro.png", "Painel financeiro"],
      ["cadastro-cliente.png", "Cadastro de clientes"],
      ["previsao-chegada.png", "Notificação de previsão de chegada"],
      ["mobile.png", "Interface no celular"],
      ["login.png", "Tela de login"],
    ],
  },
  tarefas: {
    title: "First API — Gerenciador de tarefas",
    code: "https://github.com/notdougz/first-api",
    images: [
      ["tarefas.jpeg", "Lista de tarefas do usuário"],
      ["login-tarefas.jpeg", "Login e cadastro"],
    ],
  },
};
const dialog = document.querySelector("#project-dialog");
let currentGallery = null;
let imageIndex = 0;
let galleryOpener = null;
function showImage(index) {
  imageIndex =
    (index + currentGallery.images.length) % currentGallery.images.length;
  const [file, description] = currentGallery.images[imageIndex];
  const image = document.querySelector("#gallery-image");
  image.src = "assets/" + file;
  image.alt = t(description);
  document.querySelector("#gallery-caption").textContent =
    `${imageIndex + 1} / ${currentGallery.images.length} — ${t(description)}`;
}
let galleryLoading = false;
document.querySelectorAll("[data-gallery]").forEach((button) =>
  button.addEventListener("click", async () => {
    if (galleryLoading) return;
    currentGallery = galleries[button.dataset.gallery];
    galleryOpener = button;
    galleryLoading = true;
    button.setAttribute("aria-busy", "true");
    try {
      const { openGallery } = await import("./gallery.js");
      openGallery(currentGallery, button);
      return;
    } catch {
      // Keep the native dialog usable if the optional gallery cannot load.
    } finally {
      galleryLoading = false;
      button.removeAttribute("aria-busy");
    }
    document.querySelector("#gallery-title").textContent = t(
      currentGallery.title,
    );
    document.querySelector("#gallery-code").href = currentGallery.code;
    showImage(0);
    dialog.showModal();
    document.body.classList.add("dialog-open");
  }),
);
document
  .querySelector("#gallery-prev")
  .addEventListener("click", () => showImage(imageIndex - 1));
document
  .querySelector("#gallery-next")
  .addEventListener("click", () => showImage(imageIndex + 1));
document
  .querySelector(".dialog-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target !== dialog) return;
  const b = dialog.getBoundingClientRect();
  if (
    event.clientX < b.left ||
    event.clientX > b.right ||
    event.clientY < b.top ||
    event.clientY > b.bottom
  )
    dialog.close();
});
dialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    event.preventDefault();
    showImage(imageIndex + 1);
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    showImage(imageIndex - 1);
  }
});
dialog.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
  galleryOpener?.focus({ preventScroll: true });
});
let copyTimer;
document.querySelector(".copy-email").addEventListener("click", async () => {
  const status = document.querySelector("#copy-status");
  const button = document.querySelector(".copy-email");
  clearTimeout(copyTimer);
  status.classList.remove("sr-only");
  status.classList.add("copy-toast");
  try {
    await navigator.clipboard.writeText("doug.dev@hotmail.com");
    button.querySelector("span").textContent = t("E-mail copiado ✓");
    status.textContent = t("E-mail copiado para a área de transferência.");
    copyTimer = setTimeout(() => {
      status.classList.remove("is-visible");
      button.querySelector("span").textContent = t("Copiar e-mail");
    }, 4500);
  } catch {
    status.classList.remove("sr-only");
    status.textContent = t("Selecione e copie: doug.dev@hotmail.com");
  }
  status.classList.add("is-visible");
});

// Native lazy loading keeps the page light; reveal screenshots when loaded.
for (const image of document.querySelectorAll(".project-image img")) {
  const reveal = () => {
    image.classList.remove("image-loading");
    image.closest(".project-image").removeAttribute("aria-busy");
  };
  if (image.complete) continue;
  image.classList.add("image-loading");
  image.closest(".project-image").setAttribute("aria-busy", "true");
  image.addEventListener("load", reveal, { once: true });
  image.addEventListener("error", reveal, { once: true });
}
document.querySelector("#year").textContent = new Date().getFullYear();
document
  .querySelector(".language-switch")
  .addEventListener("click", (event) => {
    const link = event.currentTarget;
    link.hash = location.hash;
  });

// Smooth only deliberate anchor navigation, never layout corrections or wheel input.
function anchorTop(target) {
  if (target.querySelector(".project-pin"))
    return Math.max(
      0,
      target.getBoundingClientRect().top +
        scrollY +
        parseFloat(getComputedStyle(target).paddingTop) -
        header.offsetHeight -
        20,
    );
  const content = target.querySelector(".section-kicker, h2") || target;
  return Math.max(
    0,
    content.getBoundingClientRect().top + scrollY - header.offsetHeight - 20,
  );
}
document.addEventListener("click", (event) => {
  const link = event.target.closest('a[href^="#"]');
  if (
    !link ||
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return;
  const target = document.getElementById(link.hash.slice(1));
  if (!target) return;
  event.preventDefault();
  const top = anchorTop(target);
  if (location.hash !== link.hash) history.pushState(null, "", link.hash);
  target.setAttribute("tabindex", "-1");
  target.focus({ preventScroll: true });
  scrollToPosition(top);
});

const initialHash = location.hash;
const anchorIntent = new AbortController();
let userNavigated = false;
for (const type of ["wheel", "touchstart", "pointerdown", "keydown"])
  addEventListener(
    type,
    () => {
      userNavigated = true;
    },
    { passive: true, signal: anchorIntent.signal },
  );
const motionReady = import("./animations.js").catch(() => {
  /* All content remains usable if motion cannot load. */
});
// Pin spacing and font metrics must settle before restoring a section on PT/EN navigation.
Promise.all([motionReady, document.fonts?.ready]).then(() => {
  anchorIntent.abort();
  if (
    userNavigated ||
    !initialHash ||
    location.hash !== initialHash ||
    performance.getEntriesByType("navigation")[0]?.type === "back_forward"
  )
    return;
  let id;
  try {
    id = decodeURIComponent(initialHash.slice(1));
  } catch {
    return;
  }
  requestAnimationFrame(() => {
    const target = document.getElementById(id);
    if (target) scrollToPosition(anchorTop(target), "instant");
  });
});
