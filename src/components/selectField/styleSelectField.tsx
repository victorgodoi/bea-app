// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components/native';

export const Container = styled.View`
  gap: 8px;
  position: relative;
  z-index: 1000;
`;

export const Label = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #333;
`;

export const DropdownButton = styled.View<{ isOpen?: boolean }>`
  background-color: #f5f5f5;
  border-radius: 12px;
  padding: 16px;
  border-width: 1px;
  border-color: ${(props: { isOpen?: boolean }) => 
    props.isOpen ? '#c43edf' : '#e0e0e0'};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const DropdownText = styled.Text`
  font-size: 16px;
  color: #333;
  flex: 1;
`;

export const IconContainer = styled.View`
  margin-left: 8px;
`;

export const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.2);
`;

export const ModalContent = styled.View`
  background-color: #fff;
  border-radius: 12px;
  border-width: 1px;
  border-color: #e0e0e0;
  shadow-color: #000;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.15;
  shadow-radius: 8px;
  elevation: 8;
  max-height: 250px;
  overflow: hidden;
`;

export const OptionsScrollView = styled.ScrollView.attrs({
  contentContainerStyle: {
    flexGrow: 1,
  },
})``;

export const OptionItem = styled.View<{ selected?: boolean }>`
  padding: 16px;
  border-bottom-width: 1px;
  border-bottom-color: #f0f0f0;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${(props: { selected?: boolean }) => 
    props.selected ? '#f3e5f5' : 'transparent'};
`;

export const OptionText = styled.Text<{ selected?: boolean }>`
  font-size: 16px;
  color: ${(props: { selected?: boolean }) => 
    props.selected ? '#c43edf' : '#333'};
  font-weight: ${(props: { selected?: boolean }) => 
    props.selected ? '600' : '400'};
  flex: 1;
`;
