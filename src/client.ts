import { SanityClient } from 'sanity';

import { getAllPageMetadata } from './helpers/page-tree';
import { getAllRawPageMetadataQuery } from './queries';
import { PageMetadata, PageTreeConfig } from './types';

export type { PageMetadata } from './types';

/**
 * @public
 */
export type PageTreeClientOptions = {
  config: PageTreeConfig;
  client: SanityClient;
};

/**
 * @public
 */
export const createPageTreeClient = ({ config, client }: PageTreeClientOptions) => {
  return new PageTreeClient(config, client);
};

class PageTreeClient {
  private readonly config: PageTreeConfig;
  private readonly client: SanityClient;

  constructor(config: PageTreeConfig, client: SanityClient) {
    this.config = config;
    this.client = client;
  }

  public async getAllPageMetadata(): Promise<PageMetadata[]> {
    const rawPageMetadata = await this.client.fetch(getAllRawPageMetadataQuery(this.config));
    return getAllPageMetadata(this.config, rawPageMetadata);
  }
}
