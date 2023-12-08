import { Card, Stack, Flex, Spinner } from '@sanity/ui';
import { forwardRef } from 'react';
import { UserComponent } from 'sanity/desk';

import { PageTreeEditor } from './PageTreeEditor';
import { usePageTree } from '../hooks/usePageTree';
import { PageTreeConfigProvider } from '../hooks/usePageTreeConfig';
import { PageTreeConfig } from '../types';

export type PageTreeViewProps = {
  config: PageTreeConfig;
} & UserComponent['propTypes'];

export const PageTreeView = forwardRef<HTMLDivElement, PageTreeViewProps>(({ config }, ref) => {
  const { pageTree } = usePageTree(config);

  return (
    <PageTreeConfigProvider config={config}>
      <Stack ref={ref} space={3}>
        <Card padding={3}>
          {!pageTree ? (
            <Flex paddingY={4} justify="center" align="center">
              <Spinner />
            </Flex>
          ) : (
            <PageTreeEditor pageTree={pageTree} />
          )}
        </Card>
      </Stack>
    </PageTreeConfigProvider>
  );
});

PageTreeView.displayName = 'PageTreeView';

export const createPageTreeView = (config: PageTreeConfig) => <PageTreeView config={config} />;
