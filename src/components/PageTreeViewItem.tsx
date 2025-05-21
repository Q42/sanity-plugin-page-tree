import { ChevronDownIcon, ChevronUpIcon } from '@sanity/icons';
import { Button, Card, Flex, Stack, Text } from '@sanity/ui';
import { Theme } from '@sanity/ui/theme';
import { MouseEvent } from 'react';
import { useMemo, useState } from 'react';
import { usePaneRouter } from 'sanity/structure';
import styled from 'styled-components';

import { getLanguageFieldName, getRootPageSlug } from '../helpers/config';
import { flatMapPageTree } from '../helpers/page-tree';
import { usePageTreeConfig } from '../hooks/usePageTreeConfig';
import { NestedPageTreeItem } from '../types';
import { PageTreeViewItemActions } from './PageTreeViewItemActions';
import { PageTreeViewItemStatus } from './PageTreeViewItemStatus';

export type PageTreeViewItemProps = {
  parentPath?: string;
  page: NestedPageTreeItem;
  onToggle: (page: NestedPageTreeItem) => void;
  onClick?: (page: NestedPageTreeItem) => void;
  openItemIds: string[];
  disabledItemIds?: string[];
  forceOpen?: boolean;
  isRoot?: boolean;
  allowedPageTypes?: string[];
  hideActions?: boolean;
};

export const PageTreeViewItem = ({
  page,
  parentPath,
  onToggle,
  onClick,
  openItemIds,
  disabledItemIds,
  allowedPageTypes,
  forceOpen,
  isRoot,
  hideActions,
}: PageTreeViewItemProps) => {
  const config = usePageTreeConfig();
  const { navigateIntent, routerPanesState, groupIndex } = usePaneRouter();

  const [isHovered, setIsHovered] = useState(false);
  const [hasActionOpen, setHasActionOpen] = useState(false);
  const toggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onToggle(page);
  };

  const onItemClick = () => {
    if (isDisabled) return;

    onClick ? onClick(page) : openPage();
  };

  const openPage = () => {
    navigateIntent('edit', { id: page._id, type: page._type });
  };

  const path = parentPath ? `${parentPath}/${page.slug?.current}` : getLanguageFieldName(config) ?? '/';
  const hasChildren = page.children.length > 0;

  const currentPageNumber = routerPanesState[groupIndex + 1]?.[0]?.id;
  const isSelected = currentPageNumber === page._id;
  const isDisabled =
    ((allowedPageTypes && !allowedPageTypes.includes(page._type)) ||
      (disabledItemIds && disabledItemIds.some(id => id === page._id))) ??
    false;

  /**
   * Check if page or is open based on passed openItemIds and page id and children ids
   */
  const isOpen = useMemo(() => {
    if (forceOpen) {
      return true;
    }

    const flatPages = page.children ? flatMapPageTree(page.children) : [];
    const flatPageIds = [page._id, ...flatPages.map(p => p._id)];

    return openItemIds.some(id => flatPageIds.includes(id));
  }, [page._id, page.children, forceOpen, openItemIds]);

  return (
    <Card>
      <Stack flex={1}>
        <ItemContainer align="center" gap={1}>
          {!isRoot && <HorizontalLine />}
          <Flex paddingLeft={3}>
            {hasChildren && (
              <Button
                mode="ghost"
                padding={2}
                fontSize={1}
                icon={isOpen ? ChevronUpIcon : ChevronDownIcon}
                onClick={toggle}
                disabled={forceOpen}
              />
            )}
          </Flex>
          <Item
            flex={1}
            paddingLeft={1}
            align="center"
            gap={3}
            justify="space-between"
            hasMarginLeft={hasChildren}
            isDisabled={isDisabled}
            isSelected={isHovered || isSelected}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onItemClick}>
            <Flex align="center" gap={3}>
              <UrlText isDisabled={isDisabled || (!page.isPublished && page.isDraft)} textOverflow="ellipsis">
                {parentPath ? page.slug?.current : getRootPageSlug(page, config) ?? '/'}
              </UrlText>
              {!isDisabled && !hideActions && (isHovered || hasActionOpen) && (
                <PageTreeViewItemActions
                  page={page}
                  onActionOpen={() => setHasActionOpen(true)}
                  onActionClose={() => setHasActionOpen(false)}
                />
              )}
            </Flex>
            <PageTreeViewItemStatus isPublished={page.isPublished} isDraft={page.isDraft} />
          </Item>
        </ItemContainer>
        {isOpen && (
          <ChildContainer>
            <VerticalLine />
            {hasChildren && (
              <Stack paddingY={1} space={2}>
                {page.children.map(childPage => (
                  <PageTreeViewItem
                    key={childPage._id}
                    page={childPage}
                    parentPath={path}
                    onToggle={onToggle}
                    openItemIds={openItemIds}
                    disabledItemIds={disabledItemIds}
                    allowedPageTypes={allowedPageTypes}
                    forceOpen={forceOpen}
                    onClick={onClick}
                    hideActions={hideActions}
                  />
                ))}
              </Stack>
            )}
          </ChildContainer>
        )}
      </Stack>
    </Card>
  );
};

const HorizontalLine = styled('div')<{ theme: Theme }>`
  background-color: ${({ theme }) => theme.sanity.v2?.color.border};
  position: absolute;
  height: 1px;
  width: 2rem;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
`;

const VerticalLine = styled('div')<{ theme: Theme }>`
  background-color: ${({ theme }) => theme.sanity.v2?.color.border};
  position: absolute;
  margin-top: -2px;
  height: calc(100% - 16px);
  width: 1px;
  left: 0;
  top: 0;
`;

const ItemContainer = styled(Flex)`
  position: relative;
`;

const Item = styled(Flex)<{ hasMarginLeft: boolean; isSelected: boolean; isDisabled: boolean; theme: Theme }>`
  height: 1.75rem;
  margin-left: ${({ hasMarginLeft }) => (hasMarginLeft ? '0rem' : '1.5rem')};
  border-radius: 0.1875rem;
  background-color: ${({ theme, isDisabled, isSelected }) =>
    !isDisabled && isSelected ? theme.sanity.v2?.color.selectable.neutral.hovered.bg : undefined};

  &:hover {
    cursor: ${({ isDisabled }) => (!isDisabled ? 'pointer' : undefined)};
  }
`;

const UrlText = styled(Text)<{ isDisabled: boolean }>`
  min-width: 0;
  opacity: ${({ isDisabled }) => (isDisabled ? 0.5 : 1)};
`;

const ChildContainer = styled(Card)`
  margin-left: 1.5rem;
  position: relative;
`;
