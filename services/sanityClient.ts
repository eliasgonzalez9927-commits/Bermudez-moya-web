import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: 'xo4g3nfc',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2024-01-01'
});
