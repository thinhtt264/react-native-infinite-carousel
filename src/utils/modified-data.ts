export const copyNToEnd = (arr: Array<any>, isFullSize: boolean) => {
  if (arr.length < 2) {
    return arr;
  }

  const firstTwo = arr.slice(0, isFullSize ? 1 : 2);
  return arr.concat(firstTwo);
};
