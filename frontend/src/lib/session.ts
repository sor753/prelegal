"use client";

import { useSyncExternalStore } from "react";

const TOKEN_KEY = "prelegal_token";
// AI: 同一タブでのトークン変更をuseSyncExternalStoreに通知するためのカスタムイベント
const AUTH_CHANGE_EVENT = "prelegal-auth-change";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

function subscribe(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(AUTH_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(AUTH_CHANGE_EVENT, callback);
  };
}

const getSnapshot = () => !!localStorage.getItem(TOKEN_KEY);
const getServerSnapshot = () => false;

export function useSession(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
