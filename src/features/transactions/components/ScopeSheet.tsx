import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { AlertTriangle, ChevronRight, Repeat } from "lucide-react-native";
import { useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { renderSheetBackdrop } from "@/src/components/ui/SheetBackdrop";
import type { RecurrenceScope } from "@/src/features/transactions/types";

const SNAP_POINTS = ["46%"];

export interface ScopeOption {
  scope: RecurrenceScope;
  label: string;
  desc: string;
  tone?: "default" | "danger" | "warn";
}

interface ScopeSheetProps {
  title: string;
  options: ScopeOption[];
  isPending: boolean;
  onClose: () => void;
  onConfirm: (scope: RecurrenceScope) => void;
  /** Rótulo da recorrência da série (ex.: "todo mês"). Exibe o chip de contexto no topo. */
  recurrenceLabel?: string;
}

/**
 * Bottom sheet genérico de escopo de recorrência. Não sabe qual chamada de API
 * fazer — apenas emite o scope escolhido. Reutilizado por DeleteScopeSheet e
 * EditScopeSheet, que só trocam título e textos.
 */
export function ScopeSheet({
  title,
  options,
  isPending,
  onClose,
  onConfirm,
  recurrenceLabel,
}: ScopeSheetProps) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const { bottom } = useSafeAreaInsets();

  useEffect(() => {
    sheetRef.current?.present();
  }, []);

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={SNAP_POINTS}
      enablePanDownToClose
      backdropComponent={renderSheetBackdrop}
      bottomInset={bottom}
      onDismiss={onClose}
    >
      <BottomSheetView className="px-5 pt-1 pb-6">
        {recurrenceLabel ? (
          <View className="bg-success/15 mb-3 flex-row items-center gap-1.5 self-start rounded-full px-2.5 py-1">
            <Repeat size={12} className="text-success" />
            <Text className="text-success text-xs font-semibold">
              {recurrenceLabel}
            </Text>
          </View>
        ) : null}

        <Text className="text-foreground mb-4 text-lg font-semibold">
          {title}
        </Text>

        <View className="gap-2">
          {options.map((option, index) => {
            const danger = option.tone === "danger";
            const warn = option.tone === "warn";
            return (
              <Pressable
                key={option.scope}
                disabled={isPending}
                onPress={() => onConfirm(option.scope)}
                className={`flex-row items-center gap-3 rounded-2xl border px-4 py-3 ${
                  danger
                    ? "border-danger/30 bg-danger/5"
                    : warn
                      ? "border-accent/40 bg-accent/10"
                      : "border-surface-tertiary"
                } ${isPending ? "opacity-50" : ""}`}
              >
                <View
                  className={`h-6 w-6 items-center justify-center rounded-full ${
                    danger
                      ? "bg-danger/15"
                      : warn
                        ? "bg-accent/20"
                        : "bg-surface-secondary"
                  }`}
                >
                  {warn ? (
                    <AlertTriangle size={13} className="text-accent" />
                  ) : (
                    <Text
                      className={`text-xs font-semibold ${
                        danger ? "text-danger" : "text-muted"
                      }`}
                    >
                      {index + 1}
                    </Text>
                  )}
                </View>
                <View className="flex-1">
                  <Text
                    className={`text-base font-semibold ${
                      danger
                        ? "text-danger"
                        : warn
                          ? "text-accent"
                          : "text-foreground"
                    }`}
                  >
                    {option.label}
                  </Text>
                  <Text className="text-muted text-xs">{option.desc}</Text>
                </View>
                <ChevronRight
                  size={18}
                  className={
                    danger
                      ? "text-danger"
                      : warn
                        ? "text-accent"
                        : "text-muted"
                  }
                />
              </Pressable>
            );
          })}
        </View>

        <Pressable
          onPress={() => sheetRef.current?.dismiss()}
          disabled={isPending}
          className="border-surface-tertiary mt-4 items-center rounded-full border py-3.5"
        >
          <Text className="text-foreground text-base font-semibold">
            Cancelar
          </Text>
        </Pressable>
      </BottomSheetView>
    </BottomSheetModal>
  );
}
