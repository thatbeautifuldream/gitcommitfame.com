import { Loader as LoaderIcon } from "lucide-react";
import React from "react";

export default function Loader() {
  return (
    <div className="flex h-screen items-center justify-center">
      <LoaderIcon className="animate-spin" />
    </div>
  );
}
