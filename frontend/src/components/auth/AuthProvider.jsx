import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthContext";
import * as auth from "./authService";

export function AuthProvider({ children }) {
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshMe = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setMe(null);
      setLoading(false);
      return null;
    }

    try {
      const profile = await auth.me();
      setMe(profile);
      return profile;
    } catch {
      auth.logout();
      setMe(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo(
    () => ({
      me,
      loading,
      isAuthed: !!me,

      login: async (creds) => {
        setLoading(true);
        await auth.login(creds);
        const profile = await auth.me();
        setMe(profile);
        setLoading(false);
        return profile;
      },

      register: auth.register,

      logout: () => {
        auth.logout();
        setMe(null);
      },

      refreshMe,
    }),
    [me, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}