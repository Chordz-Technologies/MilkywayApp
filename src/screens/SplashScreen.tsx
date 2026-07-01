import React, { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import SafeAreaWrapper from '../styles/SafeAreaWrapper';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const { isAuthenticated, user, isAuthChecked } = useSelector(
    (state: RootState) => state.auth
  );
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (!isAuthChecked) {
      return;
    }

    const decideNext = async () => {
      const hasSeenSlides = await AsyncStorage.getItem('hasSeenSlides');
      const isLoggedOutValue = await AsyncStorage.getItem('isLoggedOut');
      const accessToken = await AsyncStorage.getItem('access_token');
      const isLoggedOut = isLoggedOutValue === 'true';

      setTimeout(() => {
        if (isLoggedOut) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          });
          return;
        }

        if (accessToken && !isAuthenticated) {
          navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
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
  }, [isAuthenticated, isAuthChecked, user?.role, navigation]);

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <Image
          source={require('../assets/splash.jpeg')}
          style={styles.splashImage}
        />
      </View>
    </SafeAreaWrapper>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  splashImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
});
