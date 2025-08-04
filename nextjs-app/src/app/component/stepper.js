// app/component/stepper.js

'use client';
import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Box
} from '@chakra-ui/react';

const steps = [
  { title: 'First', description: 'Personal Info' },
  { title: 'Second', description: 'Objective' },
  { title: 'Third', description: 'Experience' },
  { title: 'Fourth', description: 'Education' },
  { title: 'Fifth', description: 'Projects' },
  { title: 'Sixth', description: 'Skills' },
  { title: 'Final', description: 'CV Preview' }
];

function Progress({ step }) {
  return (
    <Box mb={10}>
      <Stepper index={step} orientation="horizontal" gap="8">
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}

export default Progress;
