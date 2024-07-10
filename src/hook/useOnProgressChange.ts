import {
  runOnJS,
  SharedValue,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { TCarouselProps } from '../types';

export function useOnProgressChange(
  opts: {
    size: number;
    offsetX: SharedValue<number>;
  } & Pick<TCarouselProps, 'onProgressChange'>,
) {
  const { offsetX, size, onProgressChange } = opts;

  useAnimatedReaction(
    () => offsetX.value,
    _value => {
      if (!onProgressChange) return;

      const index = Math.abs(Math.round(_value / size));
      const value = Math.abs(_value);

      if (typeof onProgressChange === 'function')
        runOnJS(onProgressChange)(value, index);
      else onProgressChange.value = value;
    },
    [onProgressChange],
  );
}
