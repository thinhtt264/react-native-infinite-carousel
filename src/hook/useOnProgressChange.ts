import {
  runOnJS,
  SharedValue,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { TCarouselProps } from '../types';
import { calculateOffsetForRealIndex } from '../utils';

export function useOnProgressChange(
  opts: {
    size: number;
    offsetX: SharedValue<number>;
    loop?: boolean;
    scrollOffsetAdjustment?: number;
  } & Pick<TCarouselProps, 'onProgressChange'>,
) {
  const {
    offsetX,
    size,
    onProgressChange,
    loop,
    scrollOffsetAdjustment = 0,
  } = opts;

  useAnimatedReaction(
    () => offsetX.value,
    currentOffset => {
      if (!onProgressChange) return;

      const normalized = loop
        ? Math.abs(currentOffset)
        : Math.abs(currentOffset - scrollOffsetAdjustment);

      const currentIndex = Math.round(normalized / size);

      const progressValue = loop
        ? calculateOffsetForRealIndex(Math.abs(currentOffset), size)
        : normalized;

      if (typeof onProgressChange === 'function') {
        runOnJS(onProgressChange)(progressValue, currentIndex);
      } else {
        onProgressChange.value = progressValue;
      }
    },
    [onProgressChange, scrollOffsetAdjustment, size, loop],
  );
}
