import React from "react";
import type { Calibrations } from "@/lib/interpolators/types";
import { Heading, Text, TextField } from "@radix-ui/themes";

export type Props = {
  calibrations: Calibrations;
  setCalibrations: React.Dispatch<React.SetStateAction<Calibrations>>;
};

export default function Calibrate(props: Props) {
  const updateValue = (
    event: React.ChangeEvent<HTMLInputElement>,
    id: keyof Calibrations,
  ) => {
    const value = Number(event.target.value);

    props.setCalibrations((prev) => ({
      ...prev,
      [id]: prev[id].copyWithValue(value),
    }));
  };

  return (
    <article className="grid gap-5 p-4">
      <Heading as="h3" color="gray" size="2" className="uppercase">
        Calibrations
      </Heading>
      <section className="grid gap-2">
        <Heading as="h4" color="gray" size="1" className="uppercase">
          X-Axis
        </Heading>

        <TextField.Root
          type="number"
          value={props.calibrations.x1.value}
          onChange={(e) => updateValue(e, "x1")}
          onFocus={(e) => e.target.select()}
        >
          <TextField.Slot>
            <Text size="2" color="gray">
              X1
            </Text>
          </TextField.Slot>
        </TextField.Root>

        <TextField.Root
          type="number"
          value={props.calibrations.x2.value}
          onChange={(e) => updateValue(e, "x2")}
          onFocus={(e) => e.target.select()}
        >
          <TextField.Slot>
            <Text size="2" color="gray">
              X2
            </Text>
          </TextField.Slot>
        </TextField.Root>
      </section>
      <div className="grid gap-2">
        <Heading as="h4" color="gray" size="1" className="uppercase">
          Y-Axis
        </Heading>

        <TextField.Root
          type="number"
          value={props.calibrations.y1.value}
          onChange={(e) => updateValue(e, "y1")}
          onFocus={(e) => e.target.select()}
        >
          <TextField.Slot>
            <Text size="2" color="gray">
              Y1
            </Text>
          </TextField.Slot>
        </TextField.Root>

        <TextField.Root
          type="number"
          value={props.calibrations.y2.value}
          onChange={(e) => updateValue(e, "y2")}
          onFocus={(e) => e.target.select()}
        >
          <TextField.Slot>
            <Text size="2" color="gray">
              Y2
            </Text>
          </TextField.Slot>
        </TextField.Root>
      </div>
    </article>
  );
}
