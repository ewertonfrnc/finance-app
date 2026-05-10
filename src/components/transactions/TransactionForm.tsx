import { format } from "date-fns";
import { useRouter } from "expo-router";
import { ArrowLeft, X } from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import type { TransactionType } from "@/src/features/transactions/types";
import { CurrencyInput } from "@/src/components/ui/CurrencyInput";
import { DateField } from "@/src/components/ui/DateField";
import { TypeSelector } from "@/src/components/ui/TypeSelector";

export interface FormValues {
  type: TransactionType;
  amountCents: number;
  description: string;
  date: string; // "YYYY-MM-DD"
}

interface TransactionFormProps {
  mode: "new" | "edit";
  initialValues?: Partial<FormValues>;
  onSubmit: (values: FormValues) => void;
  onDelete?: () => void;
  isLoading?: boolean;
  isDeleting?: boolean;
}

const TITLE = { new: "Novo lançamento", edit: "Editar lançamento" } as const;
const SUBMIT_LABEL = { new: "Lançar", edit: "Salvar alterações" } as const;

const TYPE_LABEL_CLASS: Record<TransactionType, string> = {
  diario: "text-warning",
  saida: "text-danger",
  entrada: "text-success",
  economia: "text-accent",
};

export function TransactionForm({
  mode,
  initialValues,
  onSubmit,
  onDelete,
  isLoading = false,
  isDeleting = false,
}: TransactionFormProps) {
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();

  const [type, setType] = useState<TransactionType>(
    initialValues?.type ?? "diario",
  );
  const [amountCents, setAmountCents] = useState(
    initialValues?.amountCents ?? 0,
  );
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [date, setDate] = useState(
    initialValues?.date ?? format(new Date(), "yyyy-MM-dd"),
  );

  const canSubmit = amountCents > 0 && description.trim().length > 0;

  function handleSubmit() {
    if (!canSubmit || isLoading) return;
    onSubmit({ type, amountCents, description, date });
  }

  return (
    <KeyboardAvoidingView className="bg-background flex-1" behavior="padding">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4">
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <ArrowLeft size={22} className="text-foreground" />
        </Pressable>
        <Text className="text-foreground text-base font-semibold">
          {TITLE[mode]}
        </Text>
        <Pressable onPress={() => router.back()} hitSlop={8}>
          <X size={22} className="text-foreground" />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 px-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-8 pb-8"
      >
        {/* Tipo */}
        <View className="gap-2">
          <Text className="text-muted text-xs font-semibold tracking-widest">
            TIPO
          </Text>
          <TypeSelector value={type} onChange={setType} />
        </View>

        {/* Valor */}
        <View className="gap-2">
          <Text
            className={`text-xs font-semibold tracking-widest ${TYPE_LABEL_CLASS[type]}`}
          >
            VALOR
          </Text>
          <CurrencyInput
            value={amountCents}
            onValueChange={setAmountCents}
            type={type}
          />
        </View>

        {/* Descrição */}
        <View className="gap-1">
          <Text className="text-muted text-xs font-semibold tracking-widest">
            DESCRIÇÃO
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Onde foi parar essa grana?"
            placeholderTextColor="#9ca3af"
            maxLength={200}
            returnKeyType="done"
            className="text-foreground border-surface-tertiary border-b-2 py-2 text-base"
          />
          <Text className="text-muted self-end text-xs">
            {description.length}/200
          </Text>
        </View>

        {/* Data */}
        <View className="gap-2">
          <Text className="text-muted text-xs font-semibold tracking-widest">
            DATA
          </Text>
          <DateField value={date} onChange={setDate} />
        </View>
      </ScrollView>

      {/* Footer */}
      <View className="gap-3 px-4 pt-4" style={{ paddingBottom: bottom || 16 }}>
        <Pressable
          onPress={handleSubmit}
          disabled={!canSubmit || isLoading}
          className={`items-center rounded-full py-4 ${
            canSubmit && !isLoading ? "bg-foreground" : "bg-surface-tertiary"
          }`}
        >
          <Text
            className={`text-base font-semibold ${
              canSubmit && !isLoading ? "text-background" : "text-muted"
            }`}
          >
            {isLoading ? "Aguarde..." : SUBMIT_LABEL[mode]}
          </Text>
        </Pressable>

        {mode === "edit" && onDelete && (
          <Pressable
            onPress={onDelete}
            disabled={isDeleting}
            className="items-center py-2"
          >
            <Text className="text-danger text-base font-medium">
              {isDeleting ? "Excluindo..." : "Excluir lançamento"}
            </Text>
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
