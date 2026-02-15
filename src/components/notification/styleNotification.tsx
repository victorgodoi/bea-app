import Animated from 'react-native-reanimated';
// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components/native';

interface IconContainerProps {
  type: 'success' | 'error' | 'warn';
}

interface ButtonStyledProps {
  type: 'success' | 'error' | 'warn';
}

const getIconColor = (type: 'success' | 'error' | 'warn') => {
  switch (type) {
    case 'success':
      return '#10B981';
    case 'error':
      return '#EF4444';
    case 'warn':
      return '#F59E0B';
    default:
      return '#10B981';
  }
};

export const Overlay = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

export const Backdrop = styled.Pressable`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const Container = styled(Animated.View)`
  width: 85%;
  max-width: 400px;
  background-color: #fff;
  border-radius: 16px;
  padding: 24px;
  align-items: center;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.3;
  shadow-radius: 8px;
  elevation: 8;
`;

export const IconContainer = styled.View<IconContainerProps>`
  width: 56px;
  height: 56px;
  border-radius: 28px;
  justify-content: center;
  align-items: center;
  margin-bottom: 16px;
  background-color: ${(props: IconContainerProps) => getIconColor(props.type)};
`;

export const Icon = styled.Text`
  font-size: 28px;
  font-weight: bold;
  color: #fff;
`;

export const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  color: #1f2937;
  margin-bottom: 8px;
  text-align: center;
`;

export const Message = styled.Text`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 20px;
  text-align: center;
  line-height: 20px;
`;

export const ButtonStyled = styled.Pressable<ButtonStyledProps>`
  width: 100%;
  padding-vertical: 12px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  background-color: ${(props: ButtonStyledProps) => getIconColor(props.type)};
`;

export const ButtonText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #fff;
`;
