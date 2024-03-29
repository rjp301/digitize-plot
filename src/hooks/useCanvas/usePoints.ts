import {
  MouseEventHandler,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import Point from "../../geometry/Point";
import { QuadTree, createQuadTree } from "../../geometry/QuadTree";
import use2dContext from "./use2dContext";

export default function usePoints(
  canvasRef: RefObject<HTMLCanvasElement>,
  debug: boolean
) {
  const quadtree = useRef<QuadTree | null>(null);
  const context = use2dContext(canvasRef);

  const [points, setPoints] = useState<Point[]>([]);
  const [mousePoint, setMousePoint] = useState<Point | undefined>(undefined);
  const [currentPointId, setCurrentPointId] = useState<string>("");
  const [draggingId, setDraggingId] = useState<string>("");

  // Manage points
  const createPoint = (coords: Point) => {
    const point = new Point(coords.x, coords.y);
    setPoints((prev) => [...prev, point]);
    // console.log("point created");
  };

  const deletePoint = (id: string) => {
    setPoints((prev) => [...prev.filter((pt) => pt.id !== id)]);
    // console.log("point removed");
  };

  const movePoint = (id: string, coords: Point) => {
    setPoints((prev) =>
      prev.map((pt) => (pt.id === id ? new Point(coords.x, coords.y, id) : pt))
    );
    console.log("point updated");
  };

  // Draw everything to canvas
  const drawPoints = (ctx: CanvasRenderingContext2D): void => {
    const DEFAULT_COLOUR = "#7c3aed";
    const SELECTED_COLOUR = "#a78bfa";

    if (debug) {
      // ctx.font = "12px Courier";
      // ctx.fillStyle = "red";
      // ctx.fillText(`dragging ID: ${draggingId}`, 10, 20);
      // ctx.fillText(`current ID: ${currentPointId}`, 10, 35);

      quadtree.current?.draw(ctx);
      mousePoint?.draw(ctx, {
        color: "#84cc16",
        radius: 3,
        showLabel: true,
        labelPos: "t",
      });
    }

    for (let pt of points) {
      if (debug) pt.label = pt.label || pt.id.substring(0, 4);
      if (pt.id === draggingId) continue;
      if (pt.id === currentPointId) {
        pt.draw(ctx, { color: SELECTED_COLOUR });
        continue;
      }
      pt.draw(ctx, { color: DEFAULT_COLOUR });
    }

    if (draggingId) mousePoint?.draw(ctx, { color: SELECTED_COLOUR });
  };

  // Event handlers
  const mouseMovePoints: MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (!context) return;
    const pt = new DOMPoint(
      event.nativeEvent.offsetX,
      event.nativeEvent.offsetY
    );
    const transformed = context.getTransform().invertSelf().transformPoint(pt);
    setMousePoint(new Point(transformed.x, transformed.y, "MOUSE"));
  };

  const mouseDownPoints: MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (currentPointId) {
      if (event.button === 2) deletePoint(currentPointId);
      else if (event.button === 0) setDraggingId(currentPointId);
    } else {
      if (!currentPointId && event.button === 0 && mousePoint) {
        createPoint(mousePoint);
      }
    }
  };

  const mouseUpPoints: MouseEventHandler<HTMLCanvasElement> = (event) => {
    if (event.button !== 0) return;

    if (draggingId) {
      const id = draggingId;
      setDraggingId("");
      if (!mousePoint) return;
      movePoint(id, mousePoint);
    }
  };

  const mouseLeavePoints: MouseEventHandler<HTMLCanvasElement> = (_) => {
    setMousePoint(undefined);
  };

  // rebuild quadtree whenever points update
  useEffect(() => {
    quadtree.current = createQuadTree(points);
  }, [points]);

  // determine current point
  useEffect(() => {
    if (!mousePoint || !quadtree.current || !context) return;
    const nearPoints = quadtree.current.queryRadius(
      mousePoint,
      7 / context.getTransform().a
    );
    setCurrentPointId(mousePoint.nearest(nearPoints)?.id || "");
  }, [mousePoint, points]);

  return {
    drawPoints,
    mouseDownPoints,
    mouseUpPoints,
    mouseMovePoints,
    mouseLeavePoints,
    points,
    mousePoint,
    clearPoints: () => setPoints([]),
  };
}
