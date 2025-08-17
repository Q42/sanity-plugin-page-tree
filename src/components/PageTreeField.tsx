import { FormField, ObjectFieldProps, ReferenceValue } from 'sanity';

import { PageTreeConfig } from '../types';
import { PageTreeInput } from './PageTreeInput';

/**
 * @public
 */
export const PageTreeField = (
  props: ObjectFieldProps<ReferenceValue> & {
    config: PageTreeConfig;
    hideActions?: boolean;
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
      <PageTreeInput {...inputProps} hideActions />
    </FormField>
  );
};
