import { CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { Calibrations } from "@/hooks/useCanvas/useCalibrators";

export type Props = {
  calibrations: Calibrations;
  setCalibrations: Dispatch<SetStateAction<Calibrations>>;
};

export default function Calibrate(props: Props) {
  const updateValue = (
    event: ChangeEvent<HTMLInputElement>,
    id: keyof Calibrations
  ) => {
    const value = Number(event.target.value);

    props.setCalibrations((prev) => ({
      ...prev,
      [id]: prev[id].copyWithValue(value),
    }));
  };

  return (
    <section>
      <CardHeader className="pt-0">
        <CardTitle>Calibrate X-Axis</CardTitle>
        <div className="text-sm text-muted-foreground flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Label>X1</Label>
            <Input
              type="number"
              value={props.calibrations.x1.value}
              onChange={(e) => updateValue(e, "x1")}
              onFocus={(e) => e.target.select()}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label>X2</Label>
            <Input
              type="number"
              value={props.calibrations.x2.value}
              onChange={(e) => updateValue(e, "x2")}
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>
      </CardHeader>
      <CardHeader className="pt-0">
        <CardTitle>Calibrate Y-Axis</CardTitle>
        <div className="text-sm text-muted-foreground flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Label>Y1</Label>
            <Input
              type="number"
              value={props.calibrations.y1.value}
              onChange={(e) => updateValue(e, "y1")}
              onFocus={(e) => e.target.select()}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label>Y2</Label>
            <Input
              type="number"
              value={props.calibrations.y2.value}
              onChange={(e) => updateValue(e, "y2")}
              onFocus={(e) => e.target.select()}
            />
          </div>
        </div>
      </CardHeader>
    </section>
  );
}
