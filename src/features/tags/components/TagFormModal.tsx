import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { Check, Trash2, X } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TAG_COLOR_PALETTE, getTextColor } from "../constants";
import { useTagForm } from "../hooks/useTagForm";
import type { Tag } from "../types";
import { TagBadge } from "./TagBadge";

const MAX_TAGS = 100;

interface TagFormModalProps {
  onClose: () => void;
  onDelete?: () => void;
  mode: "create" | "edit";
  tag?: Tag;
  currentCount: number;
}

export function TagFormModal({
  onClose,
  onDelete,
  mode,
  tag,
  currentCount,
}: TagFormModalProps) {
  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["88%"], []);
  const { bottom } = useSafeAreaInsets();

  const {
    name,
    setName,
    color,
    setColor,
    hasError,
    isPending,
    remove,
    invalidate,
    handleSubmit,
  } = useTagForm({ mode, tag, onSuccess: () => sheetRef.current?.dismiss() });

  useEffect(() => {
    sheetRef.current?.present();
  }, [mode, tag]);

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  function handleDelete() {
    if (!tag) return;
    Alert.alert(
      "Excluir tag",
      `Tem certeza que deseja excluir "${tag.name}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: () => {
            remove(tag.id, {
              onSuccess: async () => {
                onDelete?.();
                sheetRef.current?.dismiss();
                await invalidate(tag.id);
              },
            });
          },
        },
      ],
    );
  }

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      keyboardBehavior="extend"
      bottomInset={bottom}
      onDismiss={onClose}
    >
      <BottomSheetScrollView contentContainerClassName="px-6 pt-2 pb-6">
        <View className="mb-5 flex-row items-center justify-between">
          <Text className="text-foreground text-sheet-title font-bold">
            {mode === "create" ? "Criar tag" : "Editar tag"}
          </Text>
          <View className="flex-row items-center gap-4">
            {mode === "edit" && (
              <Pressable onPress={handleDelete} disabled={isPending}>
                <Trash2 size={18} color="#ef4444" />
              </Pressable>
            )}
            <Pressable onPress={() => sheetRef.current?.dismiss()}>
              <X size={18} color="#888888" />
            </Pressable>
          </View>
        </View>

        <Text className="text-muted text-label mb-2 font-semibold tracking-wider uppercase">
          Nome
        </Text>
        <BottomSheetTextInput
          className="text-foreground text-input py-2 font-medium"
          style={{
            borderBottomWidth: 1.5,
            borderBottomColor: hasError ? "#ef4444" : "#cccccc",
          }}
          placeholder="Como vamos chamar essa tag?"
          value={name}
          onChangeText={setName}
          autoCorrect={false}
          maxLength={38}
        />
        <View className="mt-1 mb-5 flex-row items-center justify-between">
          {hasError ? (
            <Text className="text-xs text-red-500">
              Dê um nome pra continuar
            </Text>
          ) : (
            <View />
          )}
          <Text className="text-muted text-xs">{name.length}/38</Text>
        </View>

        <View className="mb-3 flex-row items-center justify-between">
          <Text className="text-muted text-label font-semibold tracking-wider uppercase">
            Cor de fundo
          </Text>
          <Text className="text-muted text-xs">Toque pra escolher</Text>
        </View>
        <View className="mb-6 flex-row flex-wrap gap-2">
          {TAG_COLOR_PALETTE.map((item) => (
            <Pressable
              key={item.hex}
              style={{
                backgroundColor: item.hex,
                width: "48%",
                borderWidth: 2,
                borderColor:
                  color === item.hex ? "rgba(0,0,0,0.25)" : "transparent",
              }}
              className="flex-row items-center justify-between rounded-xl px-3 py-3"
              onPress={() => setColor(item.hex)}
            >
              <Text
                className="text-sm font-medium"
                style={{ color: getTextColor(item.hex) }}
              >
                {item.label}
              </Text>
              {color === item.hex && <Check size={14} color="#333" />}
            </Pressable>
          ))}
        </View>

        <View className="bg-surface-secondary border-foreground/30 mb-6 flex-row items-center gap-3 rounded-xl border border-dotted px-4 py-3">
          <Text className="text-muted text-label font-semibold tracking-wider uppercase">
            Prévia
          </Text>
          <TagBadge
            name={name.trim() || "Nome da tag"}
            color={color}
            size="sm"
          />
        </View>

        <Pressable
          className="bg-foreground mb-3 items-center rounded-xl py-3.5"
          onPress={handleSubmit}
          disabled={isPending}
        >
          <Text className="text-background text-sm font-semibold">
            {isPending ? "Salvando..." : mode === "create" ? "Criar" : "Salvar"}
          </Text>
        </Pressable>

        <Text className="text-muted text-center text-xs">
          <Text className="font-mono">{currentCount}</Text> de{" "}
          <Text className="font-mono">{MAX_TAGS}</Text> tags disponíveis
        </Text>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
}
