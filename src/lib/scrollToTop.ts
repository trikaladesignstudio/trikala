export const MAIN_SCROLL_CONTAINER_ID = "mainCointainer";
export const SITE_FOOTER_ID = "site-footer";

export function scrollToTop() {
  const main = document.getElementById(MAIN_SCROLL_CONTAINER_ID);
  const mainScrollable = main && main.scrollHeight > main.clientHeight;

  if (mainScrollable) {
    main.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}
