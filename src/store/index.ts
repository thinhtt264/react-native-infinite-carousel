import React from 'react';
import { TInitializeCarouselProps } from '../hook';

export interface IContext {
  props: TInitializeCarouselProps;
}

export const CTX = React.createContext<IContext>({} as IContext);
