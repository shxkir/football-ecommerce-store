'use client';

import React, { useMemo } from 'react';
import type { PressableProps, StyleProp, ViewStyle } from 'react-native';
import { Animated, Easing, Pressable } from 'react-native-web';

interface SmoothPressableProps extends Omit<PressableProps, 'style' | 'children'> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
}

export function SmoothPressable({ children, onPress, disabled, style, wrapperStyle, ...pressableProps }: SmoothPressableProps) {
  const scale = useMemo(() => new Animated.Value(1), []);
  const fade = useMemo(() => new Animated.Value(1), []);

  const runPulse = () => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scale, {
          toValue: 1.08,
          duration: 160,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(fade, {
          toValue: 0.9,
          duration: 160,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.spring(scale, {
          toValue: 1,
          friction: 4,
          tension: 140,
          useNativeDriver: true,
        }),
        Animated.timing(fade, {
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
    scale.stopAnimation();
    fade.stopAnimation();
    runPulse();
    onPress?.();
  };

  return (
    <Animated.View style={[wrapperStyle, { transform: [{ scale }], opacity: fade }]}>
      <Pressable {...pressableProps} disabled={disabled} onPress={handlePress} style={style}>
        {children}
      </Pressable>
    </Animated.View>
  );
}
