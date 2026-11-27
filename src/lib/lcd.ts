/** Text for an LCD (VT323 subset): upper case, curly quotes straightened, accents dropped, anything else non-ASCII removed. */
export const lcdText = (text: string) => text.toUpperCase().replace(/[’‘]/g, "'").normalize('NFKD').replace(/[^\x20-\x7e]/g, '');
