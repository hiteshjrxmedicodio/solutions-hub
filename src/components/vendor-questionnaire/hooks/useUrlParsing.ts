import { useState, useCallback, useRef } from "react";
import { VendorQuestionnaireData } from "../types";
import { mergeInitialData } from "../utils/formData";

export function useUrlParsing(
  setFormData: React.Dispatch<React.SetStateAction<VendorQuestionnaireData>>,
  setStep0Completed: (value: boolean) => void,
  setCurrentStep: (step: number | ((prev: number) => number)) => void,
  modalRef: React.RefObject<HTMLDivElement | null>
) {
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  const handleUrlSubmit = useCallback(async (url: string) => {
    setIsParsing(true);
    setParseError(null);

    try {
      const response = await fetch("/api/automation/vendor/parse-website-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error("Failed to start parsing");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error("No response body");
      }

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'status') {
                console.log(data.message);
              } else if (data.type === 'section') {
                // Merge section data immediately
                setFormData((current) => mergeInitialData(current, data.data));
              } else if (data.type === 'complete') {
                // Final complete data
                setFormData((current) => mergeInitialData(current, data.data));
              } else if (data.type === 'error') {
                console.error(`Error in ${data.section}:`, data.message);
              }
            } catch (e) {
              console.error("Error parsing SSE data:", e);
            }
          }
        }
      }

      // Move to next step after parsing completes
      setStep0Completed(true);
      setCurrentStep(1);
      setTimeout(() => {
        modalRef.current?.querySelector('.form-content')?.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } catch (error: any) {
      console.error("Error parsing website:", error);
      setParseError(error.message || "Failed to parse website. Please try again.");
    } finally {
      setIsParsing(false);
    }
  }, [setFormData, setStep0Completed, setCurrentStep, modalRef]);

  return { isParsing, parseError, handleUrlSubmit };
}

