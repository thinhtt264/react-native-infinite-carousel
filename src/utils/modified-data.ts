import { CAROUSEL_BUFFER_SIZE } from '../constant';

export function rotateAndDuplicate(arr: Array<any>): Array<any> {
  if (arr.length < 2) {
    return arr;
  }

  const elementsToAdd = CAROUSEL_BUFFER_SIZE;

  const lastElements = arr.slice(-elementsToAdd);
  const firstElements = arr.slice(0, elementsToAdd);

  return [...lastElements, ...arr, ...firstElements];
}

export function calculateOffsetForRealIndex(offsetX: number, size: number) {
  'worklet';
  const realIndex = offsetX / size - CAROUSEL_BUFFER_SIZE;
  return realIndex * size;
}
