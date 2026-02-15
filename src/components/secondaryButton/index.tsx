import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { Button, ButtonText } from './styleSecondaryButton';

interface SecondaryButtonProps extends TouchableOpacityProps {
  title: string;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({ 
  title, 
  ...rest 
}) => {
  return (
    <Button {...rest}>
      <ButtonText>{title}</ButtonText>
    </Button>
  );
};
