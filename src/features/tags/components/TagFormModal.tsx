import { useEffect, useState } from "react";
import { Alert, Modal, Pressable, Text, TextInput, View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/src/lib/queryKeys";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useCreateTag } from "../hooks/useCreateTag";
import { useDeleteTag } from "../hooks/useDeleteTag";
import { useUpdateTag } from "../hooks/useUpdateTag";
import type { Tag } from "../types";

const TAG_COLORS = [
  "#CCCCCC",
  "#F4A4A4",
  "#F4C4A4",
  "#F4F4A4",
  "#A4F4A4",
  "#A4E4F4",
  "#7BB5F4",
  "#C4A4F4",
  "#F4A4D4",
];

interface TagFormModalProps {
  visible: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  tag?: Tag;
}

export function TagFormModal({ visible, onClose, mode, tag }: TagFormModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState(TAG_COLORS[0]);

  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);

  const { mutate: create, isPending: isCreating } = useCreateTag();
  const { mutate: update, isPending: isUpdating } = useUpdateTag();
  const { mutate: remove, isPending: isDeleting } = useDeleteTag();

  const isPending = isCreating || isUpdating || isDeleting;

  useEffect(() => {
    if (!visible) return;
    if (mode === "edit" && tag) {
      setName(tag.name);
      setColor(tag.color);
    } else {
      setName("");
      setColor(TAG_COLORS[0]);
    }
  }, [visible, mode, tag]);

  function invalidateTags() {
    return queryClient.invalidateQueries({ queryKey: queryKeys.tagsAll(userId) });
  }

  function handleSubmit() {
    const trimmed = name.trim();
    if (!trimmed) return;

    if (mode === "create") {
      create(
        { name: trimmed, color },
        {
          onSuccess: async () => {
            await invalidateTags();
            onClose();
          },
        },
      );
    } else if (tag) {
      update(
        { id: tag.id, payload: { name: trimmed, color } },
        {
          onSuccess: async () => {
            await invalidateTags();
            onClose();
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
                await invalidateTags();
                onClose();
              },
            });
          },
        },
      ],
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <Pressable className="absolute inset-0 bg-black/50" onPress={onClose} />
        <View className="bg-background rounded-t-2xl px-6 pt-4 pb-8">
          <View className="w-10 h-1 bg-surface-secondary rounded-full self-center mb-5" />

          <Text className="text-foreground text-lg font-semibold mb-5">
            {mode === "create" ? "Criar tag" : "Editar tag"}
          </Text>

          <Text className="text-muted text-xs uppercase tracking-wider mb-2">
            Nome
          </Text>
          <TextInput
            className="bg-surface-secondary text-foreground rounded-xl px-4 py-3 text-base mb-5"
            placeholder="Ex: Assinatura"
            value={name}
            onChangeText={setName}
            autoCorrect={false}
            maxLength={40}
          />

          <Text className="text-muted text-xs uppercase tracking-wider mb-3">
            Cor
          </Text>
          <View className="flex-row flex-wrap gap-3 mb-6">
            {TAG_COLORS.map((c) => (
              <Pressable
                key={c}
                style={{
                  backgroundColor: c,
                  borderWidth: color === c ? 2.5 : 0,
                  borderColor: "#1e3d2b",
                }}
                className="w-9 h-9 rounded-full"
                onPress={() => setColor(c)}
              />
            ))}
          </View>

          <Pressable
            className="bg-foreground rounded-xl py-3.5 items-center mb-3"
            onPress={handleSubmit}
            disabled={isPending || !name.trim()}
          >
            <Text className="text-background font-semibold text-sm">
              {isPending ? "Salvando..." : "Salvar"}
            </Text>
          </Pressable>

          {mode === "edit" && (
            <Pressable
              className="py-3 items-center"
              onPress={handleDelete}
              disabled={isPending}
            >
              <Text className="text-red-500 text-sm font-medium">Excluir tag</Text>
            </Pressable>
          )}
        </View>
      </View>
    </Modal>
  );
}
