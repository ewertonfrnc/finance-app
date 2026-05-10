import { useLocalSearchParams, useRouter } from "expo-router";
import { useToast } from "heroui-native";
import { ChevronLeft } from "lucide-react-native";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CurrencyInput } from "@/src/components/ui/CurrencyInput";
import {
  type CategorySlug,
  useOnboardingStore,
} from "@/src/stores/useOnboardingStore";

type Step = {
  slug: CategorySlug;
  number: string;
  label: string;
  heading: string;
  description: string;
};

const STEPS: Step[] = [
  {
    slug: "comida",
    number: "01",
    label: "Comida",
    heading: "Vamos começar pela cozinha — quanto sai num mês?",
    description:
      "Mercado, padaria, iFood, aquele almoço caro do trabalho. Vai no feeling, não precisa ser exato.",
  },
  {
    slug: "transporte",
    number: "02",
    label: "Transporte",
    heading: "E pra ir e vir, quanto rola?",
    description:
      "Combustível, Uber, busão, metrô, estacionamento. Tudo que move você de um lugar pro outro.",
  },
  {
    slug: "lazer",
    number: "03",
    label: "Lazer",
    heading: "E pra desestressar, quanto vai?",
    description:
      "Cinema, jogos, show, balada, um happy hour. Porque a vida não é só boleto, né?",
  },
  {
    slug: "compras",
    number: "04",
    label: "Compras",
    heading: "Compras — quanto entra no carrinho?",
    description:
      "Roupas, gadgets, presentes, aquela coisinha pra casa. Daquelas que a gente 'precisa'.",
  },
  {
    slug: "saude",
    number: "05",
    label: "Saúde",
    heading: "E pra cuidar de você?",
    description:
      "Farmácia, médico, suplemento, terapia. Manter o corpo e a cabeça funcionando direitinho.",
  },
];

export default function CategoryStepScreen() {
  const { step } = useLocalSearchParams<{ step: string }>();
  const router = useRouter();
  const { top, bottom } = useSafeAreaInsets();
  const { categories, setCategory } = useOnboardingStore();
  const { toast } = useToast();

  const currentIndex = STEPS.findIndex((s) => s.slug === step);
  const current = STEPS[currentIndex];

  const [value, setValue] = useState(current ? categories[current.slug] : 0);

  if (!current) return null;

  const isLast = currentIndex === STEPS.length - 1;

  function goNext() {
    if (isLast) {
      router.push("/(onboarding)/resumo");
    } else {
      const nextSlug = STEPS[currentIndex + 1].slug;
      router.push({
        pathname: "/(onboarding)/[step]",
        params: { step: nextSlug },
      });
    }
  }

  function advance(cents: number) {
    if (cents === 0) {
      toast.show({
        placement: "top",
        duration: 3500,
        label: `Sem problema! ${current.label} entra como R$ 0.`,
        description: "Você pode ajustar depois nos ajustes do diário.",
      });
    }
    setCategory(current.slug, cents);
    goNext();
  }

  return (
    <View className="bg-background flex-1 px-6" style={{ paddingTop: top }}>
      {/* Header */}
      <View className="flex-row items-center justify-between py-4">
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={12}
          activeOpacity={0.7}
        >
          <ChevronLeft size={22} color="#13251a" strokeWidth={2} />
        </TouchableOpacity>

        <View className="flex-row items-center gap-1.5">
          {STEPS.map((_, i) => (
            <View
              key={i}
              className={
                i < currentIndex
                  ? "bg-foreground h-1.5 w-4 rounded-full opacity-30"
                  : i === currentIndex
                    ? "bg-foreground h-1.5 w-4 rounded-full"
                    : "bg-surface-tertiary h-1.5 w-1.5 rounded-full"
              }
            />
          ))}
        </View>

        <TouchableOpacity
          onPress={() => advance(0)}
          hitSlop={12}
          activeOpacity={0.7}
        >
          <Text className="text-muted text-sm font-medium">Pular</Text>
        </TouchableOpacity>
      </View>

      {/* Conteúdo */}
      <View className="flex-1 pt-6">
        <Text className="text-muted mb-3 text-xs font-medium tracking-widest uppercase">
          {current.number} · {current.label}
        </Text>

        <Text className="text-foreground mb-10 text-2xl leading-snug font-semibold">
          {current.heading}
        </Text>

        <Text className="text-muted mb-4 text-xs font-medium tracking-widest uppercase">
          Valor Mensal
        </Text>

        <CurrencyInput value={value} onValueChange={setValue} type="entrada" />

        <Text className="text-muted mt-6 text-sm leading-relaxed">
          {current.description}
        </Text>
      </View>

      {/* Rodapé */}
      <View style={{ paddingBottom: bottom + 16 }}>
        <TouchableOpacity
          activeOpacity={0.85}
          className="bg-foreground items-center rounded-xl py-4"
          onPress={() => advance(value)}
        >
          <Text className="text-background text-base font-semibold">
            Próximo
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
