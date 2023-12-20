import { createNextPageTreeClient } from "@q42/sanity-plugin-page-tree/next";
import { sanityClient } from './sanity.client';
import { pageTreeConfig } from './page-tree.config';

export const pageTreeClient = createNextPageTreeClient({
  config: pageTreeConfig,
  client: sanityClient,
});

