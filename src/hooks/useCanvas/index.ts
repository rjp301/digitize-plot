import { MouseEventHandler, WheelEventHandler, useEffect, useRef } from "react";
import usePoints from "./usePoints";
import use2dContext from "./use2dContext";
import usePanZoom from "./usePanZoom";
import useCalibrators from "./useCalibrators";

export default function useCanvas(
  image: HTMLImageElement | undefined,
  debug: boolean
) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const context = use2dContext(canvasRef);

  const {
    drawPoints,
    mouseDownPoints,
    mouseUpPoints,
    mouseMovePoints,
    mouseLeavePoints,
    points,
    mousePoint,
    clearPoints,
  } = usePoints(canvasRef, debug);

  const { drawPanZoom, mouseDownPanZoom, mouseUpPanZoom, wheelPanZoom } =
    usePanZoom(canvasRef, mousePoint, image, debug);

  const {
    drawCalibrators,
    mouseDownCalibrators,
    MouseUpCalibrators,
    markerDragging,
    calibrations,
    setCalibrations,
    coordsConverter,
  } = useCalibrators(canvasRef, mousePoint, image, debug);

  // Draw everything to canvas
  const draw = (context: CanvasRenderingContext2D): void => {
    drawPanZoom(context);
    if (image) context.drawImage(image, 0, 0, image.width, image.height);
    drawCalibrators(context);
    drawPoints(context);
  };

  // Event handlers
  const onMouseMove: MouseEventHandler<HTMLCanvasElement> = (event) => {
    mouseMovePoints(event);
  };

  const onMouseDown: MouseEventHandler<HTMLCanvasElement> = (event) => {
    mouseDownPanZoom(event);
    mouseDownCalibrators(event);
    if (markerDragging) return;
    mouseDownPoints(event);
  };

  const onMouseUp: MouseEventHandler<HTMLCanvasElement> = (event) => {
    mouseUpPanZoom(event);
    MouseUpCalibrators(event);
    mouseUpPoints(event);
  };

  const onContextMenu: MouseEventHandler<HTMLCanvasElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onWheel: WheelEventHandler<HTMLCanvasElement> = (event) => {
    wheelPanZoom(event);
  };

  const onMouseLeave: WheelEventHandler<HTMLCanvasElement> = (event) => {
    mouseLeavePoints(event);
  };

  // draw loop
  useEffect(() => {
    if (!context) return;
    let animationFrameId: number;

    const render = () => {
      // context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      // context.imageSmoothingEnabled = false;

      draw(context);
      // context.restore();
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw]);

  // add and remove event listener for resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [image]);

  useEffect(() => {
    if (debug) console.log(points);
  }, [points]);

  return {
    ref: canvasRef,
    points,
    mousePoint,
    clearPoints,
    calibrations,
    setCalibrations,
    coordsConverter,
    onMouseDown,
    onMouseUp,
    onMouseMove,
    onMouseLeave,
    onContextMenu,
    onWheel,
  };
}
