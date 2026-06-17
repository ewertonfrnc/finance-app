import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { Check, Trash2, X } from "lucide-react-native";
import { useEffect, useMemo, useRef } from "react";
import { Alert, Pressable, Text, View, useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { renderSheetBackdrop } from "@/src/components/ui/SheetBackdrop";
import { colorsForScheme } from "@/src/lib/designTokens";

import { getTagPaletteForScheme } from "../constants";
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

  const scheme = useColorScheme();
  const c = colorsForScheme(scheme);
  const tagPalette = getTagPaletteForScheme(scheme);

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
      backdropComponent={renderSheetBackdrop}
      keyboardBehavior="extend"
      bottomInset={bottom}
      backgroundStyle={{ backgroundColor: c.surface }}
      handleIndicatorStyle={{ backgroundColor: c.dragHandle }}
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
                <Trash2 size={18} color={c.red} />
              </Pressable>
            )}
            <Pressable onPress={() => sheetRef.current?.dismiss()}>
              <X size={18} color={c.mute} />
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
            borderBottomColor: hasError ? c.red : c.hairStrong,
          }}
          placeholder="Como vamos chamar essa tag?"
          placeholderTextColor={c.faint}
          value={name}
          onChangeText={setName}
          autoCorrect={false}
          maxLength={38}
        />
        <View className="mt-1 mb-5 flex-row items-center justify-between">
          {hasError ? (
            <Text className="text-danger text-xs">
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
          {tagPalette.map((item) => (
            <Pressable
              key={item.hex}
              style={{
                backgroundColor: c.surface,
                width: "48%",
                borderWidth: 2,
                borderColor: color === item.hex ? c.text : item.dot,
              }}
              className="flex-row items-center justify-between rounded-xl px-3 py-3"
              onPress={() => setColor(item.hex)}
            >
              <View className="flex-row items-center gap-2">
                <View
                  style={{ backgroundColor: item.dot }}
                  className="h-2 w-2 rounded-full"
                />
                <Text className="text-foreground text-sm font-medium">
                  {item.label}
                </Text>
              </View>
              {color === item.hex && <Check size={14} color={c.text} />}
            </Pressable>
          ))}
        </View>

        <View className="bg-surface-secondary border-separator mb-6 flex-row items-center gap-3 rounded-xl border border-dotted px-4 py-3">
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
          className="bg-ds-canvas-bg mb-3 items-center rounded-xl py-3.5"
          onPress={handleSubmit}
          disabled={isPending}
        >
          <Text className="text-foreground text-sm font-semibold">
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
