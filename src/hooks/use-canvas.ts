import React from "react";
import usePoints from "./use-canvas-points";
import use2dContext from "./use-2d-context";
import usePanZoom from "./use-canvas-pan-zoom";
import useCalibrators from "./use-canvas-calibrators";

export default function useCanvas(
  image: HTMLImageElement | undefined,
  debug: boolean,
) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
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

  const {
    matrix,
    mouseDownPanZoom,
    mouseUpPanZoom,
    mouseMovePanZoom,
    wheelPanZoom,
    centerImage,
  } = usePanZoom(canvasRef);

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
    if (image) context.drawImage(image, 0, 0, image.width, image.height);
    drawCalibrators(context);
    drawPoints(context);
  };

  // Event handlers
  const onMouseMove: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
    mouseMovePoints(event);
    mouseMovePanZoom(event);
  };

  const onMouseDown: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
    mouseDownPanZoom(event);
    mouseDownCalibrators(event);
    if (markerDragging) return;
    mouseDownPoints(event);
  };

  const onMouseUp: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
    mouseUpPanZoom(event);
    MouseUpCalibrators(event);
    mouseUpPoints(event);
  };

  const onContextMenu: React.MouseEventHandler<HTMLCanvasElement> = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const onWheel: React.WheelEventHandler<HTMLCanvasElement> = (event) => {
    wheelPanZoom(event);
  };

  const onMouseLeave: React.WheelEventHandler<HTMLCanvasElement> = (event) => {
    mouseLeavePoints(event);
  };

  // draw loop
  React.useEffect(() => {
    if (!context) return;
    let animationFrameId: number;

    const render = () => {
      // context.save();
      context.setTransform(1, 0, 0, 1, 0, 0);
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      // context.imageSmoothingEnabled = false;

      context.setTransform(matrix);
      draw(context);
      // context.restore();
      animationFrameId = window.requestAnimationFrame(render);
    };
    render();

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [draw, matrix]);

  // add and remove event listener for resize
  React.useEffect(() => {
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

  React.useEffect(() => {
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
    centerImage,
  };
}
