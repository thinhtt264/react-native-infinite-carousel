/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Carousel from './src';
import Animated, {
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

const CARD_WIDTH = 360;

const RenderItem = ({ item, animationValue: scrollX, index }: any) => {
  const animStyleBanner = useAnimatedStyle(() => {
    const inputRange = [
      (index - 1) * CARD_WIDTH,
      index * CARD_WIDTH,
      (index + 1) * CARD_WIDTH,
    ];
    const scale = interpolate(
      Math.abs(scrollX.value),
      inputRange,
      [0.8, 1, 0.8],
    );

    const translateX = interpolate(
      Math.abs(scrollX.value),
      inputRange,
      [-32, 0, 32],
    );

    const transFormX = {
      transform: [{ scale }, { translateX }],
    };
    return transFormX;
  });

  return (
    <Animated.View
      style={[
        styles.box,
        { backgroundColor: item },
        animStyleBanner,
      ]}></Animated.View>
  );
};

const list = ['#59B4C3', '#40A2E3', '#FDBF60', '#EFF396', '#9F70FD', '#74E291'];
function App(): React.JSX.Element {
  return (
    <View style={{ flex: 1 }}>
      <Carousel
        data={list}
        renderItem={RenderItem}
        itemSize={CARD_WIDTH}
        loop
        autoPlay
        autoPlayInterval={1000}
        scrollOffsetAdjustment={16}
      />
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  box: {
    width: CARD_WIDTH,
    height: 200,
  },
});
