import { Link } from 'react-router-dom';
import { PropsWithChildren } from 'react';
import { usePageTree } from '../hooks/use-page-tree.ts';

export type PageLinkProps = {
  link: { _ref: string; _type: 'reference' };
};

export const PageLink = ({ link, children }: PropsWithChildren<PageLinkProps>) => {
  const { allPageMetadata } = usePageTree();
  const url = allPageMetadata.find(pageMetadata => pageMetadata._id === link._ref)?.url;

  if (!url) {
    return children;
  }

  return <Link to={url}>{children}</Link>;
};
