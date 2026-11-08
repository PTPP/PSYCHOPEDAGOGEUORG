/* Accessible full-screen navigation and locale picker for TPP. No dependencies. */
(() => {
  "use strict";
  const opener = document.getElementById("site-menu-toggle");
  const overlay = document.getElementById("site-menu");
  const closer = overlay?.querySelector("[data-menu-close]");
  const locale = document.querySelector(".language-picker");
  if (!opener || !overlay || !closer) return;

  let returnFocus = opener;
  let isOpen = false;
  const items = () => Array.from(
    overlay.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
  ).filter(element => element.getClientRects().length > 0);

  function setMenu(open, restoreFocus = true) {
    if (isOpen === open) return;
    isOpen = open;
    if (open) {
      returnFocus = document.activeElement instanceof HTMLElement ? document.activeElement : opener;
      if (locale) locale.open = false;
      overlay.hidden = false;
      overlay.inert = false;
      overlay.setAttribute("aria-hidden", "false");
      opener.setAttribute("aria-expanded", "true");
      opener.setAttribute("aria-label", document.documentElement.lang === "en" ? "Close navigation" : "Zamknij menu");
      document.body.classList.add("menu-open");
      closer.focus({ preventScroll: true });
    } else {
      overlay.inert = true;
      overlay.hidden = true;
      overlay.setAttribute("aria-hidden", "true");
      opener.setAttribute("aria-expanded", "false");
      opener.setAttribute("aria-label", document.documentElement.lang === "en" ? "Open navigation" : "Otwórz menu");
      document.body.classList.remove("menu-open");
      if (restoreFocus && returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
    }
  }

  opener.addEventListener("click", () => setMenu(true));
  closer.addEventListener("click", () => setMenu(false));
  overlay.addEventListener("click", event => {
    if (event.target.closest("a[href]")) setMenu(false, false);
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      if (isOpen) {
        event.preventDefault();
        setMenu(false);
      } else if (locale?.open) {
        locale.open = false;
        locale.querySelector("summary")?.focus();
      }
      return;
    }
    if (!isOpen || event.key !== "Tab") return;
    const focusable = items();
    if (!focusable.length) { event.preventDefault(); return; }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || !overlay.contains(document.activeElement))) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || !overlay.contains(document.activeElement))) {
      event.preventDefault(); first.focus();
    }
  });
  document.addEventListener("click", event => {
    if (locale?.open && !locale.contains(event.target)) locale.open = false;
  });
})();
