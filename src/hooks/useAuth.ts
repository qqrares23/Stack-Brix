import { useState, useCallback } from 'react';

interface LoginFields {
  email: string;
  password: string;
  remember: boolean;
}

interface RegisterFields {
  username: string;
  robloxName: string;
  email: string;
  password: string;
  agreed: boolean;
}

// Structured to call Appwrite account service on submit.
export function useAuth() {
  const [loginFields, setLoginFields] = useState<LoginFields>({
    email: '',
    password: '',
    remember: false,
  });

  const [registerFields, setRegisterFields] = useState<RegisterFields>({
    username: '',
    robloxName: '',
    email: '',
    password: '',
    agreed: false,
  });

  const updateLogin = useCallback(<K extends keyof LoginFields>(key: K, value: LoginFields[K]) => {
    setLoginFields((f) => ({ ...f, [key]: value }));
  }, []);

  const updateRegister = useCallback(<K extends keyof RegisterFields>(key: K, value: RegisterFields[K]) => {
    setRegisterFields((f) => ({ ...f, [key]: value }));
  }, []);

  return { loginFields, updateLogin, registerFields, updateRegister };
}
