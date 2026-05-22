import { useRef, useState } from "react";
import type { LayoutChangeEvent } from "react-native";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { SPRING } from "@/src/lib/animations";

export function useTabIndicator() {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabLayouts = useRef<{ x: number; width: number }[]>([]);
  const tabInitialized = useRef(false);
  const indicatorX = useSharedValue(0);
  const indicatorW = useSharedValue(0);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
    width: indicatorW.value,
  }));

  function selectTab(index: number) {
    setActiveIndex(index);
    const layout = tabLayouts.current[index];
    if (!layout) return;
    indicatorX.value = withSpring(layout.x, SPRING);
    indicatorW.value = withSpring(layout.width, SPRING);
  }

  function onTabLayout(index: number, e: LayoutChangeEvent) {
    const { x, width } = e.nativeEvent.layout;
    tabLayouts.current[index] = { x, width };
    if (!tabInitialized.current && index === activeIndex) {
      indicatorX.value = x;
      indicatorW.value = width;
      tabInitialized.current = true;
    }
  }

  return { activeIndex, indicatorStyle, selectTab, onTabLayout };
}
