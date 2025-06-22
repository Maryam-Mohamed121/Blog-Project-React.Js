import { isTokenExpire } from "@/api";
import { refreshTokeAPI } from "@/api/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null, // <-- add this line
      loading: false,
      setTokens: (tokens) => set({ ...tokens }),
      clear: () => set({ token: null, refreshToken: null, user: null }), // clear user too
      isValidTokens: async () => {
        set({ loading: true });
        const { token, refreshToken, clear } = get();
        try {
          if (isTokenExpire(token) && isTokenExpire(refreshToken)) {
            clear();
            return false;
          }
          if (!isTokenExpire(token) || !isTokenExpire(refreshToken)) {
            if (isTokenExpire(token)) {
              try {
                const res = await refreshTokeAPI({ refreshToken });
                set({ ...res.data });
              } catch {
                clear();
                return false;
              }
            }
            return true;
          }
          clear();
          return false;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-store",
    }
  )
);
