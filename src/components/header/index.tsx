import { Image, View } from "react-native";
import { BoxHeader } from "./styleHeader";

export const Header = () => {
  return (
    <BoxHeader>
      <View style={{ width: 10 }} />
      <Image
        source={require("../../../assets/images/iconBea.png")}
        style={{ width: 64, height: 64 }}
      />
      <View style={{ width: 10 }} />
    </BoxHeader>
  );
};