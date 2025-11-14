import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  interpolateColor,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import React from 'react';

interface Props {
  total: number;
  valueAnim: SharedValue<number>;
  colorActive?: string;
  colorInActive?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

type PaginationLineProps = Props & { index: number };

const PaginationLine = ({
  colorActive = 'red',
  index,
  valueAnim,
  colorInActive = 'grey',
}: PaginationLineProps) => {
  let inputRange = [index - 1, index, index + 1];

  const styleDot = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(valueAnim?.value, inputRange, [
      colorInActive,
      colorActive,
      colorInActive,
    ]);

    return {
      backgroundColor,
    };
  }, [valueAnim]);

  return (
    <View style={styles.linInActive} key={index}>
      <Animated.View style={[styles.lineActive, styleDot]} />
    </View>
  );
};
const CarouselLine = (props: Props) => {
  const { total, containerStyle } = props;
  const step: number[] = [];
  for (let i = 0; i < total; i += 1) step.push(i);

  return (
    <View style={[styles.container, containerStyle]}>
      {step.map((_, index) => (
        <PaginationLine key={index} index={index} {...props} />
      ))}
    </View>
  );
};

export default CarouselLine;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  linInActive: {
    marginHorizontal: 2,
    borderRadius: 10,
    height: 5,
    width: 15,
    backgroundColor: 'grey',
  },
  lineActive: {
    borderRadius: 20,
    backgroundColor: 'red',
    flex: 1,
  },
});
