import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, View } from "react-native";

import { TransactionForm } from "@/src/components/transactions/TransactionForm";
import { Screen } from "@/src/components/ui/Screen";
import { formatTagSelectionSummary } from "@/src/features/tags/constants";
import { useInvalidateTagData } from "@/src/features/tags/hooks/useInvalidateTagData";
import { useTagPickerSync } from "@/src/features/tags/hooks/useTagPickerSync";
import { useTags } from "@/src/features/tags/hooks/useTags";
import { DeleteScopeSheet } from "@/src/features/transactions/components/DeleteScopeSheet";
import { EditScopeSheet } from "@/src/features/transactions/components/EditScopeSheet";
import { SeriesBadge } from "@/src/features/transactions/components/SeriesBadge";
import { SeriesOriginNotice } from "@/src/features/transactions/components/SeriesOriginNotice";
import { formatRecurrenceLabel } from "@/src/features/transactions/constants";
import { useDeleteTransaction } from "@/src/features/transactions/hooks/useDeleteTransaction";
import { useInvalidateTransactionData } from "@/src/features/transactions/hooks/useInvalidateTransactionData";
import { useTransaction } from "@/src/features/transactions/hooks/useTransaction";
import { useUpdateTransaction } from "@/src/features/transactions/hooks/useUpdateTransaction";
import type {
  FormValues,
  RecurrenceScope,
} from "@/src/features/transactions/types";
import { useDateStore } from "@/src/stores/useDateStore";
import { queryKeys } from "@/src/lib/queryKeys";
import { useAuthStore } from "@/src/stores/useAuthStore";
import { useTagPickerStore } from "@/src/stores/useTagPickerStore";

function sameTagIds(left: string[], right: string[]) {
  if (left.length !== right.length) return false;
  const sortedLeft = [...left].sort();
  const sortedRight = [...right].sort();
  return sortedLeft.every((id, index) => id === sortedRight[index]);
}

export default function EditTransactionScreen() {
  const { id, date: occurrenceDate } = useLocalSearchParams<{
    id: string;
    date?: string;
  }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const userId = useAuthStore((s) => s.userId);
  const { selectedYear, selectedMonth } = useDateStore();

  const { data: transaction, isLoading } = useTransaction(id);
  const { data: tags = [] } = useTags(selectedYear, selectedMonth);
  const { mutate: update, isPending: isUpdating } = useUpdateTransaction();
  const { mutate: remove, isPending: isDeleting } = useDeleteTransaction();
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
          // Tags viajam no próprio PATCH: o backend decide o row alvo conforme o
          // scope (single/following criam novo row e tagueiam ele; "all" e avulsa
          // tagueiam o que permanece). Evita taguear o template antigo.
          tags: selectedTagIds,
          // Escopo viaja no CORPO do PATCH (≠ delete, que usa query).
          // instance_date = data da ocorrência da rota, não a do template.
          ...(scope ? { scope, instance_date: effectiveOccurrenceDate } : {}),
        },
      },
      {
        onSuccess: async () => {
          await Promise.all([
            invalidate(),
            invalidateTags(),
            // Detalhe do row editado (avulsa/"all") pode ter tags stale.
            queryClient.invalidateQueries({
              queryKey: queryKeys.transaction(userId, id),
            }),
          ]);
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
    await Promise.all([invalidate(), invalidateTags()]);
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

  const tagSummary = formatTagSelectionSummary(selectedTagIds, [
    ...tags,
    ...(transaction?.tags ?? []),
  ]);
  const initialTagIds = transaction?.tags.map((tag) => tag.id) ?? [];
  const hasTagChanges = !sameTagIds(selectedTagIds, initialTagIds);

  function handleTagPress() {
    useTagPickerStore.getState().set(selectedTagIds);
    router.push("/tags/pick");
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
          recurrence: transaction.recurrence,
          recurrenceEndDate: transaction.recurrenceEndDate,
        }}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        isLoading={isUpdating}
        isDeleting={isDeleting}
        tagSummary={tagSummary}
        hasExternalChanges={hasTagChanges}
        onTagPress={handleTagPress}
        header={
          isRecurring ? (
            <SeriesBadge
              recurrence={transaction.recurrence}
              endDate={transaction.recurrenceEndDate}
            />
          ) : null
        }
      >
        {transaction.sourceSeriesId ? <SeriesOriginNotice /> : null}
      </TransactionForm>

      {showDeleteSheet ? (
        <DeleteScopeSheet
          isPending={isDeleting}
          recurrenceLabel={formatRecurrenceLabel(transaction.recurrence)}
          onClose={() => setShowDeleteSheet(false)}
          onConfirm={handleDeleteWithScope}
        />
      ) : null}
      {showEditSheet ? (
        <EditScopeSheet
          isPending={isUpdating}
          recurrenceLabel={formatRecurrenceLabel(transaction.recurrence)}
          onClose={() => setShowEditSheet(false)}
          onConfirm={handleUpdateWithScope}
        />
      ) : null}
    </Screen>
  );
}
