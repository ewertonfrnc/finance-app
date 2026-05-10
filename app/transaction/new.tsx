import { useRouter } from "expo-router";

import {
  TransactionForm,
  type FormValues,
} from "@/src/components/transactions/TransactionForm";
import { useCreateTransaction } from "@/src/features/transactions/hooks/useCreateTransaction";
import { Screen } from "@/src/components/ui/Screen";

export default function NewTransactionScreen() {
  const router = useRouter();
  const { mutate: create, isPending } = useCreateTransaction();

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
        onSubmit={handleSubmit}
        isLoading={isPending}
      />
    </Screen>
  );
}
