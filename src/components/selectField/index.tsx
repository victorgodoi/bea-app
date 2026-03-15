import { AntDesign } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import {
  Container,
  DropdownButton,
  DropdownText,
  IconContainer,
  Label,
  ModalContent,
  ModalOverlay,
  OptionItem,
  OptionsScrollView,
  OptionText,
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
  const [dropdownLayout, setDropdownLayout] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const buttonRef = useRef<View>(null);

  const selectedOption = options.find(opt => opt.value === selectedValue);

  const handleSelect = (value: string) => {
    onValueChange(value);
    setIsOpen(false);
  };

  const handleOpen = () => {
    if (buttonRef.current) {
      buttonRef.current.measure((x, y, width, height, pageX, pageY) => {
        setDropdownLayout({ x: pageX, y: pageY + height, width, height });
        setIsOpen(true);
      });
    }
  };

  return (
    <Container>
      <Label>{label}</Label>
      <View ref={buttonRef} collapsable={false}>
        <TouchableOpacity onPress={handleOpen} activeOpacity={0.7}>
          <DropdownButton isOpen={isOpen}>
            <DropdownText>{selectedOption?.label || 'Selecione...'}</DropdownText>
            <IconContainer>
              <AntDesign name={isOpen ? "up" : "down"} size={16} color="#666" />
            </IconContainer>
          </DropdownButton>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <ModalOverlay />
        </TouchableOpacity>
        
        <ModalContent
          style={{
            position: 'absolute',
            top: dropdownLayout.y + 4,
            left: dropdownLayout.x,
            width: dropdownLayout.width,
          }}
        >
          <OptionsScrollView
            showsVerticalScrollIndicator={true}
            keyboardShouldPersistTaps="handled"
            bounces={false}
          >
            {options.map((option) => (
              <TouchableOpacity
                key={option.value}
                onPress={() => handleSelect(option.value)}
                activeOpacity={0.7}
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
          </OptionsScrollView>
        </ModalContent>
      </Modal>
    </Container>
  );
};
