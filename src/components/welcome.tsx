import React from "react";
import ImageDropzone from "./image-dropzone";
import { Button, Card, Heading, Text } from "@radix-ui/themes";
import { ArrowRightIcon } from "lucide-react";

export type Props = {
  onImageLoad: (image: HTMLImageElement) => void;
};

const Welcome: React.FC<Props> = ({ onImageLoad }) => {
  const [file, setFile] = React.useState<File | undefined>();

  const createImage = (url: string) => {
    const img = new Image();
    img.src = url;
    img.onload = () => onImageLoad(img);
    img.onerror = (err) => {
      console.log("Could not load image");
      console.error(err);
    };
  };

  const useSample: React.MouseEventHandler = (_) => {
    // const url = `BPL220K 24ft.png`;
    const url = "beam-in-tension.png";
    createImage(url);
  };

  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-4">
      <Card size="3" className="grid w-full max-w-lg gap-5">
        <header className="grid gap-2">
          <Heading size="3">Welcome to Digitize Plot</Heading>

          <Text size="2" color="gray" as="p">
            A tool to quickly and painlessly convert images of plotted data into
            raw points.
          </Text>

          <Text size="2" color="gray" as="p">
            To get started, choose an image of a plot to be digitized. Or if you
            just want to try out the app, start with a sample image.
          </Text>
        </header>

        <ImageDropzone file={file} setFile={setFile} />

        <footer className="grid grid-cols-2 gap-3">
          <Button highContrast onClick={useSample}>
            Use sample image
          </Button>
          <Button
            highContrast
            onClick={() => {
              if (!file) return;
              const url = URL.createObjectURL(file);
              createImage(url);
            }}
            disabled={!file}
          >
            Let's go
            <ArrowRightIcon className="size-4" />
          </Button>
        </footer>
      </Card>
    </div>
  );
};

export default Welcome;
