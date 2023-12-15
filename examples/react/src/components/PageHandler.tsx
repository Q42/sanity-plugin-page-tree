import { useLocation } from 'react-router-dom';
import { HomePage } from '../pages/HomePage.tsx';
import { ContentPage } from '../pages/ContentPage.tsx';
import { NotFound } from '../pages/NotFound.tsx';
import { usePageTree } from '../hooks/use-page-tree.ts';

export const PageHandler = () => {
  const location = useLocation();
  const { allPageMetadata } = usePageTree();

  const pageMetadata = allPageMetadata.find(pageMetadata => pageMetadata.url === location.pathname);
  if (!pageMetadata) {
    return <NotFound />;
  }

  switch (pageMetadata.type) {
    case 'homePage': {
      return <HomePage pageId={pageMetadata._id} />;
    }
    case 'contentPage': {
      return <ContentPage pageId={pageMetadata._id} />;
    }
    default:
      return <NotFound />;
  }
};
