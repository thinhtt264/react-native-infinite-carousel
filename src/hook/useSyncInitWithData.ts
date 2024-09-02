import { SharedValue, useAnimatedReaction } from 'react-native-reanimated';
import { TCarouselProps } from '../types';
import { CAROUSEL_BUFFER_SIZE } from '../constant';

interface IProps {
  originalData: TCarouselProps['data'];
  data: TCarouselProps['data'];
  scrollX: SharedValue<number>;
  currentIndex: SharedValue<number>;
  size: number;
}
export function useSyncInitWithData(props: IProps) {
  const { originalData, data, scrollX, currentIndex, size } = props;
  useAnimatedReaction(
    () => {
      return {
        original: originalData,
        updated: data,
      };
    },
    ({ original, updated }) => {
      const totalLength = original.length + CAROUSEL_BUFFER_SIZE * 2;
      if (original.length === 1) {
        scrollX.value = 0;
        currentIndex.value = 0;
      } else if (updated.length === totalLength) {
        const initOffest = -size * CAROUSEL_BUFFER_SIZE;
        scrollX.value = initOffest;
        currentIndex.value = CAROUSEL_BUFFER_SIZE;
      }
    },
  );
}
