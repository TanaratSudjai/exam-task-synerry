import { ReactNode } from "react";


export interface LoginForm {
  email?: string;
  password?: string;
}

export interface RegisterForm {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
}

export interface AuthProviderProps {
  children: ReactNode;
}
