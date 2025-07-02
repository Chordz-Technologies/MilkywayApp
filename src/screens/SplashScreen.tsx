import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, Dimensions, Animated, Easing } from 'react-native';
import colors from '../theme/colors';

type SplashScreenProps = {
  navigation: {
    replace: (route: string) => void;
  };
};

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const bounceAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      // Fade in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Scale up
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.elastic(1.2),
        useNativeDriver: true,
      }),
      // Bounce animation for cow
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ),
      // Slide up for subtitle
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      // Rotate milk bottle slightly
      Animated.loop(
        Animated.sequence([
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        { iterations: 3 }
      ),
    ]).start();

    // Navigate after 6 seconds
    const timer = setTimeout(() => {
      navigation.replace('Slide');
    }, 6000);
    return () => clearTimeout(timer);
  },[navigation, fadeAnim, scaleAnim, bounceAnim, slideUpAnim, rotateAnim]);

  // Interpolate animation values
  const bounceInterpolate = bounceAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15],
  });

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '5deg'],
  });

  return (
    <Animated.View style={[styles.root, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />
      <View style={styles.row}>
        <Text style={styles.bigText}>FRESH</Text>
        <Animated.View style={{ transform: [{ translateY: bounceInterpolate }] }}>
          <Image
            source={require('../assets/cow.png')}
            style={styles.cow}
            resizeMode="contain"
          />
        </Animated.View>
        <Text style={styles.bigText}>Milk</Text>
      </View>

      <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
        <Image
          source={require('../assets/milk.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.Text style={[styles.subtitle, { transform: [{ translateY: slideUpAnim }] }]}>
        Fresh Milk Delivered Daily
      </Animated.Text>
    </Animated.View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 60,
    marginBottom: 20,
  },
  bigText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: 2,
    marginHorizontal: 4,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    fontFamily: 'cursive',
  },
  cow: {
    width: 54,
    height: 70,
    marginHorizontal: 6,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: colors.accent,
    fontWeight: '500',
    marginTop: 22,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  image: {
    width: width * 0.45,
    height: width * 0.55,
    marginBottom: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  floatingDrops: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -1,
  },
});

export default  SplashScreen;