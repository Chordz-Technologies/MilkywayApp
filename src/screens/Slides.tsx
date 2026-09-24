import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Animated, Image, ScrollView, NativeScrollEvent, NativeSyntheticEvent, ImageSourcePropType, } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import colors from '../theme/colors';
import SafeAreaWrapper from '../styles/SafeAreaWrapper';
import { useTranslation } from '../i18n/LanguageProvider';
import LanguageSwitcher from '../components/LanguageSwitcher';

type RootStackParamList = { TermsConditions: undefined; };
type SlidesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TermsConditions'>;
type Props = { navigation: SlidesScreenNavigationProp; };

const { width } = Dimensions.get('window');

type Slide = {
  id: 'fresh' | 'vendors' | 'delivery';
  titleKey: string;
  descKey: string;
  image: ImageSourcePropType;
};

const slides: Slide[] = [
  {
    id: 'fresh',
    titleKey: 'slides.freshTitle',
    descKey: 'slides.freshDesc',
    image: require('../assets/cowSlide.png'),
  },
  {
    id: 'vendors',
    titleKey: 'slides.vendorsTitle',
    descKey: 'slides.vendorsDesc',
    image: require('../assets/farmerSlide.png'),
  },
  {
    id: 'delivery',
    titleKey: 'slides.deliveryTitle',
    descKey: 'slides.deliveryDesc',
    image: require('../assets/deliverySlide.png'),
  },
];

const Slides: React.FC<Props> = ({ navigation }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollRef = useRef<ScrollView>(null);
  const [current, setCurrent] = useState<number>(0);
  const { t } = useTranslation();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => {
        // Stop automatic scrolling after the last slide
        if (prev >= slides.length - 1) {
          clearInterval(interval);
          return prev;
        }

        const nextIndex = prev + 1;

        scrollRef.current?.scrollTo({
          x: nextIndex * width,
          animated: true,
        });

        return nextIndex;
      });
    }, 3000); // 3 seconds per slide

    return () => clearInterval(interval);
  }, []);

  const handleScrollEnd = (
    e: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    const index = Math.round(
      e.nativeEvent.contentOffset.x / width,
    );

    setCurrent(index);
  };

  const handleGetStarted = () => {
    navigation.navigate('TermsConditions');
  };

  return (
    <SafeAreaWrapper>
      <View style={styles.container}>
        <View style={styles.languageRow}>
          <LanguageSwitcher />
        </View>

        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1 }}
          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: {
                    x: scrollX,
                  },
                },
              },
            ],
            {
              useNativeDriver: false,
            },
          )}
          scrollEventThrottle={16}
          onMomentumScrollEnd={handleScrollEnd}
        >
          {slides.map((slide) => (
            <View style={styles.slide} key={slide.id}>

              <Text style={styles.title}>
                {t(slide.titleKey)}
              </Text>

              <Text style={styles.desc}>
                {t(slide.descKey)}
              </Text>

              <Image
                source={slide.image}
                style={styles.image}
              />

              {slide.id === 'delivery' && (
                <TouchableOpacity
                  style={styles.startBtn}
                  onPress={handleGetStarted}
                  activeOpacity={0.8}
                >
                  <Text style={styles.startBtnText}>
                    {t('slides.getStarted')}
                  </Text>
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
                    current === i
                      ? colors.gray
                      : colors.primaryLight,
                },
              ]}
            />
          ))}
        </View>
      </View>
    </SafeAreaWrapper>
  );
};

export default Slides;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, },
  languageRow: { position: 'absolute', top: 20, right: 20, zIndex: 10, elevation: 10, },
  slide: { width, flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, },
  image: { width: 300, height: 300, resizeMode: 'contain', marginVertical: 40, },
  title: { fontSize: 26, fontWeight: 'bold', color: colors.white, marginVertical: 14, textAlign: 'center', },
  desc: { fontSize: 17, color: colors.accent, textAlign: 'center', marginBottom: 30, },
  startBtn: { backgroundColor: colors.white, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 36, marginTop: 24, },
  startBtnText: { color: colors.black, fontWeight: 'bold', fontSize: 16, },
  dots: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16, },
  dot: { width: 16, height: 6, borderRadius: 3, margin: 4, },
});