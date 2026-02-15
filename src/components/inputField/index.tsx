import React from 'react';
import { TextInputProps } from 'react-native';
import { Container, Input, Label } from './styleInputField';

interface InputFieldProps extends TextInputProps {
  label: string;
}

export const InputField: React.FC<InputFieldProps> = ({ label, ...inputProps }) => {
  return (
    <Container>
      <Label>{label}</Label>
      <Input {...inputProps} />
    </Container>
  );
};
