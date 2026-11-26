// Pages are built for the UTC date with the day either side ([data-days] > [data-day]): show the visitor's own day,
// and start times ([data-local-time]) in the visitor's own clock.
import { localDateKey } from '../lib/dates';

const today = localDateKey();
for (const group of document.querySelectorAll<HTMLElement>('[data-days]')) {
  const days = [...group.querySelectorAll<HTMLElement>(':scope > [data-day]')];
  if (!days.some((d) => d.dataset.day === today)) continue; // a stale build keeps what it has
  for (const d of days) d.hidden = d.dataset.day !== today;
}
for (const time of document.querySelectorAll<HTMLTimeElement>('[data-local-time]')) {
  time.textContent = new Date(time.dateTime).toLocaleTimeString(document.documentElement.lang, { hour: '2-digit', minute: '2-digit' });
}
