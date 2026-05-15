import { useLocalSearchParams, useRouter } from "expo-router";

import {
  TransactionForm,
  type FormValues,
} from "@/src/components/transactions/TransactionForm";
import { Screen } from "@/src/components/ui/Screen";
import { useCreateTransaction } from "@/src/features/transactions/hooks/useCreateTransaction";
import { useInvalidateTransactionData } from "@/src/features/transactions/hooks/useInvalidateTransactionData";
import { isIsoDate } from "@/src/lib/date";

export default function NewTransactionScreen() {
  const { date } = useLocalSearchParams<{ date?: string }>();
  const router = useRouter();
  const { mutate: create, isPending } = useCreateTransaction();
  const invalidate = useInvalidateTransactionData();
  const initialDate =
    typeof date === "string" && isIsoDate(date) ? date : undefined;

  function handleSubmit(values: FormValues) {
    create(
      {
        type: values.type,
        amount: values.amountCents,
        description: values.description,
        date: values.date,
      },
      {
        onSuccess: async () => {
          await invalidate();
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
      />
    </Screen>
  );
}
