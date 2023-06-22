import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import HomeStack from './routes/HomeStack';
import { useEffect } from 'react';
import {useFonts} from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationContainer} from "@react-navigation/native";

export default function App() {

  const [fontsLoaded] = useFonts({
    'Nunito-Bold': require('./assets/fonts/Nunito-Bold.ttf'),
    'Nunito-Sans-Bold': require('./assets/fonts/NunitoSans_10pt-Bold.ttf'),
    'Nunito-Sans': require('./assets/fonts/NunitoSans_10pt-Regular.ttf'),
    'Helvetica': require('./assets/fonts/Helvetica.ttf'),
    'Helvetica-Bold': require('./assets/fonts/Helvetica-Bold.ttf'),
    'Popins': require('./assets/fonts/Poppins-Regular.ttf'),
    'Popins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'Popins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  if (!fontsLoaded) {
    return undefined;
  } else {
    SplashScreen.hideAsync();
  }
  return (
    <NavigationContainer>
      <HomeStack></HomeStack>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
