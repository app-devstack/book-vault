import { HomeScreen } from '@/features/home/HomeScreen';
import { COLORS } from '@/utils/colors';
import { StyleSheet, View } from 'react-native';

export default function HomePage() {
  return (
    <View style={styles.container}>
      <HomeScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
