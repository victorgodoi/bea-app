import { useHeaderHeight } from '@/hooks/use-header-height';
import { useDrawer } from '@/src/contexts/DrawerContext';
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, TouchableOpacity, View } from 'react-native';
import { BoxHeader } from './styleHeader';

export const Header = () => {
  const { openDrawer } = useDrawer();
  const router = useRouter();
  const headerHeight = useHeaderHeight();

  return (
    <BoxHeader height={headerHeight}>
      <TouchableOpacity onPress={openDrawer}>
        <AntDesign name="menu" size={32} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          router.replace('/');
        }}
      >
        <Image
          source={require('../../../assets/images/iconBea.png')}
          style={{ width: 64, height: 64 }}
        />
      </TouchableOpacity>
      <View style={{ width: 32 }} />
    </BoxHeader>
  );
};
