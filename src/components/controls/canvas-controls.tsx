import React from "react";
import type { CanvasRef } from "@/types";
import useCenterImage from "@/hooks/use-center-image";
import { useAtom } from "jotai";
import { imageAtom, pointsAtom } from "@/lib/store";
import usePoints from "@/hooks/use-points";
import { IconButton, Tooltip } from "@radix-ui/themes";
import { MaximizeIcon, XIcon } from "lucide-react";

type Props = { canvasRef: CanvasRef };

const CanvasControls: React.FC<Props> = ({ canvasRef }) => {
  const [image, setImage] = useAtom(imageAtom);
  const centerImage = useCenterImage(canvasRef);
  const { clearPoints } = usePoints(pointsAtom);

  const handleClearImage = () => {
    setImage(undefined);
    clearPoints();
  };

  const handleCenterImage = () => {
    if (!image) return;
    centerImage(image);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <Tooltip side="left" content="Clear image">
        <IconButton
          highContrast
          radius="full"
          size="3"
          onClick={handleClearImage}
        >
          <XIcon className="size-5" />
        </IconButton>
      </Tooltip>

      <Tooltip side="left" content="Center image">
        <IconButton
          highContrast
          radius="full"
          size="3"
          onClick={handleCenterImage}
        >
          <MaximizeIcon className="size-5" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default CanvasControls;
