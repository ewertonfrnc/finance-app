import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetTextInput,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { Check, Trash2, X } from "lucide-react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useCreateTag } from "../hooks/useCreateTag";
import { useDeleteTag } from "../hooks/useDeleteTag";
import { useInvalidateTagData } from "../hooks/useInvalidateTagData";
import { useUpdateTag } from "../hooks/useUpdateTag";
import type { Tag } from "../types";
import { TagBadge } from "./TagBadge";

const TAG_COLOR_PALETTE = [
  { label: "Marrom", hex: "#D4A87A" }, // quente terroso
  { label: "Laranja", hex: "#F4934A" }, // quente vibrante
  { label: "Rosa", hex: "#E86FA8" }, // quente frio
  { label: "Roxo", hex: "#C4A4F4" }, // frio escuro
  { label: "Azul", hex: "#4A7CE0" }, // frio médio
  { label: "Verde", hex: "#7EC8A0" }, // frio claro
  { label: "Cinza", hex: "#9E9E9E" }, // neutro escuro
  { label: "Marfim", hex: "#E8D5A3" }, // neutro quente — fora da lista original
] as const;

const MAX_TAGS = 100;

function getTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#333333" : "#FFFFFF";
}

interface TagFormModalProps {
  onClose: () => void;
  mode: "create" | "edit";
  tag?: Tag;
  currentCount: number;
}

export function TagFormModal({
  onClose,
  mode,
  tag,
  currentCount,
}: TagFormModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState<string>(TAG_COLOR_PALETTE[0].hex);
  const [touched, setTouched] = useState(false);

  const sheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["88%"], []);

  const hasError = touched && !name.trim();

  const invalidate = useInvalidateTagData();
  const { mutate: create, isPending: isCreating } = useCreateTag();
  const { mutate: update, isPending: isUpdating } = useUpdateTag();
  const { mutate: remove, isPending: isDeleting } = useDeleteTag();

  const isPending = isCreating || isUpdating || isDeleting;
  const { bottom } = useSafeAreaInsets();

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

  useEffect(() => {
    if (mode === "edit" && tag) {
      setName(tag.name);
      setColor(tag.color);
    } else {
      setName("");
      setColor(TAG_COLOR_PALETTE[0].hex);
      setTouched(false);
    }
    sheetRef.current?.present();
  }, [mode, tag]);

  function handleSubmit() {
    setTouched(true);
    const trimmed = name.trim();
    if (!trimmed) return;

    if (mode === "create") {
      create(
        { name: trimmed, color },
        {
          onSuccess: async () => {
            await invalidate();
            sheetRef.current?.dismiss();
          },
        },
      );
    } else if (tag) {
      update(
        { id: tag.id, payload: { name: trimmed, color } },
        {
          onSuccess: async () => {
            await invalidate();
            sheetRef.current?.dismiss();
          },
        },
      );
    }
  }

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
                await invalidate();
                sheetRef.current?.dismiss();
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
          <Text className="text-foreground text-lg font-semibold">
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

        <Text className="text-muted mb-2 text-xs tracking-wider uppercase">
          Nome
        </Text>
        <BottomSheetTextInput
          className="text-foreground py-2 text-base"
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
          <Text className="text-muted text-xs tracking-wider uppercase">
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
          <Text className="text-muted text-xs tracking-wider uppercase">
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
