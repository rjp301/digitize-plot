import React from "react";
import { useAtom } from "jotai";
import { showHelpAtom } from "@/lib/store";
import { IconButton } from "@radix-ui/themes";
import { CircleHelpIcon } from "lucide-react";

const HelpToggle: React.FC = () => {
  const [showHelp, setShowHelp] = useAtom(showHelpAtom);

  return (
    <IconButton
      radius="full"
      variant={showHelp ? "solid" : "outline"}
      onClick={() => setShowHelp((prev) => !prev)}
      aria-label="Toggle Help"
    >
      <CircleHelpIcon className="size-4" />
    </IconButton>
  );
};

export default HelpToggle;
