import { StyleProp, View, ViewStyle } from 'react-native';
import React from 'react';
import { CarouselRenderItem } from '../types';
import { SharedValue, useDerivedValue } from 'react-native-reanimated';

type Props = {
  data: Array<any>;
  renderItem: CarouselRenderItem<any>;
  offsetX: SharedValue<number>;
  itemStyle?: StyleProp<ViewStyle>;
};

const ItemRender = (props: Props) => {
  const { data, renderItem, offsetX, itemStyle = {} } = props;
  // caculating new value from offetX
  const animationValue = useDerivedValue(
    () => Math.abs(offsetX.value),
    [offsetX],
  );

  return (
    <>
      {data.map((item, index) => {
        return (
          <View key={index} style={itemStyle}>
            {renderItem({
              item,
              index,
              animationValue,
            })}
          </View>
        );
      })}
    </>
  );
};

export default ItemRender;
