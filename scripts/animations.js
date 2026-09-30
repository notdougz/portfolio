import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { scrollToPosition, setSmoothScroll } from "./scroll.js";

gsap.registerPlugin(ScrollTrigger, SplitText);
ScrollTrigger.config({ ignoreMobileResize: true });

let media;
const viewport = document.querySelector(".project-viewport");
const projects = document.querySelector(".projects-section");
const projectPin = document.querySelector(".project-pin");
let disposed = false;

const maxProjectScroll = () =>
  viewport ? Math.max(0, viewport.scrollWidth - viewport.clientWidth) : 0;
const refresh = () => {
  if (!disposed) ScrollTrigger.refresh();
};

function initializeMotion() {
  media?.revert();
  media = gsap.matchMedia();
  media.add("(prefers-reduced-motion: no-preference)", () => {
    const cleanups = [];
    // While the curtain covers the page, the hero waits and enters as it opens.
    const covered = document.documentElement.classList.contains("curtain-in");
    const heroIntro = gsap.timeline({ paused: covered, delay: 0.15 });
    if (covered) {
      const play = () => heroIntro.play();
      document.addEventListener("portfolio:curtain-open", play, { once: true });
      cleanups.push(() =>
        document.removeEventListener("portfolio:curtain-open", play),
      );
    }
    const heroTitle = document.querySelector("#hero-title");
    if (heroTitle) {
      // The name rises out of a line mask, one character at a time.
      SplitText.create(heroTitle, {
        type: "lines,chars",
        mask: "lines",
        linesClass: "split-line",
        onSplit: (self) =>
          heroIntro.from(
            self.chars,
            {
              yPercent: 118,
              rotate: 7,
              duration: 1.1,
              stagger: 0.035,
              ease: "expo.out",
            },
            covered ? 0.35 : 0,
          ),
      });
    }
    heroIntro.from(
      ".hero-intro > :not(h1), .hero-role > *",
      {
        y: 24,
        opacity: 0,
        stagger: 0.08,
        duration: 0.8,
        ease: "power3.out",
        clearProps: "all",
      },
      covered ? 0.5 : 0,
    );
    heroIntro.from(
      ".avatar-float",
      {
        y: covered ? 60 : 16,
        scale: covered ? 0.94 : 1,
        opacity: 0,
        duration: covered ? 1.2 : 0.8,
        ease: "expo.out",
        clearProps: "all",
      },
      covered ? 0.25 : 0,
    );

    const rail = document.querySelector(".timeline-rail");
    if (rail) {
      const progress = rail.querySelector(".timeline-progress");
      const milestones = document.querySelectorAll(
        ".timeline .experience, .timeline .previous-experience summary",
      );
      const drawTimeline = () => {
        // The line follows a fixed viewport position, including as details grow.
        const railTop = rail.getBoundingClientRect().top;
        const position = gsap.utils.clamp(
          0,
          rail.offsetHeight,
          innerHeight * 0.58 - railTop,
        );
        gsap.set(progress, { height: position });
        for (const milestone of milestones) {
          if (!milestone.getClientRects().length) {
            milestone.classList.remove("is-reached");
            continue;
          }
          const marker = getComputedStyle(milestone, "::before");
          const markerCenter =
            milestone.getBoundingClientRect().top -
            railTop +
            parseFloat(marker.top) +
            parseFloat(marker.height) / 2;
          milestone.classList.toggle("is-reached", position >= markerCenter);
        }
      };
      ScrollTrigger.create({
        trigger: ".timeline",
        start: "top 58%",
        end: "bottom 58%",
        onUpdate: drawTimeline,
        onRefresh: drawTimeline,
        onEnter: drawTimeline,
        onEnterBack: drawTimeline,
        onLeave: drawTimeline,
        onLeaveBack: drawTimeline,
      });
      drawTimeline();
    }

    // Entrances finish on their own and replay when the reader scrolls back up.
    const replay = "play none none reverse";
    for (const row of document.querySelectorAll(".timeline > .experience")) {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: row,
            start: "top 86%",
            toggleActions: replay,
          },
        })
        .from(row.querySelector(".experience-company"), {
          x: -70,
          autoAlpha: 0,
          duration: 0.85,
          ease: "power3.out",
        })
        .from(
          row.querySelector(".experience-date"),
          {
            y: 50,
            scale: 0.8,
            autoAlpha: 0,
            duration: 0.85,
            ease: "back.out(1.7)",
          },
          "<0.08",
        )
        .from(
          row.querySelectorAll(
            ".experience-description > p, .experience-points li",
          ),
          {
            x: 70,
            autoAlpha: 0,
            duration: 0.75,
            stagger: 0.08,
            ease: "power3.out",
          },
          "<0.08",
        );
    }
    for (const title of document.querySelectorAll(
      ".experience-section h2, .projects-section h2, .tech-section h2, .ai-section h2, .education-section h2",
    )) {
      SplitText.create(title, {
        type: "lines",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 112,
            duration: 1.05,
            stagger: 0.12,
            ease: "expo.out",
            scrollTrigger: {
              trigger: title,
              start: "top 88%",
              toggleActions: replay,
            },
          }),
      });
    }
    const contactTitle = document.querySelector("#contact-title");
    if (contactTitle) {
      SplitText.create(contactTitle, {
        type: "lines,chars",
        mask: "lines",
        linesClass: "split-line",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.chars, {
            yPercent: 120,
            duration: 1.1,
            stagger: 0.028,
            ease: "expo.out",
            scrollTrigger: {
              trigger: contactTitle,
              start: "top 90%",
              once: true,
            },
          }),
      });
    }
    for (const grid of document.querySelectorAll(".services-grid")) {
      gsap.from(grid.children, {
        y: 16,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: grid, start: "top 90%", once: true },
        clearProps: "all",
      });
    }
    for (const grid of document.querySelectorAll(".tech-list")) {
      gsap.from(grid.children, {
        y: 22,
        scale: 0.82,
        opacity: 0,
        duration: 0.7,
        stagger: 0.06,
        ease: "back.out(1.8)",
        scrollTrigger: {
          trigger: grid,
          start: "top 90%",
          toggleActions: replay,
        },
      });
    }

    // Magnetic controls (x/y driven by the pointer) are revealed through their parents.
    const blocks = gsap.utils.toArray(
      [
        ".about-copy > :not(h2)",
        ".section-heading > .section-kicker",
        ".ai-heading > :not(h2):not(.text-link)",
        ".ai-capabilities > *",
        ".ai-case > *",
        ".ai-workflow > *",
        ".ai-knowledge li",
        ".tech-group > h3",
        ".education-heading > :not(h2)",
        ".education-cards > article",
        ".previous-experience > summary",
        ".contact-intro",
        ".contact-bottom > *",
      ].join(","),
    );
    gsap.set(blocks, { autoAlpha: 0, y: 64 });
    ScrollTrigger.batch(blocks, {
      start: "top 92%",
      onEnter: (batch) =>
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          duration: 0.95,
          stagger: 0.1,
          ease: "back.out(1.5)",
          overwrite: true,
        }),
      onLeaveBack: (batch) =>
        gsap.to(batch, {
          autoAlpha: 0,
          y: 64,
          duration: 0.4,
          stagger: 0.04,
          ease: "power2.in",
          overwrite: true,
        }),
    });
    gsap.from(".project-card", {
      y: 48,
      opacity: 0,
      duration: 0.9,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: { trigger: ".project-grid", start: "top 85%", once: true },
      clearProps: "opacity,transform",
    });

    // Metrics count up once; the markup always holds the real value.
    for (const counter of document.querySelectorAll("[data-count]")) {
      const target = Number(counter.dataset.count);
      if (!Number.isFinite(target)) continue;
      const state = { value: 0 };
      gsap.to(state, {
        value: target,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: counter, start: "top 92%", once: true },
        onUpdate: () => {
          counter.textContent = Math.round(state.value);
        },
      });
      cleanups.push(() => {
        counter.textContent = counter.dataset.count;
      });
    }

    // The arrow to the "beyond the code" drawer draws itself once.
    const arrow = document.querySelector(".life-teaser-arrow");
    if (arrow) {
      const paths = arrow.querySelectorAll("path");
      for (const path of paths) {
        const length = path.getTotalLength();
        gsap.fromTo(
          path,
          { strokeDasharray: length, strokeDashoffset: length },
          {
            strokeDashoffset: 0,
            duration: path.classList.contains("arrow-head") ? 0.35 : 0.9,
            delay: path.classList.contains("arrow-head") ? 0.85 : 0.1,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: ".life-teaser",
              start: "top 92%",
              once: true,
            },
            clearProps: "strokeDasharray,strokeDashoffset",
          },
        );
      }
      gsap.from(".life-teaser-photo", {
        rotate: 14,
        scale: 0.7,
        opacity: 0,
        duration: 0.9,
        delay: 0.7,
        ease: "back.out(1.6)",
        scrollTrigger: {
          trigger: ".life-teaser",
          start: "top 92%",
          once: true,
        },
        clearProps: "all",
      });
    }

    gsap.to(".scroll-progress span", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { start: 0, end: "max", scrub: 0.2 },
    });

    // The stack band drifts on its own and speeds up with the scroll.
    const track = document.querySelector(".marquee-track");
    if (track) {
      const loop = gsap.to(track, {
        xPercent: -50,
        duration: 40,
        ease: "none",
        repeat: -1,
      });
      const skew = gsap.quickTo(track, "skewX", {
        duration: 0.5,
        ease: "power3",
      });
      let boost = 0;
      let direction = 1;
      const band = ScrollTrigger.create({
        trigger: ".stack-marquee",
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
        onUpdate: (self) => {
          boost = Math.min(Math.abs(self.getVelocity()) / 250, 7);
          direction = self.direction;
        },
      });
      if (!band.isActive) loop.pause();
      const drift = () => {
        boost *= 0.93;
        loop.timeScale(1 + boost);
        skew(-direction * Math.min(boost * 1.3, 8));
      };
      gsap.ticker.add(drift);
      cleanups.push(() => gsap.ticker.remove(drift));
    }

    return () => cleanups.forEach((cleanup) => cleanup());
  });

  media.add(
    "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    () => {
      const listeners = [];
      const on = (target, type, handler) => {
        target.addEventListener(type, handler);
        listeners.push(() => target.removeEventListener(type, handler));
      };

      // Controls lean toward the pointer and settle back when it leaves.
      for (const element of document.querySelectorAll(
        ".resume-link, .project-prev, .project-next, .contact-section h2 a, .contact-social a, .text-link, .copy-email",
      )) {
        const strength = element.closest("h2") ? 0.18 : 0.32;
        const x = gsap.quickTo(element, "x", { duration: 0.5, ease: "power3" });
        const y = gsap.quickTo(element, "y", { duration: 0.5, ease: "power3" });
        on(element, "pointermove", (event) => {
          const box = element.getBoundingClientRect();
          x((event.clientX - box.left - box.width / 2) * strength);
          y((event.clientY - box.top - box.height / 2) * strength);
        });
        on(element, "pointerleave", () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            duration: 0.9,
            ease: "elastic.out(1, 0.45)",
            overwrite: true,
          });
        });
      }

      // Project cards: a light follows the pointer and the card tilts slightly.
      for (const card of document.querySelectorAll(".project-card")) {
        gsap.set(card, { transformPerspective: 1100 });
        const rotateX = gsap.quickTo(card, "rotationX", {
          duration: 0.6,
          ease: "power3",
        });
        const rotateY = gsap.quickTo(card, "rotationY", {
          duration: 0.6,
          ease: "power3",
        });
        on(card, "pointermove", (event) => {
          const box = card.getBoundingClientRect();
          const px = (event.clientX - box.left) / box.width;
          const py = (event.clientY - box.top) / box.height;
          card.style.setProperty("--mx", `${px * 100}%`);
          card.style.setProperty("--my", `${py * 100}%`);
          rotateX((0.5 - py) * 5);
          rotateY((px - 0.5) * 6);
        });
        on(card, "pointerleave", () => {
          rotateX(0);
          rotateY(0);
        });
      }

      // The portrait follows the pointer with a little depth.
      const hero = document.querySelector(".intro-journey");
      const portrait = document.querySelector(".avatar-float img");
      const halo = document.querySelector(".portrait-halo");
      if (hero && portrait) {
        const px = gsap.quickTo(portrait, "x", { duration: 1, ease: "power3" });
        const py = gsap.quickTo(portrait, "y", { duration: 1, ease: "power3" });
        const hx =
          halo && gsap.quickTo(halo, "x", { duration: 1.4, ease: "power3" });
        const hy =
          halo && gsap.quickTo(halo, "y", { duration: 1.4, ease: "power3" });
        on(hero, "pointermove", (event) => {
          const nx = event.clientX / innerWidth - 0.5;
          const ny = event.clientY / innerHeight - 0.5;
          px(nx * 18);
          py(ny * 12);
          hx?.(nx * -34);
          hy?.(ny * -22);
        });
      }

      // A soft ring trails the pointer and says what a click will do.
      const cursor = document.querySelector(".cursor");
      const ring = cursor?.querySelector(".cursor-ring");
      if (cursor && ring) {
        const english = document.documentElement.lang === "en";
        const label = cursor.querySelector(".cursor-label");
        const ringX = gsap.quickTo(ring, "x", {
          duration: 0.45,
          ease: "power3",
        });
        const ringY = gsap.quickTo(ring, "y", {
          duration: 0.45,
          ease: "power3",
        });
        document.documentElement.classList.add("has-cursor");
        on(window, "pointermove", (event) => {
          if (event.pointerType !== "mouse") return;
          ringX(event.clientX);
          ringY(event.clientY);
          cursor.classList.add("is-visible");
        });
        on(document.documentElement, "pointerleave", () =>
          cursor.classList.remove("is-visible"),
        );
        on(document, "pointerover", (event) => {
          const view = event.target.closest(".project-image, .life-teaser");
          const link = event.target.closest("a, button, summary, [tabindex]");
          cursor.classList.toggle("is-view", Boolean(view));
          cursor.classList.toggle("is-link", Boolean(link) && !view);
          if (view)
            label.textContent = view.classList.contains("life-teaser")
              ? english
                ? "open"
                : "abrir"
              : english
                ? "view"
                : "ver";
        });
        listeners.push(() =>
          document.documentElement.classList.remove("has-cursor"),
        );
      }

      return () => listeners.forEach((remove) => remove());
    },
  );

  media.add(
    "(min-width: 1000px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    () => {
      const lenis = new Lenis({
        duration: 0.9,
        wheelMultiplier: 1,
        smoothWheel: true,
        syncTouch: false,
        autoToggle: true,
        prevent: (node) => Boolean(node.closest(".pswp, .life-drawer")),
      });
      setSmoothScroll(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      const tick = (time) => lenis.raf(time * 1000);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      return () => {
        gsap.ticker.remove(tick);
        lenis.destroy();
        setSmoothScroll(null);
      };
    },
  );

  media.add(
    "(min-width: 1000px) and (prefers-reduced-motion: no-preference)",
    () => {
      if (!document.querySelector(".hero-portrait")) return;
      gsap.set(".hero-portrait", { xPercent: -50, yPercent: 0, x: 0, y: 0 });
      // A single portrait follows the introduction into the about section.
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ".intro-journey",
            start: "top top",
            endTrigger: ".about-section",
            end: "top top",
            scrub: 0.3,
            invalidateOnRefresh: true,
          },
        })
        .to(
          ".hero-portrait",
          {
            x: () => -innerWidth * 0.27,
            y: () => -innerHeight * 0.04,
            scale: 0.9,
            rotation: 0,
            ease: "power1.inOut",
            duration: 1,
          },
          0,
        )
        .to(
          ".hero-intro",
          { x: -80, opacity: 0, ease: "power1.in", duration: 0.45 },
          0,
        )
        .to(
          ".hero-role",
          { x: 80, opacity: 0, ease: "power1.in", duration: 0.45 },
          0,
        )
        .to(".hero-bottom", { opacity: 0, duration: 0.2 }, 0);

      gsap.fromTo(
        ".avatar-track",
        { opacity: 1 },
        {
          opacity: 0,
          ease: "none",
          scrollTrigger: {
            trigger: ".about-section",
            start: "bottom 110%",
            end: "bottom 60%",
            scrub: 0.2,
          },
        },
      );
    },
  );

  media.add(
    "(min-width: 1000px) and (min-height: 560px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    () => {
      if (!viewport || !projects || !projectPin) return;
      // CSS sticky owns the pin. No spacer insertion or scroll-position correction.
      const measure = () => {
        // Centred in the space under the header when there is room to spare.
        const headerSpace =
          (document.querySelector(".site-header")?.offsetHeight || 76) + 16;
        const offset = Math.max(
          headerSpace,
          Math.min(
            (innerHeight + headerSpace - projectPin.offsetHeight) / 2,
            innerHeight - projectPin.offsetHeight - 20,
          ),
        );
        projects.style.setProperty("--project-offset", `${offset}px`);
        projects.style.setProperty(
          "--project-height",
          `${projectPin.offsetHeight}px`,
        );
        projects.style.setProperty(
          "--project-travel",
          `${maxProjectScroll()}px`,
        );
      };
      projects.classList.add("is-pinned");
      measure();
      const tween = gsap.fromTo(
        viewport,
        { scrollLeft: 0 },
        {
          scrollLeft: maxProjectScroll,
          ease: "none",
          scrollTrigger: {
            trigger: projects,
            start: () =>
              `top ${parseFloat(projects.style.getPropertyValue("--project-offset")) - parseFloat(getComputedStyle(projects).paddingTop)}px`,
            end: () => "+=" + maxProjectScroll(),
            scrub: 0.18,
            invalidateOnRefresh: true,
            onRefreshInit: measure,
          },
        },
      );
      const navigate = (event) => {
        const trigger = tween.scrollTrigger;
        const bounds = projectPin.getBoundingClientRect();
        if (
          bounds.top >= innerHeight ||
          bounds.bottom <= 0 ||
          !maxProjectScroll()
        )
          return;
        if (event.detail.source === "focus" && !trigger.isActive) return;
        event.preventDefault();
        const ratio = gsap.utils.clamp(
          0,
          1,
          event.detail.left / maxProjectScroll(),
        );
        scrollToPosition(
          trigger.start + ratio * (trigger.end - trigger.start),
          event.detail.behavior,
        );
        if (event.detail.behavior === "instant") {
          ScrollTrigger.update();
          trigger.getTween()?.progress(1);
        }
      };
      document.addEventListener("portfolio:project-navigate", navigate);
      document.dispatchEvent(new Event("portfolio:projects-ready"));
      return () => {
        document.removeEventListener("portfolio:project-navigate", navigate);
        projects.classList.remove("is-pinned");
        for (const property of [
          "--project-offset",
          "--project-height",
          "--project-travel",
        ])
          projects.style.removeProperty(property);
        document.dispatchEvent(new Event("portfolio:projects-ready"));
      };
    },
  );
}
await document.fonts?.ready;
initializeMotion();

const previousExperience = document.querySelector(".previous-experience");
previousExperience?.addEventListener("toggle", refresh);

window.addEventListener("load", refresh, { once: true });

if (import.meta.hot)
  import.meta.hot.dispose(() => {
    disposed = true;

    previousExperience?.removeEventListener("toggle", refresh);
    window.removeEventListener("load", refresh);
    media.revert();
  });
