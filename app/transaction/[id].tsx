import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import {
  TransactionForm,
  type FormValues,
} from "@/src/components/transactions/TransactionForm";
import { Screen } from "@/src/components/ui/Screen";
import { TagPicker } from "@/src/features/tags/components/TagPicker";
import { useInvalidateTagData } from "@/src/features/tags/hooks/useInvalidateTagData";
import { useSetTransactionTags } from "@/src/features/tags/hooks/useSetTransactionTags";
import { useDeleteTransaction } from "@/src/features/transactions/hooks/useDeleteTransaction";
import { useInvalidateTransactionData } from "@/src/features/transactions/hooks/useInvalidateTransactionData";
import { useTransaction } from "@/src/features/transactions/hooks/useTransaction";
import { useUpdateTransaction } from "@/src/features/transactions/hooks/useUpdateTransaction";
import { queryKeys } from "@/src/lib/queryKeys";
import { useAuthStore } from "@/src/stores/useAuthStore";

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);

  const { data: transaction, isLoading } = useTransaction(id);
  const { mutate: update, isPending: isUpdating } = useUpdateTransaction();
  const { mutate: remove, isPending: isDeleting } = useDeleteTransaction();
  const { mutateAsync: setTags } = useSetTransactionTags();
  const invalidate = useInvalidateTransactionData();
  const invalidateTags = useInvalidateTagData();

  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const tagsInitialized = useRef(false);

  useEffect(() => {
    if (transaction && !tagsInitialized.current) {
      setSelectedTagIds(transaction.tags.map((t) => t.id));
      tagsInitialized.current = true;
    }
  }, [transaction]);

  function handleSubmit(values: FormValues) {
    update(
      {
        id,
        payload: {
          type: values.type,
          amount: values.amountCents,
          description: values.description,
          date: values.date,
        },
      },
      {
        onSuccess: async () => {
          await setTags({ transactionId: id, tagIds: selectedTagIds });
          await Promise.all([invalidate(), invalidateTags()]);
          router.back();
        },
      },
    );
  }

  function handleDelete() {
    remove(id, {
      onSuccess: async () => {
        queryClient.removeQueries({
          queryKey: queryKeys.transaction(userId, id),
        });
        await invalidate();
        router.back();
      },
    });
  }

  if (isLoading || !transaction) {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <TransactionForm
        mode="edit"
        initialValues={{
          type: transaction.type,
          amountCents: transaction.amount,
          description: transaction.description,
          date: transaction.date,
        }}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        isLoading={isUpdating}
        isDeleting={isDeleting}
      >
        <TagPicker selectedTagIds={selectedTagIds} onChangeTagIds={setSelectedTagIds} />
      </TransactionForm>
    </Screen>
  );
}
