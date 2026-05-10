import { useLocalSearchParams, useRouter } from "expo-router";

import {
  TransactionForm,
  type FormValues,
} from "@/src/components/transactions/TransactionForm";
import { useCreateTransaction } from "@/src/features/transactions/hooks/useCreateTransaction";
import { isIsoDate } from "@/src/lib/date";
import { Screen } from "@/src/components/ui/Screen";

export default function NewTransactionScreen() {
  const { date } = useLocalSearchParams<{ date?: string }>();
  const router = useRouter();
  const { mutate: create, isPending } = useCreateTransaction();
  const initialDate = typeof date === "string" && isIsoDate(date) ? date : undefined;

  function handleSubmit(values: FormValues) {
    create(
      {
        type: values.type,
        amount: values.amountCents,
        description: values.description,
        date: values.date,
      },
      { onSuccess: () => router.back() },
    );
  }

  return (
    <Screen>
      <TransactionForm
        mode="new"
        initialValues={{ date: initialDate }}
        onSubmit={handleSubmit}
        isLoading={isPending}
      />
    </Screen>
  );
}
