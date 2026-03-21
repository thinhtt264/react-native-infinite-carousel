import { StyleProp, View, ViewStyle } from 'react-native';
import React from 'react';
import { CarouselRenderItem } from '../types';
import { SharedValue } from 'react-native-reanimated';

type Props = {
  data: Array<any>;
  renderItem: CarouselRenderItem<any>;
  offsetX: SharedValue<number>;
  scrollOffsetAdjustment: number;
  itemStyle?: StyleProp<ViewStyle>;
};

const ItemRender = (props: Props) => {
  const {
    data,
    renderItem,
    offsetX,
    scrollOffsetAdjustment,
    itemStyle = {},
  } = props;

  return (
    <>
      {data.map((item, index) => {
        return (
          <View key={index} style={itemStyle}>
            {renderItem({
              item,
              index,
              animationValue: offsetX,
              scrollOffsetAdjustment,
            })}
          </View>
        );
      })}
    </>
  );
};

export default ItemRender;
