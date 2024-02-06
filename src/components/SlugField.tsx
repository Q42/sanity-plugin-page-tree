import { Stack, Text } from '@sanity/ui';
import { Reference, SlugInput, SlugInputProps, useEditState, useFormValue } from 'sanity';
import { PageTreeConfig } from '../types';
import { usePageTreeItem } from '../hooks/usePageTreeItem';
import { getSanityDocumentId } from '../utils/sanity';

export type SlugFieldProps = {
  config: PageTreeConfig;
} & SlugInputProps;

export const SlugField = (props: SlugFieldProps) => {
  const id = useFormValue(['_id']) as string;
  const type = useFormValue(['type']) as string;
  const parentId = useFormValue(['parent']) as Reference;

  const state = useEditState(getSanityDocumentId(id), type);
  const isPublised = !!state.published;

  const { config, value, ...otherProps } = props;
  // we use published perspective so we don't get a draft version of the slug that has been changed of a parent page.
  const { page, isLoading } = usePageTreeItem(parentId!._ref, config, 'published');
  const path = page?.path == '/' ? `${page?.path}${value?.current}` : `${page?.path}/${value?.current}`;

  return (
    <Stack space={3}>
      <SlugInput {...otherProps} value={value} />
      {!isLoading && <UrlExplanation baseUrl={config.baseUrl} path={path} isPublised={isPublised} />}
    </Stack>
  );
};

type UrlExplanationProps = {
  baseUrl?: string;
  path: string;
  isPublised: boolean;
};

const UrlExplanation = ({ baseUrl, path, isPublised }: UrlExplanationProps) => {
  const url = baseUrl ? `${baseUrl}${path}` : null;
  const linkToPage = url && (
    <a href={url} target="blank">
      {url}
    </a>
  );

  const content = isPublised ? <>Link to page: {linkToPage}</> : <>Page url once published: {url ?? path}`</>;

  return (
    <Text muted size={1}>
      {content}
    </Text>
  );
};
