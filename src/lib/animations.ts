import { useEffect } from "react";
import {
  cancelAnimation,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export const SPRING = { damping: 20, stiffness: 220, mass: 0.8 };

export function useSpinAnimation(enabled: boolean) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (enabled) {
      rotation.value = withRepeat(
        withTiming(360, { duration: 800 }),
        -1,
        false,
      );
    } else {
      cancelAnimation(rotation);
      rotation.value = 0;
    }
    return () => {
      cancelAnimation(rotation);
    };
  }, [enabled, rotation]);

  return useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));
}
