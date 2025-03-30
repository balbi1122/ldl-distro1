import React from "react";
import { Button } from "./ui/button";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

interface NavigationControlsProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isNextDisabled?: boolean;
  isPreviousDisabled?: boolean;
  isSubmitDisabled?: boolean;
}

const NavigationControls = ({
  currentStep = 1,
  totalSteps = 4,
  onPrevious = () => {},
  onNext = () => {},
  onSubmit = () => {},
  isNextDisabled = false,
  isPreviousDisabled = false,
  isSubmitDisabled = false,
}: NavigationControlsProps) => {
  // Add keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle keyboard navigation if not in a form input
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA" ||
        document.activeElement?.tagName === "SELECT"
      ) {
        return;
      }

      if (e.key === "ArrowRight" && !isNextDisabled && !isLastStep) {
        onNext();
      } else if (e.key === "ArrowLeft" && !isPreviousDisabled && !isFirstStep) {
        onPrevious();
      } else if (
        e.key === "Enter" &&
        (isReviewStep || isLastStep) &&
        !isSubmitDisabled
      ) {
        onSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentStep, isNextDisabled, isPreviousDisabled, isSubmitDisabled]);
  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === totalSteps;
  const isReviewStep = currentStep === totalSteps - 1;

  return (
    <div className="flex justify-between items-center w-full py-4 px-2 bg-white border-t border-gray-200">
      <div>
        {!isFirstStep && (
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isPreviousDisabled}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </Button>
        )}
      </div>

      <div className="flex gap-2">
        {!isLastStep && (
          <Button
            onClick={onNext}
            disabled={isNextDisabled}
            className="flex items-center gap-2"
          >
            Next
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}

        {isReviewStep && (
          <Button
            onClick={onSubmit}
            disabled={isSubmitDisabled}
            variant="default"
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            Submit Application
            <Check className="h-4 w-4" />
          </Button>
        )}

        {isLastStep && (
          <Button
            onClick={onSubmit}
            disabled={isSubmitDisabled}
            variant="default"
            className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
          >
            Finish
            <Check className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default NavigationControls;
