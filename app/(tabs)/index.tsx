import { Chip } from "@/src/components/ui/Chip";
import { CurrencyText } from "@/src/components/ui/CurrencyText";
import { Screen } from "@/src/components/ui/Screen";
import { TypeBadge } from "@/src/components/ui/TypeBadge";
import { MonthNavigator } from "@/src/components/navigation/MonthNavigator";
import { DayNavigator } from "@/src/components/navigation/DayNavigator";
import { useState } from "react";
import { ScrollView, Text, View } from "react-native";

const TRANSACTION_TYPES = ["entrada", "saida", "diario", "economia"] as const;
const FILTER_OPTIONS = ["Todas", "Entrada", "Saída", "Diário", "Economia"];

export default function SaldosScreen() {
  const [selectedFilter, setSelectedFilter] = useState("Todas");

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* MonthNavigator */}
        <Text className="text-muted px-4 pt-4 pb-1 text-xs font-medium uppercase">
          MonthNavigator
        </Text>
        <View className="bg-surface mx-4 rounded-xl">
          <MonthNavigator />
        </View>

        {/* DayNavigator */}
        <Text className="text-muted px-4 pt-5 pb-1 text-xs font-medium uppercase">
          DayNavigator
        </Text>
        <View className="bg-surface mx-4 rounded-xl">
          <DayNavigator
            date="2026-05-08"
            onPrev={() => {}}
            onNext={() => {}}
            onAdd={() => {}}
          />
        </View>

        {/* CurrencyText */}
        <Text className="text-muted px-4 pt-5 pb-1 text-xs font-medium uppercase">
          CurrencyText
        </Text>
        <View className="bg-surface mx-4 rounded-xl px-4 py-3 gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-muted text-sm">large / positivo</Text>
            <CurrencyText value={208930} variant="large" />
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-muted text-sm">large / negativo</Text>
            <CurrencyText value={-208930} variant="large" />
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-muted text-sm">regular / neutral</Text>
            <CurrencyText value={50000} variant="regular" sign="neutral" />
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-muted text-sm">small / positivo</Text>
            <CurrencyText value={12050} variant="small" />
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-muted text-sm">small / negativo</Text>
            <CurrencyText value={-3799} variant="small" />
          </View>
        </View>

        {/* TypeBadge */}
        <Text className="text-muted px-4 pt-5 pb-1 text-xs font-medium uppercase">
          TypeBadge
        </Text>
        <View className="bg-surface mx-4 rounded-xl px-4 py-3">
          <View className="flex-row justify-around">
            {TRANSACTION_TYPES.map((type) => (
              <View key={type} className="items-center gap-2">
                <TypeBadge type={type} size="md" />
                <Text className="text-muted text-xs">{type}</Text>
              </View>
            ))}
          </View>
          <View className="mt-4 flex-row justify-around">
            {TRANSACTION_TYPES.map((type) => (
              <View key={type} className="items-center gap-2">
                <TypeBadge type={type} size="sm" />
                <Text className="text-muted text-xs">sm</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Chip */}
        <Text className="text-muted px-4 pt-5 pb-1 text-xs font-medium uppercase">
          Chip (filtro)
        </Text>
        <View className="bg-surface mx-4 rounded-xl px-4 py-3">
          <View className="flex-row flex-wrap gap-2">
            {FILTER_OPTIONS.map((label) => (
              <Chip
                key={label}
                label={label}
                selected={selectedFilter === label}
                onPress={() => setSelectedFilter(label)}
              />
            ))}
          </View>
        </View>

        <Text className="text-muted px-4 pt-5 text-xs text-center">
          FABButton está fixo no canto inferior
        </Text>
      </ScrollView>
    </Screen>
  );
}
