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
  } & Pick<TCarouselProps, 'onProgressChange'>,
) {
  const { offsetX, size, onProgressChange, loop } = opts;

  useAnimatedReaction(
    () => offsetX.value,
    currentOffset => {
      if (!onProgressChange) return;

      const currentIndex = Math.abs(Math.round(currentOffset / size));

      const progressValue = loop
        ? calculateOffsetForRealIndex(Math.abs(currentOffset), size)
        : Math.abs(currentOffset);

      if (typeof onProgressChange === 'function') {
        runOnJS(onProgressChange)(progressValue, currentIndex);
      } else {
        onProgressChange.value = progressValue;
      }
    },
    [onProgressChange],
  );
}
