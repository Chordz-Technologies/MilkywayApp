import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ImageSourcePropType,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import colors from '../theme/colors';

// Navigation types
type RootStackParamList = {
  Login: undefined;
};

type SlidesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: SlidesScreenNavigationProp;
};

// Get screen width
const { width } = Dimensions.get('window');

// Slide data type
type Slide = {
  title: string;
  desc: string;
  image: ImageSourcePropType;
};

// Slide content
const slides: Slide[] = [
  {
    title: 'Fresh & Pure Milk',
    desc: 'Sourced daily from trusted local farms, our milk is 100% pure.',
    image: require('../assets/cowSlide.png'),
  },
  {
    title: 'Find Vendors Near You',
    desc: 'Easily discover verified milk vendors in your neighborhood.',
    image: require('../assets/farmerSlide.png'),
  },
  {
    title: 'Fast & Reliable Delivery',
    desc: 'Get fresh milk delivered straight to your doorstep.',
    image: require('../assets/deliverySlide.png'),
  },
];

const Slides: React.FC<Props> = ({ navigation }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [current, setCurrent] = useState<number>(0);

  const handleScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrent(index);
  };

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ flex: 1 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        onMomentumScrollEnd={handleScrollEnd}
      >
        {slides.map((slide) => (
          <View style={styles.slide} key={slide.title}>
             <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.desc}>{slide.desc}</Text>
            <Image source={slide.image} style={styles.image} />

            {slide.title === 'Fast & Reliable Delivery' && (
              <TouchableOpacity
                style={styles.startBtn}
                onPress={() => navigation.replace('Login')}
                accessibilityLabel="Get Started"
                accessibilityRole="button"
              >
                <Text style={styles.startBtnText}>Get Started</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </Animated.ScrollView>

      <View style={styles.dots}>
        {slides.map((_, i) => (
          <Animated.View
            key={`dot-${i}`}
            style={[
              styles.dot,
              {
                backgroundColor:
                current === i ? colors.gray : colors.primaryLight,
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
};

export default Slides;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  slide: {
    width,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginVertical: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: colors.white,
    marginVertical: 14,
  },
  desc: {
    fontSize: 17,
    color: colors.accent,
    textAlign: 'center',
    marginBottom: 30,
  },
  startBtn: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 36,
    marginTop: 24,
  },
  startBtnText: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: 16,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  dot: {
    width: 16,
    height: 6,
    borderRadius: 3,
    margin: 4,
  },
});
