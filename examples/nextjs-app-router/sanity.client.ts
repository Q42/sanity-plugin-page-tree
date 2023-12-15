import { createClient } from 'next-sanity';
import { apiVersion } from './sanity/env';
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

export const sanityClient = createClient({
  apiVersion: apiVersion,
  projectId,
  dataset,
  perspective: 'published',
});
