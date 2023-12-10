import { SearchIcon, AddIcon } from '@sanity/icons';
import { Box, Button, Flex, Text, TextInput } from '@sanity/ui';
import { without } from 'lodash';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { PageTreeViewItem } from './PageTreeViewItem';
import { findPageTreeItemById, flatMapPageTree } from '../helpers/page-tree';
import { PageTreeItem } from '../types';
import { usePageTreeConfig } from '../hooks/usePageTreeConfig';
import { useClient } from 'sanity';
import { useRouter } from 'sanity/router';
import styled from 'styled-components';

export type PageTreeEditorProps = {
  pageTree: PageTreeItem[];
  onItemClick?: (page: PageTreeItem) => void;
  disabledItemIds?: string[];
  initialOpenItemIds?: string[];
  allowedPageTypes?: string[];
};

type PageTreeState = {
  query: string;
  openItemIds: string[];
};

const PAGE_TREE_STATE_KEY = 'sanity:page-tree-state';

export const PageTreeEditor = ({
  pageTree,
  onItemClick,
  disabledItemIds,
  initialOpenItemIds,
  allowedPageTypes,
}: PageTreeEditorProps) => {
  const config = usePageTreeConfig();
  const client = useClient({ apiVersion: config.apiVersion });
  const { navigateUrl, resolveIntentLink } = useRouter();

  const [pageTreeState, setPageTreeState] = useState<PageTreeState>(() => {
    const sessionState = JSON.parse(sessionStorage.getItem(PAGE_TREE_STATE_KEY) || '{}');

    return {
      query: sessionState.query || '',
      openItemIds: [...(sessionState.openItemIds || pageTree.map(page => page._id)), ...(initialOpenItemIds || [])],
    };
  });

  useEffect(() => {
    sessionStorage.setItem(PAGE_TREE_STATE_KEY, JSON.stringify(pageTreeState));
  }, [pageTreeState]);

  /**
   * Filter page tree results recursively on title/slug based on search query
   */
  const filteredPageTree = useMemo(() => {
    if (!pageTree) return;

    const query = pageTreeState.query.toLowerCase();

    const filter = (pages: PageTreeItem[]): PageTreeItem[] =>
      pages.reduce((filteredPages: PageTreeItem[], page) => {
        let shouldInclude = true;

        if (page.children) {
          const children = filter(page.children);
          if (children.length) {
            filteredPages.push({ ...page, children });
            shouldInclude = false;
          }
        }

        if (
          shouldInclude &&
          (page.title?.toLowerCase().includes(query) || page.slug?.current.toLowerCase().includes(query))
        ) {
          filteredPages.push(page);
        }

        return filteredPages;
      }, []);

    return filter(pageTree);
  }, [pageTree, pageTreeState.query]);

  /**
   * Toggle page tree item. If item is opened, close it and all its children. If it is closed, just open it.
   */
  const togglePage = useCallback(
    (page: PageTreeItem) => {
      if (!pageTree) return;

      const index = pageTreeState.openItemIds.indexOf(page._id);
      // Closed item, open it
      if (index === -1) {
        setPageTreeState({ ...pageTreeState, openItemIds: [...pageTreeState.openItemIds, page._id] });
        // Open item, close it and its children
      } else {
        const item = findPageTreeItemById(pageTree, page._id);
        if (!item) return;

        const childItems = flatMapPageTree([item]);
        const itemIdsToClose = [item, ...childItems];
        const newOpenItemIds = without(pageTreeState.openItemIds, ...itemIdsToClose.map(item => item._id));

        setPageTreeState({ ...pageTreeState, openItemIds: newOpenItemIds });
      }
    },
    [pageTreeState, setPageTreeState, pageTree],
  );

  const addRootPage = useCallback(async () => {
    const doc = await client.create({
      _type: config.rootSchemaType,
    });
    const path = resolveIntentLink('edit', { id: doc._id, type: doc._type });

    navigateUrl({ path });
  }, [client, config.rootSchemaType, resolveIntentLink, navigateUrl]);

  return (
    <Flex gap={3} direction="column">
      <Box>
        <TextInput
          icon={SearchIcon}
          onChange={event => setPageTreeState({ ...pageTreeState, query: event.currentTarget.value })}
          placeholder="Search"
          value={pageTreeState.query}
        />
      </Box>
      {filteredPageTree?.length ? (
        <Flex direction="column">
          {filteredPageTree.map(page => (
            <PageTreeViewItem
              key={page._id}
              page={page}
              onToggle={togglePage}
              openItemIds={pageTreeState.openItemIds}
              disabledItemIds={disabledItemIds}
              allowedPageTypes={allowedPageTypes}
              forceOpen={!!pageTreeState.query}
              isRoot
              onClick={onItemClick}
            />
          ))}
        </Flex>
      ) : (
        <>
          <Box paddingX={3} paddingY={3}>
            <Text>No pages found</Text>
          </Box>
          <AddButton mode="ghost" icon={AddIcon} text="Add root page" onClick={addRootPage} />
        </>
      )}
    </Flex>
  );
};

const AddButton = styled(Button)`
  align-self: flex-start;
`;
