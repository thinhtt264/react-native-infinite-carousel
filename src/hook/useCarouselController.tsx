import React from 'react';
import {
  Easing,
  SharedValue,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';
import {
  TCarouselActionOptions,
  TCarouselProps,
  WithTimingAnimation,
} from '../types';
import { dealWithAnimation } from '../utils';
import { CAROUSEL_BUFFER_SIZE } from '../constant';

export interface ICarouselController {
  prev: (opts?: TCarouselActionOptions) => void;
  next: (opts?: TCarouselActionOptions) => void;
  scrollTo: (opts?: TCarouselActionOptions) => void;
}

interface IOpts {
  loop?: boolean;
  size: number;
  originalData: Array<any>;
  handlerOffset: SharedValue<number>;
  currentIndex: SharedValue<number>;
  withAnimation?: TCarouselProps['withAnimation'];
  duration?: number;
  defaultIndex?: number;
  scrollOffsetAdjustment: number;
  onScrollStart?: () => void;
  onScrollEnd?: () => void;
}

export const useCarouselController = (options: IOpts): ICarouselController => {
  const {
    withAnimation,
    duration = 300, //bug animation when duration is undefined or too small
    handlerOffset,
    currentIndex,
    originalData,
    loop,
    size,
    scrollOffsetAdjustment,
  } = options;

  const finishedAnimtion = useSharedValue(false);

  const onScrollEnd = React.useCallback(() => {
    options.onScrollEnd?.();
  }, [options]);

  const onScrollStart = React.useCallback(() => {
    options.onScrollStart?.();
  }, [options]);

  const scrollWithTiming = React.useCallback(
    (toValue: number, onFinished?: () => void) => {
      'worklet';
      finishedAnimtion.value = false;
      const callback = (isFinished: boolean) => {
        'worklet';
        if (isFinished) {
          finishedAnimtion.value = true;
          runOnJS(onScrollEnd)();
          onFinished && runOnJS(onFinished)();
        }
      };

      const defaultWithAnimation: WithTimingAnimation = {
        type: 'timing',
        config: { duration, easing: Easing.inOut(Easing.quad) },
      };

      return dealWithAnimation(withAnimation ?? defaultWithAnimation)(
        toValue,
        callback,
      );
    },
    [duration, finishedAnimtion, onScrollEnd, withAnimation],
  );

  useAnimatedReaction(
    () => ({
      finished: finishedAnimtion.value,
      index: currentIndex.value,
    }),
    ({ finished, index }) => {
      if (!loop || !finished) {
        return;
      }

      const n = originalData.length;
      const b = CAROUSEL_BUFFER_SIZE;
      const adj = scrollOffsetAdjustment;

      // Extended strip: [clone last b][N items][clone first b] → length n + 2b
      if (index >= n + b) {
        // Past end clones → same visual as middle strip
        const target = index - n;
        currentIndex.value = target;
        handlerOffset.value = -target * size + adj;
      } else if (index < b) {
        // In leading clones → map to matching real item
        const target = n + index;
        currentIndex.value = target;
        handlerOffset.value = -target * size + adj;
      }
    },
    [loop, originalData.length, size, scrollOffsetAdjustment],
  );

  const next = React.useCallback(
    (otps: TCarouselActionOptions = {}) => {
      'worklet';
      const {
        animated = true,
        offsetAdjust = scrollOffsetAdjustment,
        onFinished,
        isDragging = false,
      } = otps;
      !isDragging && runOnJS(onScrollStart)?.();

      let nextIndex: number;
      let wrapFromEnd = false;
      if (loop) {
        const lastExtended = originalData.length + 2 * CAROUSEL_BUFFER_SIZE - 1;
        wrapFromEnd = currentIndex.value >= lastExtended;
        nextIndex = wrapFromEnd ? CAROUSEL_BUFFER_SIZE : currentIndex.value + 1;
      } else {
        nextIndex = (currentIndex.value + 1) % originalData.length;
      }

      const targetOffset = -nextIndex * size + offsetAdjust;

      if (wrapFromEnd) {
        currentIndex.value = nextIndex;
        handlerOffset.value = targetOffset;
        onFinished && runOnJS(onFinished)();
        runOnJS(onScrollEnd)();
      } else if (animated) {
        handlerOffset.value = scrollWithTiming(targetOffset, onFinished);
        currentIndex.value = nextIndex;
      } else {
        handlerOffset.value = targetOffset;
        currentIndex.value = nextIndex;
        onFinished && runOnJS(onFinished)();
      }
    },
    [
      currentIndex,
      handlerOffset,
      scrollWithTiming,
      size,
      scrollOffsetAdjustment,
      loop,
      originalData.length,
    ],
  );

  const prev = React.useCallback(
    (opts: TCarouselActionOptions = {}) => {
      'worklet';
      const {
        animated = true,
        offsetAdjust = scrollOffsetAdjustment,
        onFinished,
      } = opts;
      if (
        !loop &&
        currentIndex.value === 0 &&
        handlerOffset.value >= scrollOffsetAdjustment
      ) {
        return;
      }

      const wrapFromStart = !!(loop && currentIndex.value === 0);

      let prevIndex: number;
      if (wrapFromStart) {
        prevIndex = CAROUSEL_BUFFER_SIZE + originalData.length - 1;
      } else {
        prevIndex = Math.max(0, currentIndex.value - 1);
      }
      const targetOffset = -prevIndex * size + offsetAdjust;

      if (wrapFromStart) {
        currentIndex.value = prevIndex;
        handlerOffset.value = targetOffset;
        onFinished && runOnJS(onFinished)();
        runOnJS(onScrollEnd)();
      } else if (animated) {
        handlerOffset.value = scrollWithTiming(targetOffset);
        currentIndex.value = prevIndex;
      } else {
        handlerOffset.value = targetOffset;
        currentIndex.value = prevIndex;
        onFinished && runOnJS(onFinished)();
      }
    },
    [
      currentIndex,
      handlerOffset,
      scrollWithTiming,
      size,
      scrollOffsetAdjustment,
      loop,
      originalData.length,
    ],
  );

  const scrollTo = React.useCallback(
    (opts: TCarouselActionOptions = {}) => {
      'worklet';
      const {
        index,
        animated = false,
        offsetAdjust = scrollOffsetAdjustment,
        onFinished,
      } = opts;
      if (typeof index !== 'number' && !index) {
        return;
      }
      const maxIndex = loop
        ? originalData.length + 2 * CAROUSEL_BUFFER_SIZE - 1
        : originalData.length - 1;
      const targetIndex = Math.max(0, Math.min(index, maxIndex));
      const targetOffset = -targetIndex * size + offsetAdjust;
      const finalOffset = targetOffset;

      if (animated) {
        currentIndex.value = targetIndex;
        handlerOffset.value = scrollWithTiming(finalOffset, onFinished);
      } else {
        handlerOffset.value = finalOffset;
        currentIndex.value = targetIndex;
        onFinished && runOnJS(onFinished)();
      }
    },
    [
      currentIndex,
      handlerOffset,
      scrollWithTiming,
      size,
      scrollOffsetAdjustment,
      loop,
      originalData.length,
    ],
  );

  return {
    next,
    prev,
    scrollTo,
  };
};
