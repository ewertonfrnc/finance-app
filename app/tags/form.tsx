import { useLocalSearchParams, useRouter } from "expo-router";
import { Check, Trash2, X } from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";

import { Screen } from "@/src/components/ui/Screen";
import { TagBadge } from "@/src/features/tags/components/TagBadge";
import { useCreateTag } from "@/src/features/tags/hooks/useCreateTag";
import { useDeleteTag } from "@/src/features/tags/hooks/useDeleteTag";
import { useInvalidateTagData } from "@/src/features/tags/hooks/useInvalidateTagData";
import { useTags } from "@/src/features/tags/hooks/useTags";
import { useUpdateTag } from "@/src/features/tags/hooks/useUpdateTag";
import { useDateStore } from "@/src/stores/useDateStore";

const TAG_COLOR_PALETTE = [
  { label: "Cinza", hex: "#CCCCCC" },
  { label: "Vermelho", hex: "#F4A4A4" },
  { label: "Laranja", hex: "#F4C4A4" },
  { label: "Amarelo", hex: "#F4F4A4" },
  { label: "Verde", hex: "#A4F4A4" },
  { label: "Azul claro", hex: "#A4E4F4" },
  { label: "Azul", hex: "#7BB5F4" },
  { label: "Roxo", hex: "#C4A4F4" },
  { label: "Rosa", hex: "#F4A4D4" },
] as const;

const MAX_TAGS = 100;

function getTextColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#333333" : "#FFFFFF";
}

export default function TagFormScreen() {
  const { mode, id } = useLocalSearchParams<{
    mode: "create" | "edit";
    id?: string;
  }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const mutedColor = scheme === "dark" ? "#6b8c78" : "#7a9485";

  const { selectedYear, selectedMonth } = useDateStore();
  const { data: tags = [] } = useTags(selectedYear, selectedMonth);
  const tag = id ? tags.find((t) => t.id === id) : undefined;

  const [name, setName] = useState(tag?.name ?? "");
  const [color, setColor] = useState(tag?.color ?? TAG_COLOR_PALETTE[0].hex);
  const [touched, setTouched] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const invalidate = useInvalidateTagData();
  const { mutate: create, isPending: isCreating } = useCreateTag();
  const { mutate: update, isPending: isUpdating } = useUpdateTag();
  const { mutate: remove, isPending: isDeleting } = useDeleteTag();
  const isPending = isCreating || isUpdating || isDeleting;

  const hasError = touched && !name.trim();
  const isEdit = mode === "edit";

  function handleSubmit() {
    setTouched(true);
    const trimmed = name.trim();
    if (!trimmed) return;

    if (isEdit && tag) {
      update(
        { id: tag.id, payload: { name: trimmed, color } },
        {
          onSuccess: async () => {
            await invalidate();
            router.back();
          },
        },
      );
    } else {
      create(
        { name: trimmed, color },
        {
          onSuccess: async () => {
            await invalidate();
            router.back();
          },
        },
      );
    }
  }

  function handleDelete() {
    if (!tag) return;
    setShowDeleteConfirm(true);
  }

  function confirmDelete() {
    if (!tag) return;
    remove(tag.id, {
      onSuccess: async () => {
        await invalidate();
        router.back();
      },
    });
  }

  return (
    <Screen>
      <View className="flex-row items-center justify-between px-4 py-4">
        <Text className="text-foreground text-lg font-semibold">
          {isEdit ? "Editar tag" : "Criar tag"}
        </Text>
        <View className="flex-row items-center gap-4">
          {isEdit && (
            <Pressable
              onPress={handleDelete}
              disabled={isPending}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Trash2 size={18} color="#ef4444" />
            </Pressable>
          )}
          <Pressable
            onPress={() => router.back()}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <X size={18} color={mutedColor} />
          </Pressable>
        </View>
      </View>

      <View className="bg-surface-secondary h-px" />

      <ScrollView contentContainerClassName="px-6 pt-6 pb-10">
        <Text className="text-muted mb-2 text-xs tracking-wider uppercase">
          Nome
        </Text>
        <TextInput
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
          autoFocus
        />
        <View className="mt-1 mb-6 flex-row items-center justify-between">
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
                borderWidth: color === item.hex ? 2 : 0,
                borderColor: "rgba(0,0,0,0.25)",
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

        <View className="bg-surface-secondary mb-6 flex-row items-center gap-3 rounded-xl px-4 py-3">
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
            {isPending ? "Salvando..." : isEdit ? "Salvar" : "Criar"}
          </Text>
        </Pressable>

        <Text className="text-muted text-center text-xs">
          {tags.length} de {MAX_TAGS} tags disponíveis
        </Text>
      </ScrollView>
      <Modal
        visible={showDeleteConfirm}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteConfirm(false)}
      >
        <View style={styles.modalContainer}>
          <Pressable
            style={StyleSheet.absoluteFillObject}
            onPress={() => setShowDeleteConfirm(false)}
          />
          <View className="bg-background rounded-t-3xl px-6 pt-6 pb-10">
            <View className="mb-4 flex-row items-center gap-3">
              <TagBadge name={tag?.name ?? ""} color={tag?.color ?? "#ccc"} />
            </View>

            <Text className="text-foreground mb-2 text-xl font-bold">
              {`Excluir "${tag?.name}"?`}
            </Text>

            {(tag?.transactionCount ?? 0) > 0 && (
              <View className="bg-surface-secondary mb-6 flex-row items-center gap-2 rounded-xl px-4 py-3">
                <View
                  style={{ backgroundColor: tag?.color }}
                  className="h-1.5 w-1.5 rounded-full"
                />
                <Text className="text-muted text-sm">
                  {tag?.transactionCount}{" "}
                  {tag?.transactionCount === 1
                    ? "lançamento ficará"
                    : "lançamentos ficarão"}{" "}
                  sem essa tag
                </Text>
              </View>
            )}

            <View className="flex-row gap-3">
              <Pressable
                className="flex-1 items-center rounded-full border border-gray-200 py-3.5"
                onPress={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                <Text className="text-foreground font-semibold">Cancelar</Text>
              </Pressable>
              <Pressable
                className="flex-1 items-center rounded-full bg-red-600 py-3.5"
                onPress={confirmDelete}
                disabled={isDeleting}
              >
                <Text className="text-sm font-semibold text-white">
                  {isDeleting ? "Excluindo..." : "Excluir tag"}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
});
