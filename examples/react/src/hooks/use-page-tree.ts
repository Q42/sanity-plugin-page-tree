import { useContext } from 'react';
import { PageTreeContext, PageTreeContextState } from '../PageTreeProvider.tsx';

export const usePageTree = (): Required<PageTreeContextState> => {
  const context = useContext(PageTreeContext);

  if (!context || !context.allPageMetadata) {
    throw new Error('usePageTree must be used within a PageTreeProvider');
  }

  return context as Required<PageTreeContextState>;
};
