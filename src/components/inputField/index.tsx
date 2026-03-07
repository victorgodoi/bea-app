import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import { Container, ErrorText, Input, Label } from './styleInputField';

interface InputFieldProps extends TextInputProps {
  label: string;
  required?: boolean;
  errorMessage?: string;
}

export const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  required = false,
  errorMessage = 'Este campo é obrigatório',
  value,
  onBlur,
  ...inputProps 
}) => {
  const [touched, setTouched] = useState(false);

  const handleBlur = (e: any) => {
    setTouched(true);
    if (onBlur) {
      onBlur(e);
    }
  };

  const hasError = required && touched && !value?.toString().trim();

  return (
    <Container>
      <Label hasError={hasError}>{label}</Label>
      <Input 
        {...inputProps}
        value={value}
        hasError={hasError}
        onBlur={handleBlur}
      />
      {hasError && <ErrorText>{errorMessage}</ErrorText>}
    </Container>
  );
};
