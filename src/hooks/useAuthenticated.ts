import useSWR from "swr";
import { fetcher } from "@/utils";

type authenticated = {
  success: true;
  jwtID: string;
  user: {
    id: string;
    nonce: string;
    publicAddress: string;
    username: null | string;
  };
};

type unAuthenticated = {
  success: false;
  error: { message: string };
};

type AuthResponse = authenticated | unAuthenticated;

export function useUser() {
  const { data, mutate, error } = useSWR("/api/auth/session", fetcher);

  const loading = !data && !error;
  const loggedOut = error && error.status === 403;

  return {
    loading,
    loggedOut,
    user: <AuthResponse>data,
    mutate,
  };
}
