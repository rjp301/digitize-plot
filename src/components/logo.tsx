import { Heading, Link } from "@radix-ui/themes";
import { ChartSplineIcon } from "lucide-react";
import React from "react";

const Logo: React.FC = () => {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="flex items-center gap-2">
        <div className="bg-accent-3 text-accent-12 border-accent-7 rounded-md border p-1">
          <ChartSplineIcon className="size-4" />
        </div>
        <Heading size="4">Digitize Plot</Heading>
      </h1>
      <span className="text-muted-foreground text-xs">
        An app by{" "}
        <Link
          color="gray"
          className="hover:text-primary text-muted-foreground/80 underline-offset-2 hover:underline"
          href="https://rileypaul.ca"
          target="_blank"
        >
          Riley Paul
        </Link>
      </span>
    </div>
  );
};

export default Logo;
