import { StyleSheet, View } from 'react-native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import GestureScrollView from './GestureScrollView';
import { ICarouselInstance, TCarouselProps } from '../types';
import ItemRender from './ItemRender';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import {
  useAutoPlay,
  useCarouselController,
  useInitProps,
  useOnProgressChange,
  useSyncInitWithData,
} from '../hook';
import { CTX } from '../store';
import { CAROUSEL_BUFFER_SIZE } from '../constant';

const Carousel = React.forwardRef<ICarouselInstance, TCarouselProps>(
  (_props, ref) => {
    const props = useInitProps(_props);
    const {
      data,
      renderItem,
      loop,
      autoPlay,
      autoPlayInterval,
      scrollAnimationDuration,
      size,
      onScrollEnd,
      onScrollStart,
      scrollOffsetAdjustment,
      onProgressChange,
      originalData,
      renderFooter,
    } = props;

    const scrollX = useSharedValue(
      loop ? -size * CAROUSEL_BUFFER_SIZE : scrollOffsetAdjustment,
    );
    const currentIndex = useSharedValue(loop ? CAROUSEL_BUFFER_SIZE : 0);

    useSyncInitWithData({
      originalData,
      data,
      scrollX,
      currentIndex,
      size,
      scrollOffsetAdjustment,
    });

    const carouselController = useCarouselController({
      duration: scrollAnimationDuration,
      handlerOffset: scrollX,
      currentIndex,
      originalData,
      size,
      loop,
      scrollOffsetAdjustment,
      onScrollEnd: () => runOnJS(onScrollCarouselEnd)(),
      onScrollStart: () => !!onScrollStart && runOnJS(onScrollStart)(),
    });

    const { next, prev, scrollTo } = carouselController;

    const progressValue = useOnProgressChange({
      offsetX: scrollX,
      size,
      onProgressChange,
      loop,
      scrollOffsetAdjustment,
    });

    React.useImperativeHandle(
      ref,
      () => ({
        next,
        prev,
        scrollTo,
        progressValue,
        pauseAutoPlay,
        getCurrentIndex: () => currentIndex.value,
      }),
      [currentIndex.value, next, prev, scrollTo],
    );

    const { start: startAutoPlay, pause: pauseAutoPlay } = useAutoPlay({
      autoPlay,
      autoPlayInterval,
      carouselController,
    });

    const onScrollCarouselEnd = React.useCallback(() => {
      //callback 2 times, 1st time is animation end, 2nd time is pangesture end
      if (onScrollEnd) onScrollEnd(currentIndex.value);
    }, [currentIndex.value, onScrollEnd]);

    const scrollViewGestureOnScrollStart = React.useCallback(() => {
      pauseAutoPlay();
      onScrollStart?.();
    }, [onScrollStart, pauseAutoPlay]);

    const scrollViewGestureOnScrollEnd = React.useCallback(() => {
      startAutoPlay();
      onScrollCarouselEnd();
    }, [onScrollCarouselEnd, startAutoPlay]);

    const scrollViewGestureOnTouchBegin = React.useCallback(pauseAutoPlay, [
      pauseAutoPlay,
    ]);

    const scrollViewGestureOnTouchEnd = React.useCallback(startAutoPlay, [
      startAutoPlay,
    ]);

    return (
      <GestureHandlerRootView>
        <CTX.Provider value={{ props }}>
          <View style={styles.wrapper}>
            <GestureScrollView
              transitionX={scrollX}
              currentIndex={currentIndex}
              carouselController={carouselController}
              style={styles.container}
              onScrollStart={scrollViewGestureOnScrollStart}
              onScrollEnd={scrollViewGestureOnScrollEnd}
              onTouchBegin={scrollViewGestureOnTouchBegin}
              onTouchEnd={scrollViewGestureOnTouchEnd}>
              <ItemRender
                data={data}
                renderItem={renderItem}
                offsetX={scrollX}
                itemStyle={{
                  width: size,
                }}
              />
            </GestureScrollView>
            {renderFooter && renderFooter()}
          </View>
        </CTX.Provider>
      </GestureHandlerRootView>
    );
  },
);

export default Carousel as <T>(
  props: React.PropsWithChildren<TCarouselProps<T>>,
) => React.ReactElement;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
  },
  container: {
    flexDirection: 'row',
  },
});
