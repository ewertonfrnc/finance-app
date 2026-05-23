import { useEffect, useState } from "react";

import { TAG_COLOR_PALETTE } from "../constants";
import type { Tag } from "../types";
import { useCreateTag } from "./useCreateTag";
import { useDeleteTag } from "./useDeleteTag";
import { useInvalidateTagData } from "./useInvalidateTagData";
import { useUpdateTag } from "./useUpdateTag";

interface UseTagFormOptions {
  mode: "create" | "edit";
  tag?: Tag;
  onSuccess: () => void | Promise<void>;
}

export function useTagForm({ mode, tag, onSuccess }: UseTagFormOptions) {
  const [name, setName] = useState(tag?.name ?? "");
  const [color, setColor] = useState(tag?.color ?? TAG_COLOR_PALETTE[0].hex);
  const [touched, setTouched] = useState(false);

  const invalidate = useInvalidateTagData();
  const { mutate: create, isPending: isCreating } = useCreateTag();
  const { mutate: update, isPending: isUpdating } = useUpdateTag();
  const { mutate: remove, isPending: isDeleting } = useDeleteTag();

  const isPending = isCreating || isUpdating || isDeleting;
  const hasError = touched && !name.trim();

  useEffect(() => {
    if (mode === "edit" && tag) {
      setName(tag.name);
      setColor(tag.color);
    } else {
      setName("");
      setColor(TAG_COLOR_PALETTE[0].hex);
      setTouched(false);
    }
  }, [mode, tag]);

  function handleSubmit() {
    setTouched(true);
    const trimmed = name.trim();
    if (!trimmed) return;

    const handleSuccess = async () => {
      await invalidate();
      await onSuccess();
    };

    if (mode === "create") {
      create({ name: trimmed, color }, { onSuccess: handleSuccess });
    } else if (tag) {
      update(
        { id: tag.id, payload: { name: trimmed, color } },
        { onSuccess: handleSuccess },
      );
    }
  }

  return {
    name,
    setName,
    color,
    setColor,
    hasError,
    isPending,
    isDeleting,
    handleSubmit,
    remove,
    invalidate,
  };
}
