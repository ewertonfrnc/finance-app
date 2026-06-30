import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

import { TransactionForm } from "@/src/components/transactions/TransactionForm";
import { Screen } from "@/src/components/ui/Screen";
import { formatTagSelectionSummary } from "@/src/features/tags/constants";
import { useInvalidateTagData } from "@/src/features/tags/hooks/useInvalidateTagData";
import { useTagPickerSync } from "@/src/features/tags/hooks/useTagPickerSync";
import { useTags } from "@/src/features/tags/hooks/useTags";
import { useCreateTransaction } from "@/src/features/transactions/hooks/useCreateTransaction";
import { useInvalidateTransactionData } from "@/src/features/transactions/hooks/useInvalidateTransactionData";
import type { FormValues } from "@/src/features/transactions/types";
import { isIsoDate } from "@/src/lib/date";
import { useDateStore } from "@/src/stores/useDateStore";
import { useTagPickerStore } from "@/src/stores/useTagPickerStore";

function sameTagIds(left: string[], right: string[]) {
  if (left.length !== right.length) return false;
  const sortedLeft = [...left].sort();
  const sortedRight = [...right].sort();
  return sortedLeft.every((id, index) => id === sortedRight[index]);
}

export default function NewTransactionScreen() {
  const { date, tagId } = useLocalSearchParams<{
    date?: string;
    tagId?: string;
  }>();
  const router = useRouter();
  const { mutate: create, isPending } = useCreateTransaction();
  const invalidate = useInvalidateTransactionData();
  const invalidateTags = useInvalidateTagData();
  const { selectedYear, selectedMonth } = useDateStore();
  const { data: tags = [] } = useTags(selectedYear, selectedMonth);
  const initialDate =
    typeof date === "string" && isIsoDate(date) ? date : undefined;

  const initialTagIds = typeof tagId === "string" ? [tagId] : [];
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialTagIds);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      useTagPickerStore.getState().set(initialTagIds);
      initialized.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useTagPickerSync(initialized, setSelectedTagIds);

  const tagSummary = formatTagSelectionSummary(selectedTagIds, tags);
  const hasTagChanges = !sameTagIds(selectedTagIds, initialTagIds);

  function handleTagPress() {
    useTagPickerStore.getState().set(selectedTagIds);
    router.push("/tags/pick");
  }

  function handleSubmit(values: FormValues) {
    create(
      {
        type: values.type,
        amount: values.amountCents,
        description: values.description,
        date: values.date,
        tags: selectedTagIds.length > 0 ? selectedTagIds : undefined,
        recurrence: values.recurrence,
        recurrence_end_date: values.recurrenceEndDate,
      },
      {
        onSuccess: async () => {
          await Promise.all([invalidate(), invalidateTags()]);
          router.back();
        },
      },
    );
  }

  return (
    <Screen>
      <TransactionForm
        mode="new"
        initialValues={{ date: initialDate }}
        onSubmit={handleSubmit}
        isLoading={isPending}
        tagSummary={tagSummary}
        hasExternalChanges={hasTagChanges}
        onTagPress={handleTagPress}
      />
    </Screen>
  );
}
