import { PageTreeConfig, PageMetadata } from './types';
import { getAllPageMetadata } from './helpers/page-tree';
import { getRawPageMetadataQuery } from './queries';
import { SanityClient } from 'next-sanity';

export type { PageMetadata } from './types';

export type NextPageTreeClientOptions = {
  config: PageTreeConfig;
  client: SanityClient;
};

export const createNextPageTreeClient = ({ config, client }: NextPageTreeClientOptions) => {
  return new NextPageTreeClient(config, client);
};

class NextPageTreeClient {
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

  public async getPageMetadataById(id: string): Promise<PageMetadata | undefined> {
    const pageMetadatas = await this.getAllPageMetadata();
    return pageMetadatas.find(page => page._id === id);
  }

  public async getPageMetadataByUrl(url: string): Promise<PageMetadata | undefined> {
    const pageMetadatas = await this.getAllPageMetadata();
    return pageMetadatas.find(page => page.url === url);
  }
}
