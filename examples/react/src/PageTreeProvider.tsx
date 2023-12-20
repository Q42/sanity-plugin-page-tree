import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { pageTreeClient } from './page-tree.client.ts';
import { PageMetadata } from '@q42/sanity-plugin-page-tree/client';

export type PageTreeContextState = {
  allPageMetadata?: PageMetadata[];
};

export const PageTreeContext = createContext<PageTreeContextState>({});

export const PageTreeProvider = ({ children }: PropsWithChildren) => {
  const [allPageMetadata, setAllPageMetadata] = useState<PageMetadata[]>();

  useEffect(() => {
    const getAllPageMetadata = async () => {
      const allPageMetadata = await pageTreeClient.getAllPageMetadata();
      setAllPageMetadata(allPageMetadata);
    };

    void getAllPageMetadata();
  }, []);

  return allPageMetadata ? (
    <PageTreeContext.Provider value={{ allPageMetadata }}>{children}</PageTreeContext.Provider>
  ) : null;
};
