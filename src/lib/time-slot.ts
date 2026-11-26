// Time of day on the visitor's clock. public/init.js has the same rule in plain JS for first paint (a test keeps them equal).

export type Slot = 'morning' | 'afternoon' | 'sunset' | 'night';

export const slotFor = (hour: number): Slot =>
  hour >= 6 && hour < 12 ? 'morning' : hour >= 12 && hour < 18 ? 'afternoon' : hour >= 18 && hour < 21 ? 'sunset' : 'night';
