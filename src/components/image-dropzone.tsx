import React, { useEffect, useState } from "react";

import { useDropzone } from "react-dropzone";
import { monitorForExternal } from "@atlaskit/pragmatic-drag-and-drop/external/adapter";
import { containsFiles } from "@atlaskit/pragmatic-drag-and-drop/external/file";
import { cn } from "@/lib/utils";
import { IconButton, Text } from "@radix-ui/themes";
import { XIcon } from "lucide-react";

type Props = {
  file: File | undefined;
  setFile: (file: File | undefined) => void;
};

const ImageDropzone: React.FC<Props> = ({ file, setFile }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".gif", ".bmp", ".webp"] },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
      }
    },
  });

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() =>
    monitorForExternal({
      canMonitor: containsFiles,
      onDragStart: () => setIsDragging(true),
      onDrop: () => setIsDragging(false),
    }),
  );

  if (file) {
    const url = URL.createObjectURL(file);
    return (
      <div className="relative overflow-clip rounded-xl border">
        <img src={url} alt="Uploaded plot" className="h-full object-contain" />
        <IconButton
          size="1"
          color="red"
          radius="full"
          className="absolute top-2 right-2"
          variant="soft"
          onClick={() => setFile(undefined)}
        >
          <XIcon className="size-4" />
        </IconButton>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "bg-gray-2 flex h-24 w-full cursor-pointer items-center justify-center rounded-xl border border-dashed transition-colors",
        isDragging && "border-accent-7 bg-accent-2",
      )}
    >
      <input {...getInputProps()} />
      <Text size="1" color={isDragging ? undefined : "gray"}>
        Drop image here
      </Text>
    </div>
  );
};

export default ImageDropzone;
