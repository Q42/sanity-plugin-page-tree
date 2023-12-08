import { createContext, PropsWithChildren, useContext } from 'react';

import { PageTreeConfig } from '../types';

const PageTreeConfigContext = createContext<{ config?: PageTreeConfig }>({});

export type PageTreeConfigProviderProps = {
  config: PageTreeConfig;
};

export const PageTreeConfigProvider = ({ children, config }: PropsWithChildren<PageTreeConfigProviderProps>) => (
  <PageTreeConfigContext.Provider value={{ config }}>{children}</PageTreeConfigContext.Provider>
);

export const usePageTreeConfig = () => {
  const { config } = useContext(PageTreeConfigContext);

  if (!config) {
    throw new Error('Failed to get page tree config. Make sure to use the component in a PageTreeConfigProvider.');
  }

  return config;
};
