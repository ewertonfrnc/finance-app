import { Repeat } from "lucide-react-native";
import { Text, View, useColorScheme } from "react-native";

import { colorsForScheme } from "@/src/lib/designTokens";

/**
 * Linha discreta exibida na tela de detalhe quando a transação é uma avulsa
 * que nasceu da edição "apenas este" de uma recorrência (tem sourceSeriesId).
 * Dá contexto no momento da decisão (editar/excluir) sem poluir a lista.
 */
export function SeriesOriginNotice() {
  const scheme = useColorScheme();
  const colors = colorsForScheme(scheme);

  return (
    <View className="bg-surface-secondary flex-row items-center gap-2 rounded-xl px-3 py-2.5">
      <Repeat size={14} color={colors.mute} />
      <Text className="text-muted flex-1 text-xs">
        Editado a partir de uma recorrência
      </Text>
    </View>
  );
}
