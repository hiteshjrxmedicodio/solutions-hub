"use client";

import { useState } from "react";
import { VendorQuestionnaire } from "./VendorQuestionnaire";
import { VendorQuestionnaireData } from "./types";

interface VendorQuestionnaireButtonProps {
  onOpen?: () => void;
  onClose?: () => void;
  onSubmit?: (data: VendorQuestionnaireData) => Promise<void>;
  buttonText?: string;
  buttonClassName?: string;
}

export function VendorQuestionnaireButton({
  onOpen,
  onClose,
  onSubmit,
  buttonText = "Open Vendor Questionnaire",
  buttonClassName = "",
}: VendorQuestionnaireButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
    onOpen?.();
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  const handleQuestionnaireSubmit = async (data: VendorQuestionnaireData) => {
    if (onSubmit) {
      await onSubmit(data);
    }
    handleClose();
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className={`px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md ${buttonClassName}`}
      >
        {buttonText}
      </button>

      <VendorQuestionnaire
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={handleQuestionnaireSubmit}
      />
    </>
  );
}

