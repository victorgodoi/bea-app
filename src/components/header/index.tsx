import { useDrawer } from "@/src/contexts/DrawerContext";
import { AntDesign } from "@expo/vector-icons";
import { Image, TouchableOpacity, View } from "react-native";
import { BoxHeader } from "./styleHeader";

export const Header = () => {
  const { openDrawer } = useDrawer();

  return (
    <BoxHeader>
      <TouchableOpacity onPress={openDrawer}>
        <AntDesign name="menu" size={32} color="#fff" />
      </TouchableOpacity>
      <Image
        source={require("../../../assets/images/iconBea.png")}
        style={{ width: 64, height: 64 }}
      />
      <View style={{ width: 32 }} />
    </BoxHeader>
  );
};