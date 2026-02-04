import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, TouchableOpacity, View } from "react-native";
import { BackButton, BoxHeader } from "./styleHeaderSecundary";

export const HeaderSecundary = () => {
  const router = useRouter();

  return (
    <BoxHeader>
      <BackButton onPress={() => router.back()}>
        <AntDesign name="arrow-left" size={24} color="#fff" />
      </BackButton>
      <TouchableOpacity onPress={() => { router.replace('/') }}>
        <Image
          source={require('@/assets/images/iconBea.png')}
          style={{ width: 64, height: 64 }}
        />
      </TouchableOpacity>
      <View style={{ width: 32 }} />
    </BoxHeader>
  );
};