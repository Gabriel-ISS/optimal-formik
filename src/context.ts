import { AnyObject } from "@/helpers.types";
import { Path } from "@/helpers/path";
import { createContext } from "react";

export const OptimalFormikContext = createContext<string | undefined>(
  undefined
);

export const PathContext = createContext<Path<AnyObject> | string | undefined>(
  undefined
);
