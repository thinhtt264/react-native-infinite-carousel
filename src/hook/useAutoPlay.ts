import * as React from 'react';
import { ICarouselController } from './useCarouselController';

export function useAutoPlay(opts: {
  autoPlay?: boolean;
  autoPlayInterval?: number;
  autoPlayReverse?: boolean;
  carouselController: Omit<ICarouselController, 'currentIndex'>;
}) {
  const { autoPlay = false, autoPlayInterval, carouselController } = opts;

  const { next } = carouselController;
  const timer = React.useRef<ReturnType<typeof setTimeout>>();
  const stopped = React.useRef<boolean>(!autoPlay);

  const play = React.useCallback(() => {
    if (stopped.current) return;
    timer.current && clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      next({ onFinished: play });
    }, autoPlayInterval);
  }, [autoPlayInterval, next]);

  const pause = React.useCallback(() => {
    if (!autoPlay) return;
    timer.current && clearTimeout(timer.current);
    stopped.current = true;
  }, [autoPlay]);

  const start = React.useCallback(() => {
    if (!autoPlay) return;

    stopped.current = false;
    play();
  }, [play, autoPlay]);

  React.useEffect(() => {
    if (autoPlay) start();
    else pause();

    return pause;
  }, [pause, start, autoPlay]);

  return {
    pause,
    start,
  };
}
