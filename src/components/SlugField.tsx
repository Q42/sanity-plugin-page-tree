import { Stack, Text } from '@sanity/ui';
import { Reference, SlugInputProps, SlugValue, useEditState, useFormValue } from 'sanity';

import { usePageTreeItem } from '../hooks/usePageTreeItem';
import { PageTreeConfig } from '../types';
import { getSanityDocumentId } from '../utils/sanity';

export type SlugFieldProps = {
  config: PageTreeConfig;
} & SlugInputProps;

export const SlugField = (props: SlugFieldProps) => {
  const id = useFormValue(['_id']);
  const type = useFormValue(['_type']);
  // eslint-disable-next-line no-warning-comments
  // TODO ideally this would be more type safe.

  const parentRef = useFormValue(['parent']) as Reference | undefined;
  const { config, value, renderDefault } = props;
  return (
    <Stack space={3}>
      {renderDefault(props)}
      {typeof id == 'string' && typeof type == 'string' && !!parentRef?._ref && (
        <UrlExplanation id={id} type={type} parentId={parentRef?._ref} config={config} value={value} />
      )}
    </Stack>
  );
};

type UrlExplanationProps = {
  id: string;
  type: string;
  parentId: string;
  value: SlugValue | undefined;
  config: PageTreeConfig;
};

const UrlExplanation = ({ id, type, parentId, value, config }: UrlExplanationProps) => {
  const state = useEditState(getSanityDocumentId(id), type ?? '');
  const isPublished = !!state.published;

  // we use published perspective so we don't get a draft version of the slug that has been changed of a parent page.
  const { page, isLoading } = usePageTreeItem(parentId, config, 'published');

  if (isLoading) return null;

  const path = page?.path == '/' ? `${page?.path}${value?.current}` : `${page?.path}/${value?.current}`;

  if (!config.baseUrl) {
    return (
      <Text muted size={1}>
        Page url: {path}
      </Text>
    );
  }

  const url = `${config.baseUrl}${path}`;

  if (!isPublished) {
    <Text muted size={1}>
      Page url once published: {url}
    </Text>;
  }

  return (
    <Text muted size={1}>
      Link to page:
      <a href={url} target="blank">
        {url}
      </a>
    </Text>
  );
};
