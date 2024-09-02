import React from 'react';
import { TCarouselProps } from '../types';
import { rotateAndDuplicate } from '../utils';
import { SCREEN_WIDTH } from '../constant';

export interface TInitializeCarouselProps extends TCarouselProps {
  data: TCarouselProps['data'];
  size: number;
  originalData: TCarouselProps['data'];
  dataLength: number;
  velocityThreshold: number;
  scrollOffsetAdjustment: number;
}
export function useInitProps(props: TCarouselProps): TInitializeCarouselProps {
  const {
    data: originalData,
    itemSize: size = SCREEN_WIDTH,
    autoPlay = false,
    autoPlayInterval = 3000,
    autoPlayReverse = false,
    loop,
    velocityThreshold = 16,
    scrollOffsetAdjustment = 0,
  } = props;
  const finalLoop = loop && originalData.length > 1;

  const data = React.useMemo(() => {
    return loop ? rotateAndDuplicate(originalData) : originalData;
  }, [loop, originalData]);

  return {
    ...props,
    data,
    size,
    originalData,
    dataLength: data.length,
    autoPlay: finalLoop && autoPlay,
    autoPlayInterval,
    autoPlayReverse,
    velocityThreshold,
    scrollOffsetAdjustment,
    loop: finalLoop,
  };
}
