import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';

// 淡入过渡动画包装器
export default function FadeIn({ children, style, duration = 260, delay = 0 }) {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration, delay, useNativeDriver: true }).start();
  }, []);
  return <Animated.View style={[style, { opacity }]}>{children}</Animated.View>;
}
