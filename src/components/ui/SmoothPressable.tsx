'use client';

import React, { useRef } from 'react';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';
import { Animated, Easing, Pressable } from 'react-native-web';

interface SmoothPressableProps extends Omit<PressableProps, 'style' | 'children'> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
}

export function SmoothPressable({ children, onPress, disabled, style, wrapperStyle, ...pressableProps }: SmoothPressableProps) {
  const scale = useRef(new Animated.Value(1));
  const fade = useRef(new Animated.Value(1));

  const runPulse = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scale.current, {
          toValue: 1.08,
          duration: 160,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(fade.current, {
          toValue: 0.9,
          duration: 160,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(scale.current, {
          toValue: 1,
          friction: 4,
          tension: 140,
          useNativeDriver: true,
        }),
        Animated.timing(fade.current, {
          toValue: 1,
          duration: 140,
          easing: Easing.inOut(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const handlePress = () => {
    if (disabled) {
      return;
    }
    scale.current.stopAnimation();
    fade.current.stopAnimation();
    runPulse();
    onPress?.();
  };

  return (
    <Animated.View style={[wrapperStyle, { transform: [{ scale: scale.current }], opacity: fade.current }]}>
      <Pressable {...pressableProps} disabled={disabled} onPress={handlePress} style={style}>
        {children}
      </Pressable>
    </Animated.View>
  );
}
