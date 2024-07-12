import { AddIcon } from '@sanity/icons';
import { Box, Button, Flex, Menu, MenuButton, MenuItem, Text, Tooltip } from '@sanity/ui';
import { useEffect, useState } from 'react';
import { useClient, useSchema } from 'sanity';
import { useRouter } from 'sanity/router';

import { getLanguageFromConfig } from '../helpers/config';
import { generateDraftId } from '../helpers/uuid';
import { usePageTreeConfig } from '../hooks/usePageTreeConfig';
import { PageTreeItem } from '../types';

export type PageTreeViewItemActionsProps = {
  page: PageTreeItem;
  onActionOpen: () => void;
  onActionClose: () => void;
};

export const PageTreeViewItemActions = ({ page, onActionOpen, onActionClose }: PageTreeViewItemActionsProps) => {
  const schema = useSchema();
  const config = usePageTreeConfig();
  const client = useClient({ apiVersion: config.apiVersion });
  const { navigateUrl, resolveIntentLink } = useRouter();
  const [newPage, setNewPage] = useState<{ _id: string; _type: string } | undefined>();

  const onAdd = async (type: string) => {
    const language = getLanguageFromConfig(config);
    const doc = await client.create({
      _id: generateDraftId(),
      _type: type,
      parent:
        config.rootSchemaType === type
          ? undefined
          : {
              _type: 'reference',
              _ref: page._id,
              _weak: true,
              _strengthenOnPublish: { type: page._type },
            },
      ...(language ? { [language]: page[language] } : {}),
    });
    setNewPage(doc);
  };

  useEffect(() => {
    if (newPage) {
      const path = resolveIntentLink('edit', { id: newPage._id, type: newPage._type });
      navigateUrl({ path });
    }
  }, [newPage, navigateUrl, resolveIntentLink]);

  const menuButtons = config.pageSchemaTypes
    .filter(
      type =>
        type !== config.rootSchemaType &&
        (config.allowedParents?.[type] === undefined || config.allowedParents?.[type]?.includes(page._type)),
    )
    .map(type => (
      <MenuItem key={type} onClick={() => onAdd(type)} text={schema.get(type)?.title ?? type} value={type} />
    ));

  const isAddPageButtonDisabled = menuButtons.length === 0;
  const tooltipContent = isAddPageButtonDisabled ? (
    <Box padding={1}>
      <Text muted size={1}>
        This page cannot have any child pages.
      </Text>
    </Box>
  ) : undefined;

  return (
    <Tooltip content={tooltipContent} fallbackPlacements={['right', 'left']} placement="top" portal>
      <Flex gap={1} style={{ flexShrink: 0 }} onClick={e => e.stopPropagation()}>
        <MenuButton
          id="add-page-button"
          button={
            <Button
              mode="ghost"
              paddingX={2}
              paddingY={2}
              fontSize={1}
              icon={AddIcon}
              disabled={isAddPageButtonDisabled}
            />
          }
          menu={<Menu>{menuButtons}</Menu>}
          popover={{ placement: 'bottom' }}
          onOpen={onActionOpen}
          onClose={onActionClose}
        />
      </Flex>
    </Tooltip>
  );
};
