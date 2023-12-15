import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { pageTreeClient } from '../../page-tree.client';

export type PageLinkProps = {
  link: { _ref: string; _type: 'reference' };
};

const PageLink = async ({ children, link }: PropsWithChildren<PageLinkProps>) => {
  const pageInfo = await pageTreeClient.getSitemapPageById(link._ref);
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
