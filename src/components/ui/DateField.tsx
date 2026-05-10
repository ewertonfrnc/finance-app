import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

interface DateFieldProps {
  value: string; // "YYYY-MM-DD"
  onChange: (date: string) => void;
}

const SHORTCUTS = [
  { label: "Hoje", offset: 0 },
  { label: "Ontem", offset: 1 },
  { label: "Anteontem", offset: 2 },
];

function today(): Date {
  return new Date();
}

function toISO(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

function toDisplay(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return format(new Date(year, month - 1, day), "dd/MM/yyyy", { locale: ptBR });
}

export function DateField({ value, onChange }: DateFieldProps) {
  const shortcutDates = SHORTCUTS.map(({ label, offset }) => ({
    label,
    iso: toISO(subDays(today(), offset)),
  }));

  return (
    <View className="gap-3">
      <Pressable className="border-surface-tertiary flex-row items-center justify-between border-b-2 pb-2">
        <Text className="font-mono-medium text-foreground text-xl">
          {toDisplay(value)}
        </Text>
        <Calendar size={18} className="text-success" />
      </Pressable>

      <View className="flex-row gap-2">
        {shortcutDates.map(({ label, iso }) => (
          <Pressable
            key={label}
            onPress={() => onChange(iso)}
            className={`rounded-full border px-3 py-1.5 ${
              value === iso
                ? "border-foreground bg-surface-secondary"
                : "border-surface-tertiary bg-transparent"
            }`}
          >
            <Text className="text-foreground text-sm">{label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
