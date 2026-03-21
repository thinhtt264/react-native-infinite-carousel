import React from 'react';
import { LayoutChangeEvent, useWindowDimensions, View } from 'react-native';
import { TCarouselProps } from '../types';

/**
 * Resolves props using only a measured viewport width (from onLayout / measure).
 * Never uses the window to auto-center — avoids wrong offsets when the carousel is inset.
 */
export function buildResolvedCarouselProps(
  rawProps: TCarouselProps,
  viewportWidth: number,
): TCarouselProps {
  const userItemSize = rawProps.itemSize;
  const explicitAdj = rawProps.scrollOffsetAdjustment;

  const effectiveSize =
    userItemSize !== undefined && userItemSize !== null
      ? userItemSize
      : viewportWidth;

  let effectiveScrollOffsetAdjustment: number;
  if (explicitAdj !== undefined) {
    effectiveScrollOffsetAdjustment = explicitAdj;
  } else if (userItemSize !== undefined && userItemSize !== null) {
    effectiveScrollOffsetAdjustment = Math.max(
      0,
      (viewportWidth - userItemSize) / 2,
    );
  } else {
    effectiveScrollOffsetAdjustment = 0;
  }

  return {
    ...rawProps,
    itemSize: effectiveSize,
    scrollOffsetAdjustment: effectiveScrollOffsetAdjustment,
  };
}

export function useCarouselViewportMeasure() {
  const [layoutWidth, setLayoutWidth] = React.useState(0);
  const wrapperRef = React.useRef<View>(null);
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();

  const commitWidth = React.useCallback((w: number) => {
    if (w > 0) {
      setLayoutWidth(w);
    }
  }, []);

  const onViewportLayout = React.useCallback(
    (e: LayoutChangeEvent) => {
      commitWidth(e.nativeEvent.layout.width);
    },
    [commitWidth],
  );

  React.useEffect(() => {
    const id = requestAnimationFrame(() => {
      const node = wrapperRef.current;
      if (node == null) {
        return;
      }
      node.measure((_x, _y, w) => {
        commitWidth(w);
      });
    });
    return () => cancelAnimationFrame(id);
  }, [windowWidth, windowHeight, commitWidth]);

  return { layoutWidth, onViewportLayout, wrapperRef };
}
