import React from "react";
import { Theme, type ThemeProps } from "@radix-ui/themes";

const RadixProvider: React.FC<ThemeProps> = (props) => {
  return <Theme accentColor="blue" {...props} />;
};

export default RadixProvider;
