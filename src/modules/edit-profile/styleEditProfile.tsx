// eslint-disable-next-line import/no-named-as-default
import styled from "styled-components/native";

export const Title = styled.Text`
  font-size: 26px;
  font-weight: bold;
  color: #333;
  margin-bottom: 32px;
`;

export const FormContainer = styled.View`
  gap: 20px;
`;

export const InputWrapper = styled.View`
  gap: 8px;
`;

export const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

export const Footer = styled.View`
  flex-direction: row;
  padding: 20px;
  padding-bottom: 30px;
  gap: 12px;
  background-color: #fff;
  border-top-width: 1px;
  border-top-color: #e0e0e0;
`;

export const CancelButton = styled.TouchableOpacity`
  flex: 1;
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 16px;
  align-items: center;
  justify-content: center;
`;

export const CancelButtonText = styled.Text`
  color: #666;
  font-size: 16px;
  font-weight: 600;
`;

export const SaveButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;