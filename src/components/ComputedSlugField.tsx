import { Text } from '@sanity/ui';
import { FC, useEffect } from 'react';
import { PatchEvent, Reference, set, SlugValue, StringFieldProps, useFormCallbacks, useFormValue } from 'sanity';

import { usePageTreeItem } from '../hooks/usePageTreeItem';
import { PageTreeConfig } from '../types';

export type ComputedSlugInputProps = {
  config: PageTreeConfig;
} & StringFieldProps;

const ComputedSlugInput: FC<ComputedSlugInputProps> = ({ value, config }) => {
  const slug = (useFormValue(['slug']) as SlugValue)?.current;
  const parentRef = useFormValue(['parent']) as Reference;

  const { onChange } = useFormCallbacks();
  const { page, isLoading } = usePageTreeItem(parentRef?._ref, config, 'published');

  useEffect(() => {
    if (isLoading || !slug) {
      return;
    }

    /** Hacky, but the home page can cause duplicate //, so we filter those */
    const computedSlug = `${page?.path}/${slug}`.replace(`//`, '/');

    /** Do not update if the computed slug is unchanged. */
    if (value === computedSlug) {
      return;
    }

    onChange(PatchEvent.from(set(computedSlug, ['computedSlug'])));
  }, [slug, page, onChange, isLoading, value]);

  return (
    <>
      <UrlExplanation baseUrl={config.baseUrl} path={value} />
    </>
  );
};

export default ComputedSlugInput;

type UrlExplanationProps = {
  baseUrl?: string;
  path?: string;
};

const UrlExplanation: FC<UrlExplanationProps> = ({ baseUrl, path }) => {
  if (!path) {
    return (
      <Text muted size={1}>
        Fill a slug to see the page path
      </Text>
    );
  }

  const url = `${baseUrl}${path}`;

  return (
    <Text muted size={1}>
      Link to page:{' '}
      <a href={url} target="blank">
        {url}
      </a>
    </Text>
  );
};
