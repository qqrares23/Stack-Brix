import { useState, useEffect } from 'react';

export interface SessionUser {
  userId: string;
  name: string;
  email: string;
  labels: string[];
}

interface UseSessionReturn {
  user: SessionUser | null;
  loading: boolean;
  isLoggedIn: boolean;
  isAdmin: boolean;
}

// Swap the body of the useEffect with the commented block below
// once Appwrite is wired up (src/lib/appwrite.ts).
export function useSession(): UseSessionReturn {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // ── Appwrite implementation (uncomment when ready) ──────────────────
    // import { account } from '../lib/appwrite';
    // setLoading(true);
    // account.get()
    //   .then((u) => setUser({
    //     userId: u.$id,
    //     name:   u.name,
    //     email:  u.email,
    //     labels: u.labels ?? [],
    //   }))
    //   .catch(() => setUser(null))
    //   .finally(() => setLoading(false));
    // ────────────────────────────────────────────────────────────────────
    void setUser;    // remove once Appwrite is wired up
    void setLoading;
  }, []);

  return {
    user,
    loading,
    isLoggedIn: !!user,
    isAdmin: user?.labels.includes('admin') ?? false,
  };
}
