import Point from "./point";

export class Rect {
  cx: number;
  cy: number;
  w: number;
  h: number;

  west_edge: number;
  east_edge: number;
  north_edge: number;
  south_edge: number;

  constructor(cx: number, cy: number, w: number, h: number) {
    this.cx = cx;
    this.cy = cy;
    this.w = w;
    this.h = h;

    this.west_edge = cx - w / 2;
    this.east_edge = cx + w / 2;
    this.north_edge = cy + h / 2;
    this.south_edge = cy - h / 2;
  }

  toString() {
    return `BOUNDARY (${[
      this.west_edge,
      this.north_edge,
      this.east_edge,
      this.south_edge,
    ]
      .map((edge) => Math.round(edge * 1000) / 1000)
      .join(" ")})`;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const scale = ctx.getTransform().a;

    // ctx.setLineDash([5, 5]);
    ctx.strokeStyle = "#ea580c";
    ctx.lineCap = "round";
    ctx.lineWidth = 1 / scale;

    ctx.beginPath();
    ctx.rect(this.west_edge, this.south_edge, this.w, this.h);
    ctx.stroke();
    ctx.closePath();
    ctx.setLineDash([]);
  }

  contains(point: Point): boolean {
    return (
      point.x >= this.west_edge &&
      point.x < this.east_edge &&
      point.y >= this.south_edge &&
      point.y < this.north_edge
    );
  }

  intersects(other: Rect): boolean {
    return !(
      other.west_edge > this.east_edge ||
      other.east_edge < this.west_edge ||
      other.north_edge < this.south_edge ||
      other.south_edge > this.north_edge
    );
  }
}

export class QuadTree {
  boundary: Rect;
  capacity: number;
  depth: number;
  points: Point[];
  divided: boolean;

  nw?: QuadTree;
  ne?: QuadTree;
  sw?: QuadTree;
  se?: QuadTree;

  constructor(boundary: Rect, capacity = 4, depth = 0) {
    this.boundary = boundary;
    this.capacity = capacity;
    this.depth = depth;

    this.points = [];
    this.divided = false;
  }

  private subdivide(): void {
    const cx = this.boundary.cx;
    const cy = this.boundary.cy;
    const w = this.boundary.w / 2;
    const h = this.boundary.h / 2;

    const nw = new Rect(cx - w / 2, cy + h / 2, w, h);
    const ne = new Rect(cx + w / 2, cy + h / 2, w, h);
    const sw = new Rect(cx - w / 2, cy - h / 2, w, h);
    const se = new Rect(cx + w / 2, cy - h / 2, w, h);

    this.nw = new QuadTree(nw, this.capacity, this.depth + 1);
    this.ne = new QuadTree(ne, this.capacity, this.depth + 1);
    this.sw = new QuadTree(sw, this.capacity, this.depth + 1);
    this.se = new QuadTree(se, this.capacity, this.depth + 1);
    this.divided = true;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.boundary.draw(ctx);
    if (this.divided) {
      this.nw?.draw(ctx);
      this.ne?.draw(ctx);
      this.sw?.draw(ctx);
      this.se?.draw(ctx);
    }
  }

  toString(): string {
    const spacing = "\t".repeat(this.depth * 2);

    let result = this.boundary.toString() + "\n";
    result += spacing + this.points.map((pt) => pt.toString()).join(", ");

    if (!this.divided) return result;

    result += "\n";
    result += [
      "NW: " + this.nw?.toString(),
      "NE: " + this.ne?.toString(),
      "SE: " + this.se?.toString(),
      "SW: " + this.sw?.toString(),
    ]
      .map((str) => spacing + str)
      .join("\n");
    return result;
  }

  insert(point: Point): void {
    if (!this.boundary.contains(point)) return;

    if (this.points.length < this.capacity) {
      this.points.push(point);
      return;
    }

    if (!this.divided) this.subdivide();

    this.nw?.insert(point);
    this.ne?.insert(point);
    this.sw?.insert(point);
    this.se?.insert(point);
  }

  remove(point: Point): void {
    if (!this.boundary.contains(point)) return;

    console.log("removing point");
    this.points = this.points.filter((pt) => pt.id !== point.id);

    this.nw?.remove(point);
    this.ne?.remove(point);
    this.sw?.remove(point);
    this.se?.remove(point);
  }

  query(boundary: Rect, foundPoints: Point[] = []): Point[] {
    if (!this.boundary.intersects(boundary)) return [];

    foundPoints.push(...this.points.filter((pt) => boundary.contains(pt)));

    if (this.divided) {
      this.nw?.query(boundary, foundPoints);
      this.ne?.query(boundary, foundPoints);
      this.se?.query(boundary, foundPoints);
      this.sw?.query(boundary, foundPoints);
    }
    return foundPoints;
  }

  private queryCircle(
    boundary: Rect,
    center: Point,
    radius: number,
    foundPoints: Point[] = []
  ): Point[] {
    if (!this.boundary.intersects(boundary)) return [];

    foundPoints.push(
      ...this.points.filter(
        (pt) => boundary.contains(pt) && pt.distOther(center) <= radius
      )
    );

    if (this.divided) {
      this.nw?.queryCircle(boundary, center, radius, foundPoints);
      this.ne?.queryCircle(boundary, center, radius, foundPoints);
      this.se?.queryCircle(boundary, center, radius, foundPoints);
      this.sw?.queryCircle(boundary, center, radius, foundPoints);
    }
    return foundPoints;
  }

  queryRadius(center: Point, radius: number): Point[] {
    const boundary = new Rect(center.x, center.y, radius * 2, radius * 2);

    return this.queryCircle(boundary, center, radius, []);
  }
}

export function findBoundary(points: Point[]): Rect {
  const x_coords = points.map((pt) => pt.x);
  const y_coords = points.map((pt) => pt.y);

  const x_min = Math.min(...x_coords);
  const x_max = Math.max(...x_coords);
  const y_min = Math.min(...y_coords);
  const y_max = Math.max(...y_coords);

  const cx = (x_max + x_min) / 2;
  const cy = (y_min + y_max) / 2;

  const w = Math.abs(x_max - x_min) * 1.01 || 5;
  const h = Math.abs(y_max - y_min) * 1.01 || 5;

  return new Rect(cx, cy, w, h);
}

export function createQuadTree(points: Point[]): QuadTree {
  const qtree = new QuadTree(findBoundary(points));
  for (let pt of points) qtree.insert(pt);
  return qtree;
}
