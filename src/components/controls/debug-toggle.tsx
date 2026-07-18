import React from "react";
import { useAtom } from "jotai";
import { debugAtom } from "@/lib/store";
import { Switch, Text } from "@radix-ui/themes";

const DebugToggle: React.FC = () => {
  const [debug, setDebug] = useAtom(debugAtom);

  return (
    <div className="flex items-center gap-2">
      <Switch highContrast checked={debug} onCheckedChange={setDebug} id="debug-mode" />
      <Text as="label" htmlFor="debug-mode" weight="medium" size="1">
        Debug Mode
      </Text>
    </div>
  );
};

export default DebugToggle;
