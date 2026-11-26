import { describe, expect, it } from 'vitest';
import { fromSeated, mergeShows, refreshShows, TOUR_PAGE, type Show } from '../../src/lib/tour';

const event = (id: string, attrs: Record<string, unknown>) => ({
  id,
  type: 'tour-events',
  attributes: { 'starts-at-date-local': '2027-03-14', 'venue-name': 'The Fillmore Charlotte', 'formatted-address': 'Charlotte, NC', 'is-starts-at-known': true, 'starts-at': '2027-03-14T23:00:00Z', 'is-sold-out': false, ...attrs },
});

describe('Seated feed', () => {
  it('turns tour events into shows, oldest first', () => {
    const shows = fromSeated({
      included: [
        { id: 'artist', type: 'artists', attributes: {} },
        event('b', {}),
        event('a', { 'starts-at-date-local': '2026-11-27', 'formatted-address': 'Prague, Prague', 'venue-name': 'MeetFactory', 'starts-at': '2026-11-27T19:00:00Z', 'is-sold-out': true }),
      ],
    });
    expect(shows).toEqual([
      { id: 'a', date: '2026-11-27', startsAt: '2026-11-27T19:00:00.000Z', city: 'Prague', venue: 'MeetFactory', soldOut: true, source: TOUR_PAGE },
      { id: 'b', date: '2027-03-14', startsAt: '2027-03-14T23:00:00.000Z', city: 'Charlotte, NC', venue: 'The Fillmore Charlotte', soldOut: false, source: TOUR_PAGE },
    ]);
  });

  it('keeps the date when the time is not known', () => {
    expect(fromSeated({ included: [event('a', { 'is-starts-at-known': false })] })![0]!.startsAt).toBeNull();
    expect(fromSeated({ included: [event('a', { 'starts-at': 'soon' })] })![0]!.startsAt).toBeNull();
  });

  it('skips malformed events and rejects a feed of the wrong shape', () => {
    const bad = [event('../x', {}), event('c', { 'starts-at-date-local': '14/03/2027' }), event('d', { 'venue-name': '' }), event('e', { 'formatted-address': 42 }), null];
    expect(fromSeated({ included: bad })).toEqual([]);
    expect(fromSeated({ data: [] })).toBeNull();
    expect(fromSeated('<html>')).toBeNull();
    expect(fromSeated(null)).toBeNull();
  });
});

const show = (id: string, date: string): Show => ({ id, date, startsAt: null, city: 'X', venue: 'Y', soldOut: false, source: TOUR_PAGE });

describe('snapshot refresh', () => {
  it('keeps past shows the feed dropped, takes everything else from the feed', () => {
    const previous = [show('old', '2026-11-20'), show('gone', '2027-01-01'), show('kept', '2026-11-25')];
    const fresh = [show('kept', '2026-11-25'), show('new', '2027-02-01')];
    expect(refreshShows(previous, fresh, '2026-11-26').map((s) => s.id)).toEqual(['old', 'kept', 'new']);
  });
});

describe('owner additions and hidden shows', () => {
  it('hides ids and adds manual shows with their start time in UTC', () => {
    const manual = [{ date: '2027-03-04', city: 'Austin', country: 'US', venue: 'Club', timeLocal: '20:00', timezone: 'America/Chicago', source: 'https://example.com/' }];
    const shows = mergeShows([show('a', '2027-03-01'), show('b', '2027-03-02')], manual, ['a']);
    expect(shows.map((s) => s.id)).toEqual(['b', 'manual-2027-03-04-Club']);
    expect(shows[1]).toMatchObject({ startsAt: '2027-03-05T02:00:00.000Z', city: 'Austin, US' });
  });
});
