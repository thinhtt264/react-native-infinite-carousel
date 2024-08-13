import {
  SharedValue,
  WithSpringConfig,
  WithTimingConfig,
} from 'react-native-reanimated';

export interface WithSpringAnimation {
  type: 'spring';
  config: WithSpringConfig;
}

export interface WithTimingAnimation {
  type: 'timing';
  config: WithTimingConfig;
}

export type WithAnimation = WithSpringAnimation | WithTimingAnimation;

export interface TCarouselProps<T = any> {
  ref?: React.Ref<ICarouselInstance>;
  data: Array<T>;
  renderItem: CarouselRenderItem<T>;
  itemSize?: number;
  width?: number;
  height?: number;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  autoPlayReverse?: boolean;
  withAnimation?: WithAnimation;
  loop?: boolean;
  scrollAnimationDuration?: number;
  /**
   * On scroll start
   */
  onScrollStart?: () => void;
  /**
   * On scroll end
   */
  onScrollEnd?: (index: number) => void;

  /**
   * Velocity threshold
   */
  velocityThreshold?: number;
  /**
   * Scroll offset adjustment
   */
  scrollOffsetAdjustment?: number;

  /**
   * On progress change
   */
  onProgressChange?:
    | ((offsetProgress: number, index: number) => void)
    | SharedValue<number>;
}

export interface ICarouselInstance {
  /**
   * Scroll to previous item, it takes one optional argument (count),
   * which allows you to specify how many items to cross
   */
  prev: (opts?: Omit<TCarouselActionOptions, 'index'>) => void;
  /**
   * Scroll to next item, it takes one optional argument (count),
   * which allows you to specify how many items to cross
   */
  next: (opts?: Omit<TCarouselActionOptions, 'index'>) => void;
  /**
   * Get current item index
   */
  getCurrentIndex: () => number;
  /**
   * Use value to scroll to a position where relative to the current position,
   * scrollTo({count: -2}) is equivalent to prev(2), scrollTo({count: 2}) is equivalent to next(2)
   */
  scrollTo: (opts?: TCarouselActionOptions) => void;
}

export interface CarouselRenderItemInfo<ItemT> {
  item: ItemT;
  index: number;
  animationValue: SharedValue<number>;
}

export type CarouselRenderItem<ItemT> = (
  info: CarouselRenderItemInfo<ItemT>,
) => React.ReactElement;

export interface TCarouselActionOptions {
  index?: number;
  animated?: boolean;
  offsetAdjust?: number; // offset Adjustment
  onFinished?: () => void;
  isDragging?: boolean;
}
