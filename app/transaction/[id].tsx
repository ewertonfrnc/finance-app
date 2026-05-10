import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, View } from "react-native";

import {
  TransactionForm,
  type FormValues,
} from "@/src/components/transactions/TransactionForm";
import { Screen } from "@/src/components/ui/Screen";
import { useDeleteTransaction } from "@/src/features/transactions/hooks/useDeleteTransaction";
import { useTransaction } from "@/src/features/transactions/hooks/useTransaction";
import { useUpdateTransaction } from "@/src/features/transactions/hooks/useUpdateTransaction";

export default function EditTransactionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: transaction, isLoading } = useTransaction(id);
  const { mutate: update, isPending: isUpdating } = useUpdateTransaction();
  const { mutate: remove, isPending: isDeleting } = useDeleteTransaction();

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
      { onSuccess: () => router.back() },
    );
  }

  function handleDelete() {
    remove(id, { onSuccess: () => router.back() });
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
      />
    </Screen>
  );
}
