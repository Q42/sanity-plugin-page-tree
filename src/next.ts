import { FilteredResponseQueryOptions, SanityClient } from 'next-sanity';

import { getAllPageMetadata } from './helpers/page-tree';
import { getAllRawPageMetadataQuery } from './queries';
import { PageMetadata, PageTreeConfig } from './types';

export type { PageMetadata } from './types';

/**
 * @public
 */
export type NextPageTreeClientOptions = {
  config: PageTreeConfig;
  client: SanityClient;
  fetchOptions?: FilteredResponseQueryOptions;
};

/**
 * @public
 */
export const createNextPageTreeClient = ({ config, client, fetchOptions }: NextPageTreeClientOptions) => {
  return new NextPageTreeClient(config, client, fetchOptions);
};

class NextPageTreeClient {
  private readonly config: PageTreeConfig;
  private readonly client: SanityClient;
  private readonly defaultSanityFetchOptions?: FilteredResponseQueryOptions;

  constructor(config: PageTreeConfig, client: SanityClient, defaultSanityFetchOptions?: FilteredResponseQueryOptions) {
    this.config = config;
    this.client = client;
    this.defaultSanityFetchOptions = defaultSanityFetchOptions;
  }

  public async getAllPageMetadata(): Promise<PageMetadata[]> {
    const rawPageMetadata = await this.client.fetch(
      getAllRawPageMetadataQuery(this.config),
      undefined,
      this.defaultSanityFetchOptions ?? {},
    );
    return getAllPageMetadata(this.config, rawPageMetadata);
  }

  public async getPageMetadataById(id: string): Promise<PageMetadata | undefined> {
    const pageMetadatas = await this.getAllPageMetadata();
    return pageMetadatas.find(page => page._id === id);
  }

  public async getPageMetadataByPath(path: string): Promise<PageMetadata | undefined> {
    const pageMetadatas = await this.getAllPageMetadata();
    return pageMetadatas.find(page => page.path === path);
  }
}
