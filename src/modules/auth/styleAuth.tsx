// eslint-disable-next-line import/no-named-as-default
import styled from "styled-components/native";

export const Container = styled.KeyboardAvoidingView`
  flex: 1;
`;

export const ScrollContent = styled.ScrollView`
  flex-grow: 1;
  justify-content: flex-end;
  padding-horizontal: 24px;
  padding-vertical: 40px;
  padding-top: 90px;
`;

export const LogoContainer = styled.View`
  align-items: center;
  margin-bottom: 60px;
`;

export const FormContainer = styled.View`
  background-color: transparent;
  border-radius: 20px;
  padding: 24px;
  border-width: 2px;
  border-color: #FFF;
  border-style: solid;
  margin-bottom: 40px;
`;

export const TabContainer = styled.View`
  flex-direction: row;
  margin-bottom: 24px;
  background-color: transparent;
  border-radius: 12px;
  padding: 4px;
`;

export const InputContainer = styled.View`
  gap: 16px;
`;

export const InputWrapper = styled.View`
  gap: 8px;
`;

export const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #fff;
`;