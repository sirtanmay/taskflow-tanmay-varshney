import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type AuthUser = {
  user_id: string;
  email: string;
};

export const useAuth = () => {
  const token = useAuthStore((s) => s.token);
  const router = useRouter();

  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !token) {
      router.replace("/login");
    }
  }, [isHydrated, token, router]);

  const user: AuthUser | null = token
    ? JSON.parse(atob(token.split(".")[1]))
    : null;

  return {
    token,
    user,
    isAuthenticated: !!token,
  };
};
