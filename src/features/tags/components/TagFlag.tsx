import Svg, { Polygon } from "react-native-svg";

import { getTagColors } from "../constants";

interface TagFlagProps {
  color: string;
}

export function TagFlag({ color }: TagFlagProps) {
  const colors = getTagColors(color);

  return (
    <Svg width={12} height={16} viewBox="0 0 12 16">
      <Polygon points="0,0 9.36,0 12,8 9.36,16 0,16" fill={colors.dot} />
    </Svg>
  );
}
