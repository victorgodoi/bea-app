// eslint-disable-next-line import/no-named-as-default
import styled from "styled-components/native";

export const BoxHeader = styled.View`
  width: 100%;
  height: 130px;
  background-color: #c43edf;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;
  padding-bottom: 16px;
  padding-horizontal: 20px;
  shadow-color: #000;
  shadow-offset: {
    width: 0;
    height: 2;
  };
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 3;
`;

export const BackButton = styled.TouchableOpacity`
  width: 32px;
  height: 32px;
  justify-content: center;
  align-items: center;
`;