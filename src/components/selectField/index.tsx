import { AntDesign } from '@expo/vector-icons';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import {
  Container,
  DropdownButton,
  DropdownList,
  DropdownText,
  IconContainer,
  Label,
  OptionItem,
  OptionText,
  ScrollContainer,
} from './styleSelectField';

interface SelectFieldProps {
  label: string;
  selectedValue: string;
  onValueChange: (value: string) => void;
  options: { label: string; value: string }[];
}

export const SelectField: React.FC<SelectFieldProps> = ({
  label,
  selectedValue,
  onValueChange,
  options,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === selectedValue);

  const handleSelect = (value: string) => {
    onValueChange(value);
    setIsOpen(false);
  };

  return (
    <Container>
      <Label>{label}</Label>
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)} activeOpacity={0.7}>
        <DropdownButton isOpen={isOpen}>
          <DropdownText>{selectedOption?.label || 'Selecione...'}</DropdownText>
          <IconContainer>
            <AntDesign name={isOpen ? "up" : "down"} size={16} color="#666" />
          </IconContainer>
        </DropdownButton>
      </TouchableOpacity>

      {isOpen && (
        <DropdownList>
          <ScrollContainer
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={true}
            scrollEnabled={true}
            keyboardShouldPersistTaps='handled'
            bounces={false}
          >
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleSelect(option.value)}
                activeOpacity={0.7}
                delayPressIn={0}
              >
                <OptionItem selected={option.value === selectedValue}>
                  <OptionText selected={option.value === selectedValue}>
                    {option.label}
                  </OptionText>
                  {option.value === selectedValue && (
                    <AntDesign name="check" size={18} color="#c43edf" />
                  )}
                </OptionItem>
              </TouchableOpacity>
            ))}
          </ScrollContainer>
        </DropdownList>
      )}
    </Container>
  );
};
