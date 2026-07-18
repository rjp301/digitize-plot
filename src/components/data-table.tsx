import Point from "src/geometry/point";

import { useAtom } from "jotai";
import { hoveringPointIdAtom, pointsAtom } from "@/lib/store";
import { cn } from "@/lib/utils";
import React from "react";
import usePoints from "@/hooks/use-points";
import { IconSearch } from "@tabler/icons-react";
import Empty from "./ui/empty";
import { Table } from "@radix-ui/themes";

export type Props = {
  coordsConverter: (coords: Point) => Point;
};

const DataTable: React.FC<Props> = ({ coordsConverter }: Props) => {
  const { points } = usePoints(pointsAtom);
  const [hoveredPointId, setHoveredPointId] = useAtom(hoveringPointIdAtom);

  const toString = (num: number) =>
    num.toLocaleString(undefined, { minimumFractionDigits: 2 });

  if (points.length === 0) {
    return (
      <Empty.Root className="h-full px-4">
        <Empty.Header>
          <Empty.Media variant="icon">
            <IconSearch className="size-4" />
          </Empty.Media>
          <Empty.Title>No points</Empty.Title>
          <Empty.Description>
            Click on the plot to add points, and they will appear here.
          </Empty.Description>
        </Empty.Header>
      </Empty.Root>
    );
  }

  return (
    <Table.Root size="1">
      <Table.Header>
        <Table.Row>
          <Table.RowHeaderCell className="w-1/2 text-center">
            X
          </Table.RowHeaderCell>
          <Table.RowHeaderCell className="w-1/2 text-center">
            Y
          </Table.RowHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {points.map(coordsConverter).map((pt) => (
          <Table.Row
            key={pt.id}
            className={cn(hoveredPointId === pt.id && "bg-gray-2")}
            onMouseEnter={() => setHoveredPointId(pt.id)}
            onMouseLeave={() => setHoveredPointId("")}
          >
            <Table.Cell className="text-center">{toString(pt.x)}</Table.Cell>
            <Table.Cell className="text-center">{toString(pt.y)}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

export default DataTable;
