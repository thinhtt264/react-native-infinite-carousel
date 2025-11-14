# React Native Infinite Carousel

A simple, lightweight infinite carousel implementation for React Native. Built with React Native Reanimated and Gesture Handler for smooth performance.

## 📹 Demo

https://github.com/user-attachments/assets/1800213c-7db3-429d-94c6-6f22324fd701

## 📋 Props

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `data` | `Array<T>` | ✅ Yes | - | Data array to display in carousel |
| `renderItem` | `(info: CarouselRenderItemInfo<T>) => React.ReactElement` | ✅ Yes | - | Function to render each item with `item`, `index`, and `animationValue` |
| `itemSize` | `number` | ❌ No | `SCREEN_WIDTH` | Width of each carousel item |
| `width` | `number` | ❌ No | - | Carousel container width |
| `height` | `number` | ❌ No | - | Carousel container height |
| `autoPlay` | `boolean` | ❌ No | `false` | Enable automatic slide transition (requires `loop` and >1 item) |
| `autoPlayInterval` | `number` | ❌ No | `3000` | Interval in milliseconds between auto transitions |
| `loop` | `boolean` | ❌ No | `false` | Enable infinite loop mode (requires >1 item) |
| `scrollAnimationDuration` | `number` | ❌ No | - | Scroll animation duration in milliseconds |
| `onScrollStart` | `() => void` | ❌ No | - | Callback when scrolling starts |
| `onScrollEnd` | `(index: number) => void` | ❌ No | - | Callback when scrolling ends with current index |
| `velocityThreshold` | `number` | ❌ No | `16` | Velocity threshold for snap to next slide on fast swipe |
| `scrollOffsetAdjustment` | `number` | ❌ No | `0` | Offset adjustment for scroll positioning |
| `onProgressChange` | `((offsetProgress: number, index: number) => void) \| SharedValue<number>` | ❌ No | - | Track scroll progress via callback or SharedValue |
| `renderFooter` | `() => React.ReactElement \| null` | ❌ No | - | Render footer component below carousel |
| `ref` | `React.Ref<ICarouselInstance>` | ❌ No | - | Ref to access carousel control methods |

### Carousel Instance Methods

When using `ref`, you can access the following methods:

| Method | Parameters | Description |
|--------|------------|-------------|
| `prev` | `(opts?: Omit<TCarouselActionOptions, 'index'>)` | Navigate to previous slide (use `count` to skip multiple) |
| `next` | `(opts?: Omit<TCarouselActionOptions, 'index'>)` | Navigate to next slide (use `count` to skip multiple) |
| `scrollTo` | `(opts?: TCarouselActionOptions)` | Scroll to specific `index` or relative `count` from current position |
| `getCurrentIndex` | `()` | Get current slide index |

## 📦 Dependencies

- `react-native-reanimated`: ^3.9.0
- `react-native-gesture-handler`: ^2.16.2

<div align="center">
Made with ❤️ by Thinh
</div>