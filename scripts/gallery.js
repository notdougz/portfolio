import PhotoSwipe from "photoswipe";
import "photoswipe/style.css";
import { t } from "./i18n.js";

export function openGallery(gallery, opener) {
  const dataSource = gallery.images.map(([file, description]) => {
    const [width, height] =
      file === "mobile.png"
        ? [383, 836]
        : [file === "previsao-chegada.png" ? 1918 : 1920, 1080];
    return { src: `assets/${file}`, width, height, alt: t(description) };
  });
  const viewer = new PhotoSwipe({
    dataSource,
    bgOpacity: 0.98,
    showHideAnimationType: "fade",
    showAnimationDuration: 220,
    hideAnimationDuration: 180,
    paddingFn: (size) => ({
      top: 70,
      bottom: size.x < 600 ? 160 : 140,
      left: 16,
      right: 16,
    }),
    trapFocus: true,
    returnFocus: false,
    closeTitle: t("Fechar galeria"),
    zoomTitle: t("Ampliar ou reduzir imagem"),
    arrowPrevTitle: t("Imagem anterior"),
    arrowNextTitle: t("Próxima imagem"),
    errorMsg: t("Não foi possível carregar a imagem."),
    indexIndicatorSep: " / ",
  });
  const background = new Map();
  viewer.on("keydown", ({ originalEvent: event }) => {
    if (event.key !== "Tab") return;
    const controls = [
      ...viewer.element.querySelectorAll("button, a[href]"),
    ].filter((element) => !element.disabled && element.getClientRects().length);
    const first = controls[0];
    const last = controls.at(-1);
    if (
      event.shiftKey &&
      (document.activeElement === first ||
        document.activeElement === viewer.element)
    ) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });
  viewer.on("uiRegister", () => {
    viewer.ui.registerElement({
      name: "project-details",
      order: 9,
      appendTo: "root",
      onInit: (element) => {
        const title = document.createElement("strong");
        title.textContent = t(gallery.title);
        const caption = document.createElement("p");
        caption.setAttribute("aria-live", "polite");
        caption.setAttribute("aria-atomic", "true");
        const code = document.createElement("a");
        code.href = gallery.code;
        code.target = "_blank";
        code.rel = "noopener noreferrer";
        code.textContent = t("Ver código no GitHub ↗");
        element.append(title, caption, code);
        viewer.on("change", () => {
          caption.textContent = `${viewer.currIndex + 1} / ${dataSource.length} — ${viewer.currSlide.data.alt}`;
        });
      },
    });
  });
  viewer.on("afterInit", () => {
    viewer.element.setAttribute("aria-label", t(gallery.title));
    for (const element of document.body.children) {
      if (element === viewer.element || element.tagName === "SCRIPT") continue;
      background.set(element, element.inert);
      element.inert = true;
    }
    document.body.classList.add("dialog-open");
  });
  viewer.on("destroy", () => {
    for (const [element, inert] of background) element.inert = inert;
    document.body.classList.remove("dialog-open");
    opener.focus({ preventScroll: true });
  });
  viewer.init();
}
