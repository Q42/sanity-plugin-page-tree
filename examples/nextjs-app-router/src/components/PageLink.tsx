import Link from 'next/link';
import { PropsWithChildren } from 'react';
import { pageTreeClient } from '../../page-tree.client';

export type PageLinkProps = {
  link: { _ref: string; _type: 'reference' };
};

const PageLink = async ({ children, link }: PropsWithChildren<PageLinkProps>) => {
  const pageMetadata = await pageTreeClient.getPageMetadataById(link._ref);
  const path = pageMetadata?.path;

  if (!path) {
    console.error(`No path found for page id ${link._ref}`, link);
    return <>{children}</>;
  }

  return (
    <Link href={path}>
      {children}
    </Link>
  )
}


export default PageLink;
