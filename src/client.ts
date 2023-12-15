import { PageTreeConfig, PageMetadata } from './types';
import { getAllPageMetadata } from './helpers/page-tree';
import { getRawPageMetadataQuery } from './queries';
import { SanityClient } from 'sanity';

export type { PageMetadata } from './types';

export type PageTreeClientOptions = {
  config: PageTreeConfig;
  client: SanityClient;
};

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
    const rawPageMetadata = await this.client.fetch(getRawPageMetadataQuery(this.config));
    return getAllPageMetadata(this.config, rawPageMetadata);
  }
}
