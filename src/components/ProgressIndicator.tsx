import React from "react";
import { cn } from "../lib/utils";

interface ProgressIndicatorProps {
  steps: string[];
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const ProgressIndicator = ({
  steps = [
    "Personal Information",
    "Property Details",
    "Loan Requirements",
    "Review",
  ],
  currentStep = 0,
  onStepClick,
}: ProgressIndicatorProps) => {
  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isClickable = onStepClick && index < currentStep;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <button
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all",
                    isCompleted
                      ? "bg-green-500 text-white"
                      : isCurrent
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-500",
                    isClickable
                      ? "cursor-pointer hover:opacity-80"
                      : "cursor-default",
                  )}
                  onClick={() => isClickable && onStepClick(index)}
                  disabled={!isClickable}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    index + 1
                  )}
                </button>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium",
                    isCompleted
                      ? "text-green-500"
                      : isCurrent
                        ? "text-blue-500"
                        : "text-gray-500",
                  )}
                >
                  {step}
                </span>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-1 flex-1 mx-2",
                    index < currentStep
                      ? "bg-green-500"
                      : index === currentStep
                        ? "bg-gradient-to-r from-green-500 to-gray-200"
                        : "bg-gray-200",
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressIndicator;
