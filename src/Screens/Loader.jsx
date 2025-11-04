import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, Text } from 'react-native';

export default function Loader() {
  const rotateValue = useRef(new Animated.Value(0)).current;
  const [dots, setDots] = useState('');

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotateValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [rotateValue]);

  const spin = rotateValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev.length < 3 ? prev + '.' : ''));
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return (
    <>
      <Animated.View style={[styles.loader, { transform: [{ rotate: spin }] }]} />
      <Text style={styles.text}>Loading {dots}</Text>
    </>

  );
}

const styles = StyleSheet.create({
  loader: {
    width: 50,
    height: 50,
    borderWidth: 5,
    borderColor: '#ddd',
    borderTopColor: '#00f',
    borderRadius: 25,
  },
  text: {
    fontSize: 18
  }
});
