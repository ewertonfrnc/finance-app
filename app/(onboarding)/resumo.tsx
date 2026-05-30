import { useRouter } from "expo-router";
import { Text, View } from "react-native";

import { CurrencyText } from "@/src/components/ui/CurrencyText";
import { Screen } from "@/src/components/ui/Screen";
import { formatBRL } from "@/src/lib/currency";
import { useOnboardingStore } from "@/src/stores/useOnboardingStore";
import { Button, Separator } from "heroui-native";

const CATEGORY_LABELS: Record<string, string> = {
  comida: "Comida",
  transporte: "Transporte",
  lazer: "Lazer",
  compras: "Compras",
  saude: "Saúde",
};

export default function ResumoScreen() {
  const router = useRouter();
  const { categories, daysPerMonth } = useOnboardingStore();

  const totalMensal = Object.values(categories).reduce((sum, v) => sum + v, 0);
  const dailyBudget = Math.floor(totalMensal / daysPerMonth);

  const activeCategories = Object.entries(categories).filter(
    ([, amount]) => amount > 0,
  );

  return (
    <Screen className="px-6">
      <View className="flex-1 pt-10">
        <Text className="text-muted text-step mb-2 font-semibold tracking-widest uppercase">
          Pronto
        </Text>

        <Text className="text-foreground text-heading mb-10 font-bold">
          Seu diário:
        </Text>

        {/* Totais */}
        <View className="border-separator rounded-xl border p-4">
          <View className="mb-8 gap-5">
            <View className="flex-row items-center justify-between">
              <Text className="text-muted text-label font-semibold tracking-widest uppercase">
                Total Mensal
              </Text>
              <CurrencyText
                value={totalMensal}
                sign="neutral"
                variant="regular"
              />
            </View>

            <Separator />

            <View className="flex-row items-center justify-between gap-1">
              <View>
                <Text className="text-link text-label font-bold tracking-widest uppercase">
                  Diário Previsto
                </Text>
                <Text className="text-muted text-xs">
                  ÷ {daysPerMonth} dias
                </Text>
              </View>
              <Text className="text-foreground font-mono-semibold text-balance-highlight">
                {formatBRL(dailyBudget)}
              </Text>
            </View>
          </View>

          {/* Separador + lista de categorias */}
          {activeCategories.length > 0 && (
            <View className="gap-3">
              <View className="border-separator border-b border-dashed" />

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
        </View>

        {/* Explicação */}
        <Text className="text-muted mt-8 text-sm leading-relaxed">
          Esse é o número que vai aparecer no{" "}
          <Text className="text-link font-bold">velocímetro</Text> da sua tela
          inicial. Gastou abaixo? Sobra pro próximo dia. Passou? A gente lança a
          saída em seguida.
        </Text>
      </View>

      <View className="pb-2">
        <Button
          onPress={() => router.push("/(onboarding)/cadastro")}
          className="bg-foreground h-14 rounded-4xl"
        >
          <Button.Label className="text-background text-base font-semibold">
            Continuar
          </Button.Label>
        </Button>
      </View>
    </Screen>
  );
}
