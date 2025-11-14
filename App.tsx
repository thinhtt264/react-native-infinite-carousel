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
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { CarouselRenderItemInfo } from './src/types';
import CarouselLine from './CarouselLine';

const CARD_WIDTH = 360;

interface RenderItemProps {
  item: string;
  index: number;
  animationValue: SharedValue<number>;
}

const RenderItem = React.memo(
  ({ item, index, animationValue: scrollX }: RenderItemProps) => {
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
);

const list = ['#59B4C3', '#40A2E3', '#FDBF60', '#EFF396', '#9F70FD', '#74E291'];

const CarouselComponent = () => {
  const scrollX = useSharedValue(0);

  const currentIndex = useDerivedValue(() => {
    return scrollX.value / CARD_WIDTH;
  }, [scrollX]);

  const renderItem = React.useCallback(
    ({ item, index, animationValue }: CarouselRenderItemInfo<string>) => (
      <RenderItem item={item} index={index} animationValue={animationValue} />
    ),
    [],
  );

  return (
    <Carousel
      data={list}
      renderItem={renderItem}
      itemSize={CARD_WIDTH}
      loop
      onProgressChange={scrollX}
      renderFooter={() => (
        <CarouselLine total={list.length} valueAnim={currentIndex} />
      )}
      // autoPlay
      // autoPlayInterval={3000}
    />
  );
};

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
        {'Forced re-render: ' + state.valueOf()}
      </Text>
      <View style={styles.wrapper}>
        <CarouselComponent />
      </View>
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    // borderWidth: 2,
    gap: 10,
  },
  box: {
    width: CARD_WIDTH,
    height: 200,
  },
});
