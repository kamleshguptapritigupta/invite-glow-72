// src/pages/create/PreviewModal.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import Preview from "@/components/preview/Preview";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  greetingData: any;
  selectedEvent: any;
};

export default function PreviewModal({ isOpen, onClose, greetingData, selectedEvent }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative max-w-6xl w-full max-h-[90vh] overflow-auto">
        <Button
          onClick={onClose}
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 bg-background/80 backdrop-blur"
        >
          ✕
        </Button>
        <Preview greetingData={greetingData} selectedEvent={selectedEvent} />
      </div>
    </div>
  );
}
