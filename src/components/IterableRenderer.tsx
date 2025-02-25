import { PathContext } from '@/context';
import { Key, Path } from '@/helpers/path';
import { _getValue } from '@/helpers/valueFromPath';
import { useFormID } from '@/hooks';
import { useOptimalFormik } from '@/store';
import React, { ReactNode, useContext } from 'react';
import { AnyObject } from 'yup';
import { useShallow } from 'zustand/shallow';

type IterableRenderer<T extends AnyObject> = {
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
  children: (path: Path<T>, key: Key<T>) => ReactNode;
};
export function IterableRenderer<T extends AnyObject>({
  as = "div",
  className,
  children,
}: IterableRenderer<T>) {
  const formID = useFormID();
  const path = useContext(PathContext);

  const iterable = useOptimalFormik(useShallow((s) => {
    const formData = s.forms[formID]?.data;
    if (!formData || !path) return [];

    const pathStr = path.toString();

    const array = _getValue<unknown[]>(formData, pathStr);

    return Object.keys(array);
  }));

  const element = React.createElement(
    as,
    { className },
    ...iterable.map((key) =>
      children(new Path<AnyObject>(`${path}.${key}`), key as Key<T>)
    )
  );

  return element;
}