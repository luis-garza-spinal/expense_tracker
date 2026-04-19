import { create } from "zustand";

interface appGlobalStoreType {
    refetchData: boolean;
    setRefetchData: () => void;
}

export const useAppGlobalStore = create<appGlobalStoreType>((set) => ({
    refetchData: false,
    setRefetchData: () => (set((state) => ({
        refetchData: !state.refetchData
    })))
}));