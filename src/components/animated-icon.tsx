import { Image } from 'expo-image';
import * as SplashScreen from 'expo-splash-screen';
import { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import Animated, { Keyframe } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { motion, useTheme } from '@/design-system';
import { useMarkAppReady } from '@/providers/app-ready-provider';

const INITIAL_SCALE_FACTOR = Dimensions.get('screen').height / 90;

export function AnimatedSplashOverlay() {
  const theme = useTheme();
  const markReady = useMarkAppReady();
  const [animate, setAnimate] = useState(false);
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const splashKeyframe = new Keyframe({
    0: {
      transform: [{ scale: 1 }],
      opacity: 1,
    },
    20: {
      opacity: 1,
    },
    70: {
      // Opacity must ease monotonically: an elastic/overshoot curve here
      // sends the value briefly below 0 and back up, which reads as a
      // second flash right as the splash is fading out.
      opacity: 0,
      easing: motion.easing.decelerate,
    },
    100: {
      opacity: 0,
      transform: [{ scale: 1 }],
      easing: motion.easing.decelerate,
    },
  });

  const image = <Image style={styles.image} source={require('@/assets/images/expo-logo.png')} />;

  return animate ? (
    <Animated.View
      entering={splashKeyframe
        .duration(motion.duration.slow)
        .reduceMotion(motion.reduceMotion)
        .withCallback((finished) => {
          'worklet';
          if (finished) {
            scheduleOnRN(setVisible, false);
            scheduleOnRN(markReady);
          }
        })}
      style={[
        styles.splashOverlay,
        { backgroundColor: theme.components.brandArtwork.splashBackground },
      ]}>
      {image}
    </Animated.View>
  ) : (
    <View
      onLayout={() => {
        SplashScreen.hideAsync().finally(() => {
          setAnimate(true);
        });
      }}
      style={[
        styles.splashOverlay,
        { backgroundColor: theme.components.brandArtwork.splashBackground },
      ]}>
      {image}
    </View>
  );
}

const keyframe = new Keyframe({
  0: {
    transform: [{ scale: INITIAL_SCALE_FACTOR }],
  },
  100: {
    transform: [{ scale: 1 }],
    easing: motion.easing.elastic,
  },
});

const logoKeyframe = new Keyframe({
  0: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
  },
  40: {
    transform: [{ scale: 1.3 }],
    opacity: 0,
    easing: motion.easing.elastic,
  },
  100: {
    opacity: 1,
    transform: [{ scale: 1 }],
    easing: motion.easing.elastic,
  },
});

const glowKeyframe = new Keyframe({
  0: {
    transform: [{ rotateZ: '0deg' }],
  },
  100: {
    transform: [{ rotateZ: '7200deg' }],
  },
});

export function AnimatedIcon() {
  const theme = useTheme();

  return (
    <View style={styles.iconContainer}>
      <Animated.View
        entering={glowKeyframe.duration(motion.duration.ambient).reduceMotion(motion.reduceMotion)}
        style={styles.glow}>
        <Image style={styles.glow} source={require('@/assets/images/logo-glow.png')} />
      </Animated.View>

      <Animated.View
        entering={keyframe.duration(motion.duration.slow).reduceMotion(motion.reduceMotion)}
        style={[
          styles.background,
          {
            experimental_backgroundImage: `linear-gradient(180deg, ${theme.components.brandArtwork.gradientStart}, ${theme.components.brandArtwork.gradientEnd})`,
          },
        ]}
      />
      <Animated.View
        style={styles.imageContainer}
        entering={logoKeyframe.duration(motion.duration.slow).reduceMotion(motion.reduceMotion)}>
        <Image style={styles.image} source={require('@/assets/images/expo-logo.png')} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    width: 201,
    height: 201,
    position: 'absolute',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 128,
    height: 128,
    zIndex: 100,
  },
  image: {
    width: 76,
    height: 71,
  },
  background: {
    borderRadius: 40,
    width: 128,
    height: 128,
    position: 'absolute',
  },
  splashOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
});
