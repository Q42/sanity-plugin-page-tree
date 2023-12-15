import Link from 'next/link';
import { PropsWithChildren, ReactNode } from 'react';
import { PageInfo, getPageTreeHelpers } from 'sanity-plugin-page-tree/client';
import { sanityClient } from '../../sanity.client';
import { pageTreeConfig } from '../../page-tree-config';

export type PageLinkProps = {
  link: { _ref: string; _type: 'reference' };
};

const PageLink = async ({ children, link }: PropsWithChildren<PageLinkProps>) => {
  const {getSitemap, pageInfoQuery} = getPageTreeHelpers(pageTreeConfig);
  const pageInfos = await sanityClient.fetch<PageInfo[]>(pageInfoQuery);
  const sitemap = getSitemap(pageInfos);
  const pageInfo = sitemap.find((page) => page._id === link._ref);
  const url = pageInfo?.url;

  if (!url) {
    console.error(`No url found for page id ${link._ref}`, link);
    return <>{children}</>;
  }

  return (
    <Link href={url}>
      {children}
    </Link>
  )
}


export default PageLink;
