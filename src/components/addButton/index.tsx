import { AntDesign } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { Button } from './styleAddButton';

interface AddButtonProps extends TouchableOpacityProps {
  iconSize?: number;
  iconColor?: string;
}

export const AddButton: React.FC<AddButtonProps> = ({ 
  iconSize = 24,
  iconColor = '#fff',
  ...rest 
}) => {
  return (
    <Button {...rest}>
      <AntDesign name="plus" size={iconSize} color={iconColor} />
    </Button>
  );
};
