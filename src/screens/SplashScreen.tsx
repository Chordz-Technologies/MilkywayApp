import React, { useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import SafeAreaWrapper from '../styles/SafeAreaWrapper';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const decideNext = async () => {
      const hasSeenSlides = await AsyncStorage.getItem('hasSeenSlides');
      const isLoggedOutValue = await AsyncStorage.getItem('isLoggedOut');
      const isLoggedOut = isLoggedOutValue === 'true';

      setTimeout(() => {
        if (isLoggedOut) {
          navigation.reset({
            index: 0,
            routes: [{ name: hasSeenSlides ? 'Slide' : 'Login' }],
          });
          return;
        }

        if (isAuthenticated && user?.role) {
          if (user.role === 'vendor') {
            navigation.reset({ index: 0, routes: [{ name: 'VendorHome' }] });
          } else if (user.role === 'customer') {
            navigation.reset({ index: 0, routes: [{ name: 'ConsumerHome' }] });
          } else if (user.role === 'milkman') {
            navigation.reset({
              index: 0,
              routes: [{ name: 'DistributorHome' }],
            });
          }
          return;
        }

        navigation.reset({
          index: 0,
          routes: [{ name: hasSeenSlides ? 'Login' : 'Slide' }],
        });
      }, 1500);
    };

    decideNext();
  }, [isAuthenticated, user?.role]);

  return (
    <SafeAreaWrapper>
      <ImageBackground
        source={require('../assets/waves.jpg')}
        style={styles.background}
        resizeMode="cover"
      >
        {/* Center Logo */}
        <Image
          source={require('../assets/logo.jpeg')}
          style={styles.logo}
        />
      </ImageBackground>
    </SafeAreaWrapper>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
  },
});
