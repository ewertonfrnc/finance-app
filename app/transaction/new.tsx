import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";

import { TransactionForm } from "@/src/components/transactions/TransactionForm";
import { Screen } from "@/src/components/ui/Screen";
import { TagPicker } from "@/src/features/tags/components/TagPicker";
import { useInvalidateTagData } from "@/src/features/tags/hooks/useInvalidateTagData";
import { useSetTransactionTags } from "@/src/features/tags/hooks/useSetTransactionTags";
import { useCreateTransaction } from "@/src/features/transactions/hooks/useCreateTransaction";
import { useInvalidateTransactionData } from "@/src/features/transactions/hooks/useInvalidateTransactionData";
import type { FormValues } from "@/src/features/transactions/types";
import { isIsoDate } from "@/src/lib/date";

export default function NewTransactionScreen() {
  const { date, tagId } = useLocalSearchParams<{
    date?: string;
    tagId?: string;
  }>();
  const router = useRouter();
  const { mutate: create, isPending } = useCreateTransaction();
  const { mutateAsync: setTags } = useSetTransactionTags();
  const invalidate = useInvalidateTransactionData();
  const invalidateTags = useInvalidateTagData();
  const initialDate =
    typeof date === "string" && isIsoDate(date) ? date : undefined;
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    typeof tagId === "string" ? [tagId] : [],
  );

  function handleSubmit(values: FormValues) {
    create(
      {
        type: values.type,
        amount: values.amountCents,
        description: values.description,
        date: values.date,
      },
      {
        onSuccess: async (data) => {
          if (selectedTagIds.length > 0) {
            await setTags({ transactionId: data.id, tagIds: selectedTagIds });
          }
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
      >
        <TagPicker
          selectedTagIds={selectedTagIds}
          onChangeTagIds={setSelectedTagIds}
        />
      </TransactionForm>
    </Screen>
  );
}
