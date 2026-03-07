import React, { useState } from 'react';
import { TextInputProps } from 'react-native';
import { Container, ErrorText, Input, Label } from './styleInputFieldNumber';

interface InputFieldNumberProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label: string;
  required?: boolean;
  errorMessage?: string;
  value: string;
  onChangeText: (text: string) => void;
  mask?: string; // Exemplo: "##/##" onde # representa um número
}

export const InputFieldNumber: React.FC<InputFieldNumberProps> = ({ 
  label, 
  required = false,
  errorMessage = 'Este campo é obrigatório',
  value,
  onChangeText,
  onBlur,
  mask,
  ...inputProps 
}) => {
  const [touched, setTouched] = useState(false);

  const applyMask = (text: string): string => {
    if (!mask) return text;

    // Remove tudo que não é número
    const numbers = text.replace(/\D/g, '');
    
    let maskedText = '';
    let numberIndex = 0;

    // Aplica a máscara
    for (let i = 0; i < mask.length && numberIndex < numbers.length; i++) {
      if (mask[i] === '#') {
        maskedText += numbers[numberIndex];
        numberIndex++;
      } else {
        maskedText += mask[i];
      }
    }

    return maskedText;
  };

  const handleChangeText = (text: string) => {
    // Remove tudo que não é número
    const numbersOnly = text.replace(/\D/g, '');
    
    // Aplica a máscara se existir
    const maskedValue = mask ? applyMask(numbersOnly) : numbersOnly;
    
    onChangeText(maskedValue);
  };

  const handleBlur = (e: any) => {
    setTouched(true);
    if (onBlur) {
      onBlur(e);
    }
  };

  const hasError = required && touched && !value?.trim();

  return (
    <Container>
      <Label hasError={hasError}>{label}</Label>
      <Input 
        {...inputProps}
        value={value}
        hasError={hasError}
        onBlur={handleBlur}
        onChangeText={handleChangeText}
        keyboardType="number-pad"
      />
      {hasError && <ErrorText>{errorMessage}</ErrorText>}
    </Container>
  );
};
