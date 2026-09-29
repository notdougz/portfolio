// "Beyond the code" drawer: opened from the about section, slides in from the right.
const drawer = document.querySelector(".life-drawer");
const reduced = () => document.documentElement.dataset.motion === "reduced";
let opener = null;
let closing = false;

function openDrawer(event) {
  event?.preventDefault();
  if (!drawer || drawer.open) return;
  opener = event?.currentTarget ?? document.activeElement;
  drawer.showModal();
  document.documentElement.classList.add("drawer-open");
  drawer.querySelector(".life-drawer-panel").scrollTop = 0;
}

function closeDrawer() {
  if (!drawer?.open || closing) return;
  if (reduced()) return drawer.close();
  closing = true;
  drawer.classList.add("is-closing");
  drawer.addEventListener(
    "animationend",
    () => {
      drawer.classList.remove("is-closing");
      closing = false;
      drawer.close();
    },
    { once: true },
  );
}

if (drawer) {
  for (const trigger of document.querySelectorAll(
    ".life-teaser, [data-open-life]",
  ))
    trigger.addEventListener("click", openDrawer);
  drawer
    .querySelector(".life-drawer-close")
    .addEventListener("click", closeDrawer);
  drawer.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeDrawer();
  });
  drawer.addEventListener("click", (event) => {
    if (event.target === drawer) closeDrawer();
  });
  drawer.addEventListener("close", () => {
    document.documentElement.classList.remove("drawer-open");
    opener?.focus({ preventScroll: true });
  });
  if (location.hash === "#alem-do-codigo") openDrawer();
}
