import { ChevronDown, ChevronUp } from "lucide-react-native";
import { useState } from "react";
import { Pressable, Text, View, useColorScheme } from "react-native";

import { useDateStore } from "@/src/stores/useDateStore";
import { useTags } from "../hooks/useTags";
import { TagBadge } from "./TagBadge";

interface TagPickerProps {
  selectedTagIds: string[];
  onChangeTagIds: (tagIds: string[]) => void;
}

export function TagPicker({ selectedTagIds, onChangeTagIds }: TagPickerProps) {
  const [open, setOpen] = useState(false);
  const scheme = useColorScheme();
  const mutedColor = scheme === "dark" ? "#6b8c78" : "#7a9485";

  const { selectedYear, selectedMonth } = useDateStore();
  const { data: tags = [] } = useTags(selectedYear, selectedMonth);

  const selectedTags = tags.filter((t) => selectedTagIds.includes(t.id));

  function toggleTag(id: string) {
    if (selectedTagIds.includes(id)) {
      onChangeTagIds(selectedTagIds.filter((t) => t !== id));
    } else {
      onChangeTagIds([...selectedTagIds, id]);
    }
  }

  return (
    <View className="gap-2">
      <Pressable
        onPress={() => setOpen((v) => !v)}
        className="flex-row items-center gap-2"
      >
        <Text className="text-muted flex-1 text-xs font-semibold tracking-widest">
          TAGS
        </Text>
        {!open && selectedTags.length > 0 && (
          <View className="flex-row flex-wrap gap-1">
            {selectedTags.map((t) => (
              <TagBadge key={t.id} name={t.name} color={t.color} size="sm" />
            ))}
          </View>
        )}
        {open ? (
          <ChevronUp size={16} color={mutedColor} />
        ) : (
          <ChevronDown size={16} color={mutedColor} />
        )}
      </Pressable>

      {open && (
        <View className="flex-row flex-wrap gap-2">
          {tags.length === 0 && (
            <Text className="text-muted text-xs">Nenhuma tag cadastrada</Text>
          )}
          {tags.map((t) => {
            const selected = selectedTagIds.includes(t.id);
            return (
              <Pressable key={t.id} onPress={() => toggleTag(t.id)}>
                <View
                  style={{
                    backgroundColor: t.color + (selected ? "66" : "33"),
                    borderWidth: selected ? 1.5 : 0,
                    borderColor: t.color,
                  }}
                  className="flex-row items-center gap-1 rounded-full px-2.5 py-1"
                >
                  <View
                    style={{ backgroundColor: t.color }}
                    className="h-2 w-2 rounded-full"
                  />
                  <Text className="text-foreground text-xs font-medium">
                    {t.name}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
