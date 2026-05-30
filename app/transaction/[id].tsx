import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { TransactionForm } from "@/src/components/transactions/TransactionForm";
import { Screen } from "@/src/components/ui/Screen";
import { TagField } from "@/src/features/tags/components/TagField";
import { useInvalidateTagData } from "@/src/features/tags/hooks/useInvalidateTagData";
import { useSetTransactionTags } from "@/src/features/tags/hooks/useSetTransactionTags";
import { useTagPickerSync } from "@/src/features/tags/hooks/useTagPickerSync";
import { DeleteScopeSheet } from "@/src/features/transactions/components/DeleteScopeSheet";
import { EditScopeSheet } from "@/src/features/transactions/components/EditScopeSheet";
import { useDeleteTransaction } from "@/src/features/transactions/hooks/useDeleteTransaction";
import { useInvalidateTransactionData } from "@/src/features/transactions/hooks/useInvalidateTransactionData";
import { useTransaction } from "@/src/features/transactions/hooks/useTransaction";
import { useUpdateTransaction } from "@/src/features/transactions/hooks/useUpdateTransaction";
import type {
  FormValues,
  RecurrenceScope,
} from "@/src/features/transactions/types";
import { queryKeys } from "@/src/lib/queryKeys";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useTagPickerStore } from "@/src/stores/useTagPickerStore";

export default function EditTransactionScreen() {
  const { id, date: occurrenceDate } = useLocalSearchParams<{
    id: string;
    date?: string;
  }>();
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

  const [showDeleteSheet, setShowDeleteSheet] = useState(false);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [pendingValues, setPendingValues] = useState<FormValues | null>(null);

  const isRecurring = Boolean(transaction && transaction.recurrence !== "none");
  const effectiveOccurrenceDate = occurrenceDate ?? transaction?.date;

  useEffect(() => {
    if (transaction && !tagsInitialized.current) {
      const ids = transaction.tags.map((t) => t.id);
      setSelectedTagIds(ids);
      useTagPickerStore.getState().set(ids);
      tagsInitialized.current = true;
    }
  }, [transaction]);

  useTagPickerSync(tagsInitialized, setSelectedTagIds);

  function submitUpdate(values: FormValues, scope?: RecurrenceScope) {
    update(
      {
        id,
        payload: {
          type: values.type,
          amount: values.amountCents,
          description: values.description,
          date: values.date,
          // Escopo viaja no CORPO do PATCH (≠ delete, que usa query).
          // instance_date = data da ocorrência da rota, não a do template.
          ...(scope ? { scope, instance_date: effectiveOccurrenceDate } : {}),
        },
      },
      {
        onSuccess: async () => {
          // Tags só fazem sentido no row que permanece: avulsa ou template
          // (scope "all"). "single"/"following" criam novos rows cujos IDs o
          // app não recebe — setá-las no template corromperia a série.
          if (!scope || scope === "all") {
            await setTags({ transactionId: id, tagIds: selectedTagIds });
          }
          await Promise.all([invalidate(), invalidateTags()]);
          setShowEditSheet(false);
          router.back();
        },
      },
    );
  }

  function handleSubmit(values: FormValues) {
    if (isRecurring) {
      setPendingValues(values);
      setShowEditSheet(true);
      return;
    }
    submitUpdate(values);
  }

  function handleUpdateWithScope(scope: RecurrenceScope) {
    if (pendingValues) submitUpdate(pendingValues, scope);
  }

  async function handleDeleteSuccess() {
    router.back();
    await invalidate();
    queryClient.removeQueries({
      queryKey: queryKeys.transaction(userId, id),
    });
  }

  function handleDelete() {
    if (isRecurring) {
      setShowDeleteSheet(true);
      return;
    }
    remove({ id }, { onSuccess: handleDeleteSuccess });
  }

  function handleDeleteWithScope(scope: RecurrenceScope) {
    // date = a ocorrência da rota; nunca transaction.date (template).
    remove(
      { id, params: { scope, date: effectiveOccurrenceDate } },
      {
        onSuccess: () => {
          setShowDeleteSheet(false);
          return handleDeleteSuccess();
        },
      },
    );
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
        <TagField
          selectedTagIds={selectedTagIds}
          onChangeTagIds={setSelectedTagIds}
        />
      </TransactionForm>

      {showDeleteSheet ? (
        <DeleteScopeSheet
          isPending={isDeleting}
          onClose={() => setShowDeleteSheet(false)}
          onConfirm={handleDeleteWithScope}
        />
      ) : null}
      {showEditSheet ? (
        <EditScopeSheet
          isPending={isUpdating}
          onClose={() => setShowEditSheet(false)}
          onConfirm={handleUpdateWithScope}
        />
      ) : null}
    </Screen>
  );
}
