import { StyleProp, ViewStyle } from 'react-native';
import React from 'react';
import {
  Gesture,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { CTX } from '../store';
import { useCarouselController } from '../hook';

interface Props {
  children: React.ReactNode;
  transitionX: SharedValue<number>;
  currentIndex: SharedValue<number>;
  style?: StyleProp<ViewStyle>;
  loop?: boolean;
  onScrollStart: () => void;
  onScrollEnd: () => void;
  onTouchBegin: () => void;
  onTouchEnd: () => void;
  carouselController: ReturnType<typeof useCarouselController>;
}

const GestureScrollView = (props: Props) => {
  const {
    props: {
      dataLength,
      size,
      velocityThreshold,
      scrollOffsetAdjustment,
    },
  } = React.useContext(CTX);

  const {
    transitionX,
    currentIndex,
    style,
    onScrollStart,
    onScrollEnd,
    onTouchBegin,
    onTouchEnd,
    carouselController,
    children,
  } = props;

  const {
    next: scrollNext,
    prev: scrollPrev,
    scrollTo: scrollToIndex,
  } = carouselController;

  const gesture = Gesture.Pan()
    .onChange(e => {
      const { translationX } = e;
      const nextX =
        currentIndex.value * -size +
        translationX +
        scrollOffsetAdjustment;

      const maxOffsetX = (dataLength - 1) * size;

      // // Block user from scrolling past the first item

      if (nextX > 0) {
        return;
      }

      // Block user from scrolling past the last item
      if (nextX < -maxOffsetX) {
        return;
      }

      transitionX.value = nextX;
    })
    .onFinalize(e => {
      const { translationX, velocityX } = e;
      const draggedDistance = translationX;

      const shouldChangeIndex =
        Math.abs(draggedDistance) > size / 2.5 ||
        Math.abs(velocityX) > velocityThreshold;

      const isLastIndex = currentIndex.value + 1 < dataLength;

      if (shouldChangeIndex) {
        if (draggedDistance < 0 && isLastIndex) {
          scrollNext();
        } else if (draggedDistance > 0) {
          scrollPrev();
        } else {
          scrollToIndex({
            animated: true,
            index: currentIndex.value,
          });
        }
      } else {
        scrollToIndex({ animated: true, index: currentIndex.value });
      }
    });

  gesture
    .onStart(() => {
      'worklet';
      onScrollStart && runOnJS(onScrollStart)();
    })
    .onEnd(() => {
      'worklet';
      onScrollEnd && runOnJS(onScrollEnd)();
    });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: transitionX.value }],
    };
  }, [transitionX.value]);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[style, animatedStyle]}
        onTouchStart={onTouchBegin}
        onTouchEnd={onTouchEnd}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

export default GestureScrollView;
