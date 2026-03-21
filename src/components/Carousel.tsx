import { StyleSheet, View } from 'react-native';
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import GestureScrollView from './GestureScrollView';
import { ICarouselInstance, TCarouselProps } from '../types';
import ItemRender from './ItemRender';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import {
  buildResolvedCarouselProps,
  useAutoPlay,
  useCarouselController,
  useCarouselViewportMeasure,
  useInitProps,
  useOnProgressChange,
  useSyncInitWithData,
} from '../hook';
import { CTX } from '../store';
import { CAROUSEL_BUFFER_SIZE } from '../constant';

type CarouselInnerProps = TCarouselProps & { viewportWidth: number };

const CarouselInner = React.forwardRef<ICarouselInstance, CarouselInnerProps>(
  ({ viewportWidth, ...rawProps }, ref) => {
    const props = useInitProps(
      buildResolvedCarouselProps(rawProps, viewportWidth),
    );
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
      loop
        ? -size * CAROUSEL_BUFFER_SIZE + scrollOffsetAdjustment
        : scrollOffsetAdjustment,
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

    const { start: startAutoPlay, pause: pauseAutoPlay } = useAutoPlay({
      autoPlay,
      autoPlayInterval,
      carouselController,
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
      [currentIndex.value, next, pauseAutoPlay, prev, progressValue, scrollTo],
    );

    const onScrollCarouselEnd = React.useCallback(() => {
      if (onScrollEnd) {
        onScrollEnd(currentIndex.value);
      }
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
      <CTX.Provider value={{ props }}>
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
            scrollOffsetAdjustment={scrollOffsetAdjustment}
            itemStyle={{
              width: size,
            }}
          />
        </GestureScrollView>
        {renderFooter && renderFooter()}
      </CTX.Provider>
    );
  },
);

const Carousel = React.forwardRef<ICarouselInstance, TCarouselProps>(
  (_props, ref) => {
    const { layoutWidth, onViewportLayout, wrapperRef } =
      useCarouselViewportMeasure();

    return (
      <GestureHandlerRootView style={styles.gestureRoot}>
        <View
          ref={wrapperRef}
          style={styles.wrapper}
          onLayout={onViewportLayout}>
          {layoutWidth > 0 ? (
            <CarouselInner ref={ref} {..._props} viewportWidth={layoutWidth} />
          ) : null}
        </View>
      </GestureHandlerRootView>
    );
  },
);

export default Carousel as <T>(
  props: React.PropsWithChildren<TCarouselProps<T>>,
) => React.ReactElement;

const styles = StyleSheet.create({
  gestureRoot: {
    width: '100%',
  },
  wrapper: {
    flexDirection: 'column',
    width: '100%',
  },
  container: {
    flexDirection: 'row',
  },
});
