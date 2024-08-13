import { INITIAL_INDEX } from '../constant';

export function rotateAndDuplicate(
  arr: Array<any>,
  isFullSize: boolean,
): Array<any> {
  if (arr.length < 2) {
    return arr;
  }

  const elementsToAdd = isFullSize ? 1 : 2;

  const lastElements = arr.slice(-elementsToAdd);
  const firstElements = arr.slice(0, elementsToAdd);

  return [...lastElements, ...arr, ...firstElements];
}

export function calculateOffsetForRealIndex(offsetX: number, size: number) {
  'worklet';
  const realIndex = offsetX / size - INITIAL_INDEX;
  return realIndex * size;
}
