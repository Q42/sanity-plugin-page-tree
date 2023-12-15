import { PageTreeConfig, SitemapPage } from './types';
import { getSitemap } from './helpers/page-tree';
import { getPageInfoQuery } from './queries';
import { SanityClient } from 'next-sanity';

export type { SitemapPage } from './types';

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

  async getSitemap(): Promise<SitemapPage[]> {
    const pageInfos = await this.client.fetch(getPageInfoQuery(this.config));
    return getSitemap(this.config, pageInfos);
  }

  async getSitemapPageById(id: string): Promise<SitemapPage | undefined> {
    const sitemap = await this.getSitemap();
    return sitemap.find(page => page._id === id);
  }

  async getSitemapPageByUrl(url: string): Promise<SitemapPage | undefined> {
    const sitemap = await this.getSitemap();
    return sitemap.find(page => page.url === url);
  }
}
