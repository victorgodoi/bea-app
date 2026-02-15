// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components/native';

interface ButtonProps {
  isDisabled?: boolean;
}

export const Button = styled.TouchableOpacity<ButtonProps>`
  flex: 1;
  background-color: #c43edf;
  border-radius: 12px;
  padding: 16px;
  align-items: center;
  justify-content: center;
  opacity: ${(props: ButtonProps) => props.isDisabled ? 0.6 : 1};
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 16px;
  font-weight: bold;
`;
