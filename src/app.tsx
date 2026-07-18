import React from "react";

import Bullseye from "@/components/bullseye";
import DataTable from "@/components/data-table";
import DownloadLink from "@/components/download";
import MouseCoords from "@/components/mouse-coords";
import Welcome from "@/components/welcome";
import Calibrate from "@/components/calibrate";
import Help from "@/components/help";

import Logo from "@/components/logo";
import { useAtom } from "jotai/react";
import {
  calibrationsAtom,
  imageAtom,
  pointsAtom,
  showHelpAtom,
} from "@/lib/store";
import type Point from "@/geometry/point";
import Canvas from "@/components/canvas";
import { linearCoordsConverterGenerator } from "./lib/interpolators/linear";
import usePoints from "./hooks/use-points";
import useCenterImage from "./hooks/use-center-image";
import useCursor from "./hooks/use-cursor";
import useCopyPoints from "./hooks/use-copy-points";
import { TooltipProvider } from "./components/ui/tooltip";
import DebugToggle from "./components/controls/debug-toggle";
import HelpToggle from "./components/controls/help-toggle";
import CanvasControls from "./components/controls/canvas-controls";
import RadixProvider from "./components/radix-provider";
import { Button } from "@radix-ui/themes";
import {
  CopyCheckIcon,
  CopyIcon,
  DownloadIcon,
  EraserIcon,
} from "lucide-react";

function App() {
  const [image, setImage] = useAtom(imageAtom);
  const [mousePoint, setMousePoint] = React.useState<Point | undefined>(
    undefined,
  );
  const [calibrations, setCalibrations] = useAtom(calibrationsAtom);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const coordsConverter = linearCoordsConverterGenerator(calibrations);

  const [showHelp] = useAtom(showHelpAtom);

  const { clearPoints, points } = usePoints(pointsAtom);

  const centerImage = useCenterImage(canvasRef);
  const cursor = useCursor();

  React.useEffect(() => {
    if (image) centerImage(image);
    if (points.length) clearPoints();
  }, [image, canvasRef.current]);

  const { copyPoints, isCopied } = useCopyPoints(coordsConverter);

  return (
    <RadixProvider>
      <TooltipProvider>
        <div className="flex h-screen w-full">
          <aside className="bg-panel flex w-60 flex-col gap-2 overflow-y-auto border-r">
            <header className="bg-panel sticky top-0 z-50 border-b p-4 pb-6 backdrop-blur-lg">
              <Logo />
            </header>
            <section className="flex-1 px-4">
              <DataTable coordsConverter={coordsConverter} />
            </section>
            <footer className="bg-panel sticky bottom-0 z-50 grid gap-2 border-t p-4 backdrop-blur-lg">
              <Button
                variant="soft"
                disabled={points.length === 0}
                onClick={clearPoints}
              >
                <EraserIcon className="size-4" />
                Clear Points
              </Button>
              <Button
                variant="soft"
                disabled={points.length === 0}
                onClick={copyPoints}
              >
                {isCopied ? (
                  <CopyCheckIcon className="text-green-8 size-4" />
                ) : (
                  <CopyIcon className="size-4" />
                )}
                Copy Points
              </Button>
              <DownloadLink coordsConverter={coordsConverter}>
                <Button
                  highContrast
                  disabled={points.length === 0}
                  className="w-full"
                >
                  <DownloadIcon className="size-4" />
                  Download CSV
                </Button>
              </DownloadLink>
            </footer>
          </aside>
          <main className="relative flex-1" style={{ cursor }}>
            {image ? (
              <>
                <Canvas
                  canvasRef={canvasRef}
                  mousePoint={mousePoint}
                  setMousePoint={setMousePoint}
                />
                <div className="absolute right-4 bottom-4">
                  <CanvasControls canvasRef={canvasRef} />
                </div>
              </>
            ) : (
              <Welcome
                onImageLoad={(img) => {
                  setImage(img);
                  centerImage(img);
                }}
              />
            )}
            {image && showHelp && <Help />}
          </main>
          <aside className="bg-panel flex w-60 flex-col justify-between divide-y overflow-y-auto border-l">
            <div className="divide-y">
              <Bullseye canvasRef={canvasRef} mousePoint={mousePoint} />
              <MouseCoords
                coordsConverter={coordsConverter}
                mousePoint={mousePoint}
              />
              <Calibrate
                calibrations={calibrations}
                setCalibrations={setCalibrations}
              />
            </div>
            <div className="flex w-full justify-between gap-4 p-6">
              <DebugToggle />
              <HelpToggle />
            </div>
          </aside>
        </div>
      </TooltipProvider>
    </RadixProvider>
  );
}

export default App;
