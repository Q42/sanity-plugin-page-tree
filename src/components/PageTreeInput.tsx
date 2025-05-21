import { Box, Button, Card, Dialog, Flex, Spinner, Stack, Text } from '@sanity/ui';
import { Theme } from '@sanity/ui/theme';
import { useMemo, useState } from 'react';
import { ObjectInputProps, ReferenceValue, SanityDocument, set, unset, useFormValue } from 'sanity';
import styled from 'styled-components';

import { findPageTreeItemById, flatMapPageTree } from '../helpers/page-tree';
import { useOptimisticState } from '../hooks/useOptimisticState';
import { usePageTree } from '../hooks/usePageTree';
import { PageTreeConfigProvider } from '../hooks/usePageTreeConfig';
import { PageTreeConfig, PageTreeItem } from '../types';
import { getSanityDocumentId } from '../utils/sanity';
import { PageTreeEditor } from './PageTreeEditor';

export const PageTreeInput = (
  props: ObjectInputProps<ReferenceValue> & {
    config: PageTreeConfig;
    mode?: 'select-parent' | 'select-page';
    schemaType: { to?: { name: string }[] };
    hideActions?: boolean;
  },
) => {
  const mode = props.mode ?? 'select-page';
  const form = useFormValue([]) as SanityDocument;
  const { pageTree } = usePageTree(props.config);

  const allowedPageTypes = props.schemaType.to?.map(t => t.name);

  const [isPageTreeDialogOpen, setIsPageTreeDialogOpen] = useState(false);

  const parentId = props.value?._ref;
  const pageId = getSanityDocumentId(form._id);

  const fieldPage = useMemo(() => (pageTree ? findPageTreeItemById(pageTree, pageId) : undefined), [pageTree, pageId]);
  const parentPage = useMemo(
    () => (pageTree && parentId ? findPageTreeItemById(pageTree, parentId) : undefined),
    [pageTree, parentId],
  );

  const flatFieldPages = useMemo(() => (fieldPage ? flatMapPageTree([fieldPage]) : []), [fieldPage]);

  const [parentPath, setOptimisticParentPath] = useOptimisticState<string | undefined>(parentPage?.path);

  // Some page tree items are not suitable options for a new parent reference.
  // Disable the current parent page, the current page and all of its children.
  const disabledParentIds =
    mode !== 'select-parent' ? [] : [...(parentId ? [parentId] : []), ...flatFieldPages.map(page => page._id)];
  // Initially open the current page and all of its parents
  const openItemIds = fieldPage?._id ? [fieldPage?._id] : undefined;

  const openDialog = () => {
    setIsPageTreeDialogOpen(true);
  };

  const closeDialog = () => {
    setIsPageTreeDialogOpen(false);
  };

  const selectParentPage = (page: PageTreeItem) => {
    // In the case of an array of references, we need to find the last path in the array and extract the _key
    const lastPath = props.path[props.path.length - 1];
    const _key = typeof lastPath === 'object' && '_key' in lastPath ? lastPath._key : undefined;

    props.onChange(
      set({
        ...(_key ? { _key } : {}),
        _ref: page._id,
        _type: 'reference',
        _weak: page.isDraft,
        ...(page.isDraft ? { _strengthenOnPublish: { type: page._type } } : {}),
      }),
    );
    setOptimisticParentPath(page.path);
    closeDialog();
  };

  const resetValue = () => {
    props.onChange(unset());
    setOptimisticParentPath(undefined);
  };

  return (
    <PageTreeConfigProvider config={props.config}>
      <Stack space={3}>
        {!pageTree ? (
          <Flex paddingY={4} justify="center" align="center">
            <Spinner />
          </Flex>
        ) : (
          <Card padding={1} shadow={1} radius={2}>
            <Flex>
              <SelectedItemCard padding={3} radius={2} onClick={openDialog} flex={1}>
                <Text size={2}>{parentId ? parentPath ?? 'Select page' : 'Select page'}</Text>
              </SelectedItemCard>
              {parentId && (
                <Box marginLeft={2}>
                  <Button mode="ghost" padding={3} text="Remove" onClick={resetValue} />
                </Box>
              )}
            </Flex>
          </Card>
        )}
      </Stack>
      {pageTree && isPageTreeDialogOpen && (
        <Dialog
          header={'Select page'}
          id="parent-page-tree"
          zOffset={1000}
          width={1}
          onClose={closeDialog}
          onClickOutside={closeDialog}>
          <Box padding={4}>
            <PageTreeEditor
              allowedPageTypes={allowedPageTypes}
              pageTree={pageTree}
              onItemClick={selectParentPage}
              disabledItemIds={disabledParentIds}
              initialOpenItemIds={openItemIds}
              hideActions={props.hideActions}
            />
          </Box>
        </Dialog>
      )}
    </PageTreeConfigProvider>
  );
};

const SelectedItemCard = styled(Card)<{ theme: Theme }>`
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.sanity.v2?.color.selectable.neutral.hovered.bg};
  }
`;
