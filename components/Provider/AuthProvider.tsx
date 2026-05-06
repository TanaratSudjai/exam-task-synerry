"use client";

import { SessionProvider } from "next-auth/react";
import { AuthProviderProps } from "@/types/auth";

export default function AuthProvider({ children }: AuthProviderProps) {
    return <SessionProvider>{children}</SessionProvider>;
}
