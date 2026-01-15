import { init } from '@instantdb/react';

// InstantDB configuration
const APP_ID = import.meta.env.VITE_INSTANT_APP_ID || '';

export const db = init({ appId: APP_ID });
