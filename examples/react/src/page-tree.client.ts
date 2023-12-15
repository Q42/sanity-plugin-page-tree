import { sanityClient } from './sanity.client';
import { pageTreeConfig } from './page-tree.config';
import { createPageTreeClient } from 'sanity-plugin-page-tree/client';

export const pageTreeClient = createPageTreeClient({
  config: pageTreeConfig,
  client: sanityClient,
});
