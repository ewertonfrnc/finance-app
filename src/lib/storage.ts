import { MMKV } from 'react-native-mmkv';
import type { StateStorage } from 'zustand/middleware';

const mmkv = new MMKV();

export const mmkvStorage: StateStorage = {
  getItem: (name) => mmkv.getString(name) ?? null,
  setItem: (name, value) => mmkv.set(name, value),
  removeItem: (name) => mmkv.delete(name),
};
