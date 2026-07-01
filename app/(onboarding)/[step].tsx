import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { Button, useToast } from "heroui-native";
import { ChevronLeft } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from "react-native";

import { CurrencyInput } from "@/src/components/ui/CurrencyInput";
import { Screen } from "@/src/components/ui/Screen";
import { colorsForScheme } from "@/src/lib/designTokens";
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
  const scheme = useColorScheme();
  const c = colorsForScheme(scheme);
  const { categories, setCategory } = useOnboardingStore();
  const { toast } = useToast();

  const currentIndex = STEPS.findIndex((s) => s.slug === step);
  const current = STEPS[currentIndex];

  const [value, setValue] = useState(current ? categories[current.slug] : 0);

  useEffect(() => {
    if (!current) return;
    setValue(categories[current.slug]);
  }, [current, categories]);

  if (!current) return <Redirect href="/(onboarding)" />;

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
    <Screen className="bg-background flex-1 px-6">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between py-4">
          <TouchableOpacity
            onPress={() => router.back()}
            hitSlop={12}
            activeOpacity={0.7}
          >
            <ChevronLeft size={22} color={c.text} strokeWidth={2} />
          </TouchableOpacity>

          <View className="flex-row items-center gap-1.5">
            {STEPS.map((_, i) => (
              <View
                key={i}
                style={{
                  backgroundColor: i <= currentIndex ? c.green : c.hair,
                  height: 6,
                  width: i === currentIndex ? 16 : 6,
                  borderRadius: 99,
                }}
              />
            ))}
          </View>

          <TouchableOpacity
            onPress={() => advance(0)}
            hitSlop={12}
            activeOpacity={0.7}
          >
            <Text className="text-muted text-body-small font-medium">
              Pular
            </Text>
          </TouchableOpacity>
        </View>

        {/* Conteúdo */}
        <View className="flex-1 pt-6">
          <Text className="text-accent text-step mb-3 font-semibold tracking-widest uppercase">
            {current.number} · {current.label}
          </Text>

          <Text className="text-foreground text-heading mb-10 font-bold">
            {current.heading}
          </Text>

          <Text className="text-muted text-label mb-4 font-semibold tracking-widest uppercase">
            Valor Mensal
          </Text>

          <CurrencyInput
            value={value}
            onValueChange={setValue}
            type="economia"
            accentColor={c.green}
          />

          <Text className="text-muted mt-6 text-sm leading-relaxed">
            {current.description}
          </Text>
        </View>

        {/* Rodapé */}
        <View className="pb-2">
          <Button
            onPress={() => advance(value)}
            className="bg-ds-canvas-bg h-14 rounded-4xl"
          >
            <Button.Label className="text-foreground text-base font-semibold">
              Próximo
            </Button.Label>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
