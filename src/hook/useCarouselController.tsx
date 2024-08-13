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
import { INITIAL_INDEX } from '../constant';

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

  const finalLoop = originalData.length > 1 ? loop : false;
  const finishedAnimtion = useSharedValue(false);

  const onScrollEnd = React.useCallback(() => {
    options.onScrollEnd?.();
  }, [options]);

  const onScrollStart = React.useCallback(() => {
    options.onScrollStart?.();
  }, [options]);

  const getRealLastItemIndex = React.useCallback(() => {
    'worklet';
    return originalData.length + INITIAL_INDEX;
  }, [originalData]);

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
    () => {
      return { finished: finishedAnimtion.value, index: currentIndex.value };
    },
    ({ finished, index }) => {
      if (finalLoop && finished) {
        if (index >= getRealLastItemIndex()) {
          currentIndex.value = INITIAL_INDEX;
          handlerOffset.value = -size * INITIAL_INDEX;
        } else if (index <= 1) {
          currentIndex.value = getRealLastItemIndex() - 1;
          handlerOffset.value = -size * (getRealLastItemIndex() - 1);
        }
      }
    },
    [finalLoop],
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

      const nextIndex = finalLoop
        ? currentIndex.value + 1
        : (currentIndex.value + 1) % originalData.length;

      const targetOffset = -nextIndex * size + offsetAdjust;

      if (animated) {
        handlerOffset.value = scrollWithTiming(targetOffset, onFinished);
      } else {
        handlerOffset.value = targetOffset;
        onFinished && runOnJS(onFinished)();
      }

      currentIndex.value = nextIndex;
    },
    [currentIndex, handlerOffset, scrollWithTiming, size],
  );

  const prev = React.useCallback(
    (opts: TCarouselActionOptions = {}) => {
      'worklet';
      const {
        animated = true,
        offsetAdjust = scrollOffsetAdjustment,
        onFinished,
      } = opts;
      if (currentIndex.value === 0 && handlerOffset.value >= 0) return;
      const prevIndex = Math.max(0, currentIndex.value - 1);
      const targetOffset = -prevIndex * size + offsetAdjust;

      if (animated) {
        handlerOffset.value = scrollWithTiming(targetOffset);
      } else {
        handlerOffset.value = targetOffset;
        onFinished && runOnJS(onFinished)();
      }
      currentIndex.value = prevIndex;
    },
    [currentIndex, handlerOffset, scrollWithTiming, size],
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
      const targetIndex = Math.max(0, Math.min(index, getRealLastItemIndex())); // limit 0 and last index
      const targetOffset = -targetIndex * size + offsetAdjust;

      const finalOffset = targetIndex ? targetOffset : 0; //block user from scrolling past the first item

      if (animated) {
        currentIndex.value = targetIndex;
        handlerOffset.value = scrollWithTiming(finalOffset, onFinished);
      } else {
        handlerOffset.value = finalOffset;
        currentIndex.value = targetIndex;
        onFinished && runOnJS(onFinished)();
      }
    },
    [currentIndex, getRealLastItemIndex, handlerOffset, scrollWithTiming, size],
  );

  return {
    next,
    prev,
    scrollTo,
  };
};
