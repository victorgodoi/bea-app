// eslint-disable-next-line import/no-named-as-default
import styled from 'styled-components/native';

export const FormContainer = styled.View`
  gap: 20px;
  margin-bottom: 20px;
`;

export const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-top: 8px;
  margin-bottom: 4px;
`;

export const SubCategoryInputRow = styled.View`
  flex-direction: row;
  align-items: flex-end;
  gap: 10px;
`;

export const SubCategoryInputWrapper = styled.View`
  flex: 1;
`;

export const AddSubCategoryButton = styled.TouchableOpacity`
  background-color: #c43edf;
  border-radius: 8px;
  padding: 12px 16px;
  justify-content: center;
  align-items: center;
  margin-bottom: 2px;
`;

export const ChipsContainer = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
`;

export const Chip = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: #f3e8ff;
  border: 1px solid #c43edf;
  border-radius: 16px;
  padding: 4px 10px 4px 12px;
  gap: 6px;
`;

export const ChipText = styled.Text`
  font-size: 13px;
  color: #7b1fa2;
  font-weight: 500;
`;

export const ChipRemoveButton = styled.TouchableOpacity`
  padding: 2px;
`;
