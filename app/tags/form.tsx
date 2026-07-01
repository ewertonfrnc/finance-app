import { useLocalSearchParams, useRouter } from "expo-router";
import { Check, Trash2, X } from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";

import { Screen } from "@/src/components/ui/Screen";
import { TagBadge } from "@/src/features/tags/components/TagBadge";
import {
  getTagColors,
  getTagPaletteForScheme,
} from "@/src/features/tags/constants";
import { useTagForm } from "@/src/features/tags/hooks/useTagForm";
import { useTags } from "@/src/features/tags/hooks/useTags";
import { colorsForScheme } from "@/src/lib/designTokens";
import { useDateStore } from "@/src/stores/useDateStore";

const MAX_TAGS = 100;

export default function TagFormScreen() {
  const { mode, id } = useLocalSearchParams<{
    mode: "create" | "edit";
    id?: string;
  }>();
  const router = useRouter();
  const scheme = useColorScheme();
  const c = colorsForScheme(scheme);
  const mutedColor = c.mute;
  const tagPalette = getTagPaletteForScheme(scheme);

  const { selectedYear, selectedMonth } = useDateStore();
  const { data: tags = [] } = useTags(selectedYear, selectedMonth);
  const tag = id ? tags.find((t) => t.id === id) : undefined;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isEdit = mode === "edit";

  const {
    name,
    setName,
    color,
    setColor,
    hasError,
    isPending,
    isDeleting,
    remove,
    invalidate,
    handleSubmit,
  } = useTagForm({ mode, tag, onSuccess: () => router.back() });

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
    <Screen className="bg-background">
      <View className="flex-row items-center justify-between px-4 py-4">
        <Text className="text-foreground text-sheet-title font-bold">
          {isEdit ? "Editar tag" : "Criar tag"}
        </Text>
        <View className="flex-row items-center gap-4">
          {isEdit && (
            <Pressable
              onPress={handleDelete}
              disabled={isPending}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Trash2 size={18} color={c.red} />
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

      <View className="bg-separator h-px" />

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="px-6 pt-6 pb-10"
      >
        <Text className="text-muted text-label mb-2 font-semibold tracking-wider uppercase">
          Nome
        </Text>
        <TextInput
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
          autoFocus
        />
        <View className="mt-1 mb-6 flex-row items-center justify-between">
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

        <View className="bg-surface-secondary mb-6 flex-row items-center gap-3 rounded-xl px-4 py-3">
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
        <View
          className="flex-1 justify-end"
          style={{ backgroundColor: c.overlayDelete }}
        >
          <Pressable
            className="absolute inset-0"
            onPress={() => setShowDeleteConfirm(false)}
          />
          <View className="bg-background rounded-t-3xl px-6 pt-6 pb-10">
            <View className="mb-4 flex-row items-center gap-3">
              <TagBadge name={tag?.name ?? ""} color={tag?.color ?? c.hair} />
            </View>

            <Text className="text-foreground text-sheet-title mb-2 font-bold">
              {`Excluir "${tag?.name}"?`}
            </Text>

            {(tag?.transactionCount ?? 0) > 0 && (
              <View className="bg-surface-secondary mb-6 flex-row items-center gap-2 rounded-xl px-4 py-3">
                <View
                  style={{
                    backgroundColor: tag?.color
                      ? getTagColors(tag.color, scheme).dot
                      : c.hair,
                  }}
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
                className="border-separator flex-1 items-center rounded-full border py-3.5"
                onPress={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
              >
                <Text className="text-foreground font-semibold">Cancelar</Text>
              </Pressable>
              <Pressable
                style={{ backgroundColor: c.red }}
                className="flex-1 items-center rounded-full py-3.5"
                onPress={confirmDelete}
                disabled={isDeleting}
              >
                <Text className="text-danger-foreground text-sm font-semibold">
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
