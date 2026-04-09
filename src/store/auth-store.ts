import { create } from "zustand";
import { insforge } from "@/lib/insforge";

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  avatar?: string;
  role: string;
}

interface AuthStore {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ requireVerification?: boolean }>;
  signUp: (data: {
    email: string;
    password: string;
    name: string;
    phone?: string;
  }) => Promise<{ requireVerification?: boolean }>;
  signInWithOAuth: (provider: "google" | "github") => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  error: null,

  initialize: async () => {
    try {
      const { data } = await insforge.auth.getCurrentUser();
      if (data?.user) {
        const profile = data.user.profile as Record<string, string> | undefined;
        let role = profile?.role || "customer";

        // Fetch role from profiles table if not in auth profile
        if (!profile?.role) {
          try {
            const { data: profileRows } = await insforge.database
              .from("profiles")
              .select("role")
              .eq("id", data.user.id)
              .limit(1);
            if (profileRows && profileRows.length > 0 && profileRows[0].role) {
              role = profileRows[0].role;
            }
          } catch {
            // fallback to customer
          }
        }

        set({
          user: {
            id: data.user.id,
            email: data.user.email,
            name: profile?.name,
            avatar: profile?.avatar_url,
            phone: profile?.phone,
            role,
          },
          loading: false,
        });
      } else {
        set({ user: null, loading: false });
      }
    } catch {
      set({ user: null, loading: false });
    }
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    const { data, error } = await insforge.auth.signInWithPassword({ email, password });

    if (error) {
      set({ loading: false, error: error.message });
      throw error;
    }

    if (data?.user) {
      const profile = data.user.profile as Record<string, string> | undefined;
      let role = profile?.role || "customer";

      // Fetch role from profiles table if not in auth profile
      if (!profile?.role) {
        try {
          const { data: profileRows } = await insforge.database
            .from("profiles")
            .select("role")
            .eq("id", data.user.id)
            .limit(1);
          if (profileRows && profileRows.length > 0 && profileRows[0].role) {
            role = profileRows[0].role;
          }
        } catch {
          // fallback to customer
        }
      }

      set({
        user: {
          id: data.user.id,
          email: data.user.email,
          name: profile?.name,
          avatar: profile?.avatar_url,
          phone: profile?.phone,
          role,
        },
        loading: false,
      });
    }

    return {};
  },

  signUp: async ({ email, password, name, phone }) => {
    set({ loading: true, error: null });
    const { data, error } = await insforge.auth.signUp({ email, password, name });

    if (error) {
      set({ loading: false, error: error.message });
      throw error;
    }

    if (data?.requireEmailVerification) {
      set({ loading: false });
      return { requireVerification: true };
    }

    if (data?.user) {
      // Set additional profile fields
      await insforge.auth.setProfile({ phone, role: "customer" });

      // Create profile row in our profiles table
      await insforge.database.from("profiles").insert([
        {
          id: data.user.id,
          email,
          name,
          phone,
          role: "customer",
        },
      ]);

      set({
        user: {
          id: data.user.id,
          email: data.user.email,
          name,
          phone,
          role: "customer",
        },
        loading: false,
      });
    }

    return {};
  },

  signInWithOAuth: async (provider) => {
    set({ loading: true, error: null });
    const { error } = await insforge.auth.signInWithOAuth({
      provider,
      redirectTo: window.location.origin + "/auth/login",
    });

    if (error) {
      set({ loading: false, error: error.message });
      throw error;
    }
  },

  signOut: async () => {
    await insforge.auth.signOut();
    set({ user: null, error: null });
  },

  clearError: () => set({ error: null }),
}));
