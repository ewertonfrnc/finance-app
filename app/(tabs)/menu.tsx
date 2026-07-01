import { useRouter } from "expo-router";
import { Button, Dialog, ListGroup, Switch } from "heroui-native";
import { LogOut, Moon } from "lucide-react-native";
import { useState } from "react";
import { Text, View } from "react-native";
import { Uniwind, useUniwind } from "uniwind";

import { Screen } from "@/src/components/ui/Screen";
import { colorsForScheme } from "@/src/lib/designTokens";
import { useAuthStore } from "@/src/stores/useAuthStore";
import {
  type ThemePreference,
  useThemePreferenceStore,
} from "@/src/stores/useThemePreferenceStore";

export default function MenuScreen() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setThemePreference = useThemePreferenceStore((s) => s.setPreference);
  const { theme } = useUniwind();
  const router = useRouter();
  const isDarkMode = theme === "dark";
  const c = colorsForScheme(isDarkMode ? "dark" : "light");

  function updateThemePreference(preference: ThemePreference) {
    Uniwind.setTheme(preference);
    setThemePreference(preference);
  }

  function handleLogout() {
    setShowLogoutConfirm(false);
    clearAuth();
    router.replace("/(onboarding)");
  }

  return (
    <Screen className="px-6 pb-4">
      <View className="gap-6 pt-6">
        <View>
          <Text style={{ color: c.text }} className="text-heading font-bold">
            Menu
          </Text>
          <Text style={{ color: c.mute }} className="text-body-small mt-1">
            Ajustes rápidos da sua experiência no app.
          </Text>
        </View>

        <View className="gap-2">
          <Text
            style={{ color: c.mute }}
            className="text-label font-semibold tracking-widest"
          >
            APARÊNCIA
          </Text>
          <ListGroup
            variant="default"
            className="border-ds-hair rounded-card border"
          >
            <ListGroup.Item
              onPress={() =>
                updateThemePreference(isDarkMode ? "light" : "dark")
              }
              className="min-h-16 px-4 py-3"
            >
              <ListGroup.ItemPrefix className="mr-3">
                <View
                  style={{
                    backgroundColor: isDarkMode ? c.greenTint : c.canvasBg,
                    borderColor: isDarkMode ? c.greenSoft : c.hairStrong,
                  }}
                  className="h-10 w-10 items-center justify-center rounded-xl border"
                >
                  <Moon
                    size={18}
                    color={isDarkMode ? c.green : c.mute}
                    strokeWidth={2.2}
                  />
                </View>
              </ListGroup.ItemPrefix>

              <ListGroup.ItemContent>
                <ListGroup.ItemTitle
                  style={{ color: c.text }}
                  className="text-base font-semibold"
                >
                  Modo escuro
                </ListGroup.ItemTitle>
                <ListGroup.ItemDescription
                  style={{ color: c.mute }}
                  className="text-body-small mt-0.5"
                >
                  {isDarkMode ? "Tema escuro ativo" : "Tema claro ativo"}
                </ListGroup.ItemDescription>
              </ListGroup.ItemContent>

              <ListGroup.ItemSuffix className="ml-3">
                <Switch
                  isSelected={isDarkMode}
                  onSelectedChange={(selected) =>
                    updateThemePreference(selected ? "dark" : "light")
                  }
                  animation={{
                    backgroundColor: {
                      value: [c.hairStrong, c.green],
                    },
                  }}
                />
              </ListGroup.ItemSuffix>
            </ListGroup.Item>
          </ListGroup>
        </View>

        <View className="gap-2">
          <Text
            style={{ color: c.mute }}
            className="text-label font-semibold tracking-widest"
          >
            CONTA
          </Text>
          <ListGroup
            variant="default"
            className="border-ds-hair rounded-card border"
          >
            <ListGroup.Item
              onPress={() => setShowLogoutConfirm(true)}
              className="min-h-16 px-4 py-3"
            >
              <ListGroup.ItemPrefix className="mr-3">
                <View
                  style={{
                    backgroundColor: c.redSoftSurface,
                    borderColor: c.redRing,
                  }}
                  className="h-10 w-10 items-center justify-center rounded-xl border"
                >
                  <LogOut size={18} color={c.red} strokeWidth={2.2} />
                </View>
              </ListGroup.ItemPrefix>

              <ListGroup.ItemContent>
                <ListGroup.ItemTitle
                  style={{ color: c.red }}
                  className="text-base font-semibold"
                >
                  Sair da conta
                </ListGroup.ItemTitle>
                <ListGroup.ItemDescription
                  style={{ color: c.mute }}
                  className="text-body-small mt-0.5"
                >
                  Encerrar sessão neste dispositivo
                </ListGroup.ItemDescription>
              </ListGroup.ItemContent>
            </ListGroup.Item>
          </ListGroup>

          <Dialog
            isOpen={showLogoutConfirm}
            onOpenChange={setShowLogoutConfirm}
          >
            <Dialog.Portal>
              <Dialog.Overlay />
              <Dialog.Content className="rounded-card border-ds-red-ring bg-surface mx-6 gap-4 border p-5">
                <View className="gap-2">
                  <Dialog.Title className="text-foreground text-lg font-bold">
                    Encerrar sessão?
                  </Dialog.Title>
                  <Dialog.Description className="text-muted text-sm leading-5">
                    Você volta para a entrada do app e precisará fazer login
                    novamente.
                  </Dialog.Description>
                </View>

                <View className="flex-row justify-end gap-2">
                  <Button
                    variant="tertiary"
                    size="sm"
                    onPress={() => setShowLogoutConfirm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="danger-soft"
                    size="sm"
                    onPress={handleLogout}
                  >
                    Sair
                  </Button>
                </View>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog>
        </View>
      </View>
    </Screen>
  );
}
