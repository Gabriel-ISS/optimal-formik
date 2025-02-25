import { OptimalFormikContext } from '@/context';
import { AnyObject } from '@/helpers.types';
import { submitForm } from '@/helpers/submitForm';
import { FormConfig, useOptimalFormik } from '@/store';
import { HTMLProps, ReactNode, useEffect } from 'react';

type OptimalFormikProps<T extends AnyObject> = FormConfig<T> & {
  children: ReactNode;
  className?: string;
};

export function OptimalFormik<T extends AnyObject = AnyObject>({
  children,
  className,
  ...formConfig
}: OptimalFormikProps<T>) {
  const createStore = useOptimalFormik((s) => s.createForm);
  const removeStore = useOptimalFormik((s) => s.removeForm);
  const formReady = useOptimalFormik((s) => Boolean(s.forms[formConfig.formID]));

  const configAsJson = JSON.stringify(formConfig);

  useEffect(() => {
    createStore(formConfig);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configAsJson]);

  useEffect(() => {
    return () => {
      removeStore(formConfig.formID);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const formProps: HTMLProps<HTMLFormElement> = {
    onSubmit: (e) => submitForm(e, formConfig.formID),
    className,
  };

  if (formConfig.preventSubmitOnEnter) {
    formProps.onKeyDown = (e) => {
      if (e.key === "Enter") e.preventDefault();
    };
  }

  return (
    <OptimalFormikContext.Provider value={formConfig.formID}>
      <form {...formProps}>{formReady && children}</form>
    </OptimalFormikContext.Provider>
  );
}