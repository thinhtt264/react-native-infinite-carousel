/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Carousel from './src';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

const CARD_WIDTH = 360;

const RenderItem = React.memo(
  ({
    item,
    animationValue: scrollX,
    index,
  }: {
    item: string;
    index: number;
    animationValue: SharedValue<number>;
  }) => {
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
    }, [scrollX.value]);

    return (
      <Animated.View
        style={[styles.box, { backgroundColor: item }, animStyleBanner]}
      />
    );
  },
  () => true,
);

const list = ['#59B4C3', '#40A2E3', '#FDBF60', '#EFF396', '#9F70FD', '#74E291'];

const CarouselMemo = React.memo(
  () => {
    console.log('render cả memo');

    return (
      <Carousel
        data={list}
        renderItem={({ item, index, animationValue }) => (
          <RenderItem
            item={item}
            index={index}
            animationValue={animationValue}
          />
        )}
        itemSize={CARD_WIDTH}
        loop
        autoPlay
        autoPlayInterval={1500}
      />
    );
  },
  () => true,
);
function App(): React.JSX.Element {
  const [state, setstate] = React.useState(true);
  return (
    <View style={{ flex: 1, marginHorizontal: 16 }}>
      <Text
        style={{
          fontSize: 50,
          marginVertical: 100,
          textAlign: 'center',
        }}
        onPress={() => setstate(prev => !prev)}>
        {'Text state: ' + state.valueOf()}
      </Text>
      <CarouselMemo />
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
