import React, { useEffect } from 'react';
import { Modal } from 'react-native';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  Backdrop,
  ButtonStyled,
  ButtonText,
  Container,
  Icon,
  IconContainer,
  Message,
  Overlay,
  Title,
} from './styleNotification';

export type NotificationType = 'success' | 'error' | 'warn';

interface NotificationProps {
  visible: boolean;
  type: NotificationType;
  title: string;
  message?: string;
  onClose: () => void;
  buttonText?: string;
  onButtonPress?: () => void;
}

export function Notification({
  visible,
  type,
  title,
  message,
  onClose,
  buttonText = 'OK',
  onButtonPress,
}: NotificationProps) {
  const translateY = useSharedValue(500);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      translateY.value = withTiming(500, { duration: 250 });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [visible, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const getIconByType = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warn':
        return '⚠';
      default:
        return '!';
    }
  };

  const handleButtonPress = () => {
    if (onButtonPress) {
      onButtonPress();
    } else {
      onClose();
    }
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onClose}
    >
      <Overlay>
        <Backdrop onPress={onClose} />
        <Container style={animatedStyle}>
          <IconContainer type={type}>
            <Icon>{getIconByType()}</Icon>
          </IconContainer>

          <Title>{title}</Title>

          {message && <Message>{message}</Message>}

          <ButtonStyled
            type={type}
            onPress={handleButtonPress}
            style={({ pressed }: { pressed: boolean }) => ({
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <ButtonText>{buttonText}</ButtonText>
          </ButtonStyled>
        </Container>
      </Overlay>
    </Modal>
  );
}
