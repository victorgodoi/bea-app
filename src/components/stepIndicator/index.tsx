import React from 'react';
import { Container, StepDot, StepText, StepWrapper } from './styleStepIndicator';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <Container>
      <StepText>
        Etapa {currentStep} de {totalSteps}
      </StepText>
      <StepWrapper>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <StepDot
            key={index}
            active={index + 1 === currentStep}
            completed={index + 1 < currentStep}
          />
        ))}
      </StepWrapper>
    </Container>
  );
};
