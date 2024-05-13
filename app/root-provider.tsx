"use clinet";

import { NextUIProvider } from "@nextui-org/react";
import { PropsWithChildren, ReactNode } from "react";

export const RootProvider = (props: { children: ReactNode }) => {
  return <NextUIProvider {...props} />;
};
