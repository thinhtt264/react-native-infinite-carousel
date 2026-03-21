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
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { CarouselRenderItemInfo } from './src/types';
import CarouselLine from './CarouselLine';
const CARD_WIDTH = 240;

interface RenderItemProps {
  item: string;
  index: number;
  animationValue: SharedValue<number>;
  scrollAdjust: number;
}

const RenderItem = React.memo(
  ({ item, index, animationValue: offsetX, scrollAdjust }: RenderItemProps) => {
    const animStyleBanner = useAnimatedStyle(() => {
      const scrollProgress = Math.abs(offsetX.value - scrollAdjust);
      const inputRange = [
        (index - 1) * CARD_WIDTH,
        index * CARD_WIDTH,
        (index + 1) * CARD_WIDTH,
      ];
      const scale = interpolate(
        scrollProgress,
        inputRange,
        [0.86, 1, 0.86],
        Extrapolation.CLAMP,
      );

      const translateX = interpolate(
        scrollProgress,
        inputRange,
        [-4, 0, 4],
        Extrapolation.CLAMP,
      );

      return {
        transform: [{ scale }, { translateX }],
      };
    });

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
    ({
      item,
      index,
      animationValue,
      scrollOffsetAdjustment: adj,
    }: CarouselRenderItemInfo<string>) => (
      <RenderItem
        item={item}
        index={index}
        animationValue={animationValue}
        scrollAdjust={adj}
      />
    ),
    [],
  );

  return (
    <Carousel
      data={list}
      renderItem={renderItem}
      itemSize={CARD_WIDTH}
      loop={true}
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
  return (
    <View style={{ flex: 1, marginHorizontal: 16, justifyContent: 'center' }}>
      <CarouselComponent />
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  box: {
    width: CARD_WIDTH,
    height: 340,
    alignSelf: 'center',
    borderRadius: 16,
  },
});
