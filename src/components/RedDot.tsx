import { AnyObject, SecureOmit } from '@/helpers.types';
import { Path } from "@/helpers/path";
import { useEmbedErrorsCheck } from "@/hooks";
import { HTMLProps } from 'react';

interface RedDotProps extends SecureOmit<HTMLProps<HTMLDivElement>, "name"> {
  name: Path<AnyObject>;
}

export function RedDot({ name, ...props }: RedDotProps) {
  const haveErrors = useEmbedErrorsCheck(name);

  if (!haveErrors) return null;

  return <div {...props} />;
}
