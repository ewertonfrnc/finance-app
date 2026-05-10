import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CurrencyText } from "@/src/components/ui/CurrencyText";
import { formatBRL } from "@/src/lib/currency";
import { useOnboardingStore } from "@/src/stores/useOnboardingStore";

const CATEGORY_LABELS: Record<string, string> = {
  comida: "Comida",
  transporte: "Transporte",
  lazer: "Lazer",
  compras: "Compras",
  saude: "Saúde",
};

export default function ResumoScreen() {
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const { categories, daysPerMonth } = useOnboardingStore();

  const totalMensal = Object.values(categories).reduce((sum, v) => sum + v, 0);
  const dailyBudget = Math.floor(totalMensal / daysPerMonth);

  const activeCategories = Object.entries(categories).filter(
    ([, amount]) => amount > 0,
  );

  return (
    <View className="bg-background flex-1 px-6" style={{ paddingTop: top }}>
      <View className="flex-1 pt-10">
        <Text className="text-muted mb-2 text-xs font-medium tracking-widest uppercase">
          Pronto
        </Text>

        <Text className="text-foreground mb-10 text-2xl font-semibold">
          Seu diário:
        </Text>

        {/* Totais */}
        <View className="mb-8 gap-5">
          <View className="flex-row items-center justify-between">
            <Text className="text-muted text-xs font-medium tracking-widest uppercase">
              Total Mensal
            </Text>
            <CurrencyText
              value={totalMensal}
              sign="neutral"
              variant="regular"
            />
          </View>

          <View className="gap-1">
            <View className="flex-row items-baseline gap-2">
              <Text className="text-muted text-xs font-medium tracking-widest uppercase">
                Diário Previsto
              </Text>
              <Text className="text-muted text-xs">÷ {daysPerMonth} dias</Text>
            </View>
            <Text className="text-foreground font-mono-medium text-5xl">
              {formatBRL(dailyBudget)}
            </Text>
          </View>
        </View>

        {/* Separador + lista de categorias */}
        {activeCategories.length > 0 && (
          <View className="gap-3">
            <View className="bg-separator h-px" />

            {activeCategories.map(([slug, amount]) => (
              <View
                key={slug}
                className="flex-row items-center justify-between"
              >
                <Text className="text-foreground text-sm font-medium">
                  {CATEGORY_LABELS[slug] ?? slug}
                </Text>
                <CurrencyText value={amount} sign="neutral" variant="small" />
              </View>
            ))}
          </View>
        )}

        {/* Explicação */}
        <Text className="text-muted mt-8 text-sm leading-relaxed">
          Esse é o número que vai aparecer no velocímetro da sua tela inicial.
          Gastou abaixo? Sobra pro próximo dia. Passou? A gente lança a saída em
          seguida.
        </Text>
      </View>

      <View style={{ paddingBottom: bottom + 16 }}>
        <TouchableOpacity
          activeOpacity={0.85}
          className="bg-foreground items-center rounded-xl py-4"
          onPress={() => router.push("/(onboarding)/cadastro")}
        >
          <Text className="text-background text-base font-semibold">
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
