import { Heading, Text, TextField } from "@radix-ui/themes";
import Point from "src/geometry/point";

export type Props = {
  mousePoint: Point | undefined;
  coordsConverter: (coords: Point) => Point;
};

export default function MouseCoords(props: Props) {
  const { mousePoint, coordsConverter } = props;
  const point = mousePoint || new Point(0, 0);
  const { x, y } = coordsConverter(point);

  return (
    <div className="grid gap-3 p-4">
      <Heading size="2" color="gray" className="uppercase" as="h3">
        Mouse Coordinates
      </Heading>
      <div className="grid gap-2">
        <TextField.Root readOnly value={x.toLocaleString()}>
          <TextField.Slot side="left">
            <Text color="gray" size="2">
              X
            </Text>
          </TextField.Slot>
        </TextField.Root>
        <TextField.Root readOnly value={y.toLocaleString()}>
          <TextField.Slot side="left">
            <Text color="gray" size="2">
              Y
            </Text>
          </TextField.Slot>
        </TextField.Root>
      </div>
    </div>
  );
}
