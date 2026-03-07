// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components/native';

export const Container = styled.View`
  gap: 8px;
`;

interface LabelProps {
  hasError?: boolean;
}

export const Label = styled.Text<LabelProps>`
  font-size: 14px;
  font-weight: 600;
  color: ${({ hasError }) => (hasError ? '#e74c3c' : '#333')};
`;

interface InputProps {
  hasError?: boolean;
}

export const Input = styled.TextInput<InputProps>`
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 16px;
  font-size: 16px;
  border-width: 1px;
  border-color: ${({ hasError }) => (hasError ? '#e74c3c' : '#e0e0e0')};
  color: #333;
`;

export const ErrorText = styled.Text`
  font-size: 12px;
  color: #e74c3c;
  margin-top: -4px;
`;
