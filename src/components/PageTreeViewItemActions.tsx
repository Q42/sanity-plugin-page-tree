import { AddIcon } from '@sanity/icons';
import { Button, Flex, Menu, MenuButton, MenuItem } from '@sanity/ui';
import { useEffect, useState } from 'react';
import { useClient } from 'sanity';
import { useRouter } from 'sanity/router';

import { usePageTreeConfig } from '../hooks/usePageTreeConfig';
import { PageTreeItem } from '../types';
import { getLanguageFromConfig } from '../helpers/config';

export type PageTreeViewItemActionsProps = {
  page: PageTreeItem;
  onActionOpen: () => void;
  onActionClose: () => void;
};

export const PageTreeViewItemActions = ({ page, onActionOpen, onActionClose }: PageTreeViewItemActionsProps) => {
  const config = usePageTreeConfig();
  const client = useClient({ apiVersion: config.apiVersion });
  const { navigateUrl, resolveIntentLink } = useRouter();
  const [newPage, setNewPage] = useState<{ _id: string; _type: string } | undefined>();

  const onAdd = async (type: string) => {
    const language = getLanguageFromConfig(config);
    const doc = await client.create({
      _type: type,
      parent: config.rootSchemaType === type ? undefined : { _type: 'reference', _ref: page._id },
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

  return (
    <Flex gap={1} style={{ flexShrink: 0 }} onClick={e => e.stopPropagation()}>
      <MenuButton
        id="add-page-button"
        button={<Button mode="ghost" paddingX={2} paddingY={2} fontSize={1} icon={AddIcon} />}
        menu={
          <Menu>
            {config.pageSchemaTypes
              .filter(type => type !== config.rootSchemaType)
              .map(type => (
                <MenuItem key={type} onClick={() => onAdd(type)} text={type} value={type} />
              ))}
          </Menu>
        }
        popover={{ placement: 'bottom' }}
        onOpen={onActionOpen}
        onClose={onActionClose}
      />
    </Flex>
  );
};
