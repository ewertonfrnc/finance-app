import { useCallback, useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import { Gesture, type GestureType } from "react-native-gesture-handler";
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { SPRING } from "@/src/lib/animations";
const EXIT_ANIMATION = { duration: 180 };
const SWIPE_VELOCITY = 650;

interface UseHorizontalSwipeOptions {
  resetKey: number | string;
  onSwipePrev: () => void;
  onSwipeNext: () => void;
  externalGestureToFail?: GestureType;
}

export function useHorizontalSwipe({
  resetKey,
  onSwipePrev,
  onSwipeNext,
  externalGestureToFail,
}: UseHorizontalSwipeOptions) {
  const { width } = useWindowDimensions();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const translateX = useSharedValue(0);
  const isNavigating = useSharedValue(false);
  const screenWidth = Math.max(width, 1);
  const swipeDistance = Math.min(screenWidth * 0.22, 88);
  const maxDrag = screenWidth * 0.35;

  useEffect(() => {
    translateX.value = 0;
    isNavigating.value = false;
    setIsTransitioning(false);
  }, [isNavigating, resetKey, translateX]);

  const startTransition = useCallback(
    (action: () => void) => {
      if (isTransitioning) return false;
      setIsTransitioning(true);
      action();
      return true;
    },
    [isTransitioning],
  );

  const swipeGesture = Gesture.Pan()
    .enabled(!isTransitioning)
    .activeOffsetX([-16, 16])
    .failOffsetY([-12, 12])
    .onUpdate((event) => {
      if (isNavigating.value) return;
      translateX.value = Math.max(
        -maxDrag,
        Math.min(maxDrag, event.translationX),
      );
    })
    .onEnd((event) => {
      if (isNavigating.value) return;

      const shouldGoNext =
        event.translationX <= -swipeDistance ||
        event.velocityX <= -SWIPE_VELOCITY;
      const shouldGoPrev =
        event.translationX >= swipeDistance ||
        event.velocityX >= SWIPE_VELOCITY;

      if (shouldGoNext) {
        isNavigating.value = true;
        scheduleOnRN(setIsTransitioning, true);
        translateX.value = withTiming(
          -screenWidth,
          EXIT_ANIMATION,
          (finished) => {
            if (finished) {
              scheduleOnRN(onSwipeNext);
            } else {
              isNavigating.value = false;
              scheduleOnRN(setIsTransitioning, false);
            }
          },
        );
        return;
      }

      if (shouldGoPrev) {
        isNavigating.value = true;
        scheduleOnRN(setIsTransitioning, true);
        translateX.value = withTiming(
          screenWidth,
          EXIT_ANIMATION,
          (finished) => {
            if (finished) {
              scheduleOnRN(onSwipePrev);
            } else {
              isNavigating.value = false;
              scheduleOnRN(setIsTransitioning, false);
            }
          },
        );
        return;
      }

      translateX.value = withSpring(0, SPRING);
    })
    .onFinalize(() => {
      if (!isNavigating.value && translateX.value !== 0) {
        translateX.value = withSpring(0, SPRING);
      }
    });

  if (externalGestureToFail) {
    swipeGesture.requireExternalGestureToFail(externalGestureToFail);
  }

  const animatedContentStyle = useAnimatedStyle(() => {
    const distance = Math.abs(translateX.value);

    return {
      opacity: interpolate(distance, [0, maxDrag], [1, 0.9]),
      transform: [
        { translateX: translateX.value },
        { scale: interpolate(distance, [0, maxDrag], [1, 0.985]) },
      ],
    };
  });

  const pointerEvents: "auto" | "none" = isTransitioning ? "none" : "auto";

  return {
    animatedContentStyle,
    isTransitioning,
    pointerEvents,
    startTransition,
    swipeGesture,
  };
}
