import type { APIContext } from 'astro';
import { feed } from '../views/feed';

export const GET = (context: APIContext) => feed('en', context);
