// The LA '26 room at each time of day, as a still picture for the home teaser (the full interactive room is M9).
// Built from the approved template: every {{hole}} gets the value of that time state, with the radio off.
import type { APIRoute, GetStaticPaths } from 'astro';
import template from '../../assets/rooms/la-2026.template.svg?raw';
import room from '../../assets/rooms/la-2026.json';

type State = Record<string, string | number>;
const states = room.timeStates as Record<string, State>;
const radioOff = room.toggles['radio (toggleRadio)'].off;

export const getStaticPaths: GetStaticPaths = () => Object.keys(states).map((slot) => ({ params: { slot } }));

export function fill(slot: string): string {
  const state = states[slot]!;
  const values: State = { ...state, ...radioOff, shroomOp: 0, discoOp: 0, ledC: '#3a3c48', timeLabel: state.label! };
  return template.replace(/\{\{(\w+)\}\}/g, (_, hole: string) => {
    if (!(hole in values)) throw new Error(`la-2026 ${slot}: no value for {{${hole}}}`);
    return String(values[hole]);
  });
}

export const GET: APIRoute = ({ params }) => new Response(fill(params.slot!), { headers: { 'Content-Type': 'image/svg+xml' } });
