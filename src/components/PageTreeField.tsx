import { ObjectFieldProps, ReferenceValue, FormField } from 'sanity';

import { PageTreeConfig } from '../types';
import { PageTreeInput } from './PageTreeInput';

export const PageTreeField = (
  props: ObjectFieldProps<ReferenceValue> & {
    config: PageTreeConfig;
    mode?: 'select-parent' | 'select-page';
    inputProps: { schemaType: { to?: { name: string }[] } };
  },
) => {
  const inputProps = {
    config: props.config,
    mode: props.mode,
    ...props.inputProps,
  };

  return (
    <FormField title={props.title} inputId={props.inputId} validation={props.validation}>
      <PageTreeInput {...inputProps} />
    </FormField>
  );
};
