// An open customizable <select> picker is anchored to its select and rides along when the page scrolls
// (iOS keeps it open while you drag). Close it as soon as the page scrolls or a finger drags outside it.
const closePicker = (e: Event) => {
  let open: HTMLSelectElement | null = null;
  try { open = document.querySelector<HTMLSelectElement>('select:open'); } catch { return; } // no :open, no base-select picker
  if (!open || (e.target instanceof Node && open.contains(e.target))) return; // scrolling inside the list itself is fine
  // there is no hidePicker(); re-inserting the select is the one way that closes it in both Chromium and WebKit
  // (blur, disabled, inert and size all fail in at least one); keep the focus where it was for keyboard users
  open.parentNode!.insertBefore(open, open.nextSibling);
  open.focus({ preventScroll: true });
};
addEventListener('scroll', closePicker, { capture: true, passive: true });
addEventListener('touchmove', closePicker, { passive: true });
