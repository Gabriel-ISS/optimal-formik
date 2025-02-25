import { Path } from '@/helpers/path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyObject = Record<string, any>;

export type StringRecord = Record<string, string>;

export type SecureOmit<T, K extends keyof T> = Omit<T, K>

export type Rename<T extends AnyObject, OldKey extends keyof T, NewKey extends string> = {
  [K in NewKey]: T[OldKey];
} & Omit<T, OldKey>;

export type InputCommon = {
  name: Path<AnyObject> | string;
  label: string | React.JSX.Element;
  hideLabel?: boolean;
  containerClass?: string;
  labelClass?: string;
  errorClass?: string;
};

type Updater<T> = (value: T) => void;
export type UpdateState<T> = (updater: Updater<T>) => void;