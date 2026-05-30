import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useColorScheme } from "react-native";

import { colorsForScheme } from "@/src/lib/designTokens";

/** Backdrop padrão dos bottom sheets: aparece no primeiro snap, some ao fechar. */
export function SheetBackdrop(props: BottomSheetBackdropProps) {
  const scheme = useColorScheme();
  const colors = colorsForScheme(scheme);

  return (
    <BottomSheetBackdrop
      {...props}
      disappearsOnIndex={-1}
      appearsOnIndex={0}
      opacity={1}
      style={[props.style, { backgroundColor: colors.overlayStandard }]}
    />
  );
}

export const renderSheetBackdrop = SheetBackdrop;
