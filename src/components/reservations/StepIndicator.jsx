import React from "react";

export default function StepIndicator({ currentStep, steps }) {
  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex flex-col items-center">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-all ${
                currentStep === step.number
                  ? "bg-indigo-500 text-white"
                  : currentStep > step.number
                  ? "bg-indigo-200 text-indigo-700"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {step.number}
            </div>
            <span className={`mt-2 text-sm font-medium hidden sm:block ${
              currentStep === step.number ? "text-indigo-600" : "text-gray-500"
            }`}>
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={`w-16 h-0.5 mx-2 ${
              currentStep > step.number ? "bg-indigo-200" : "bg-gray-300"
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}