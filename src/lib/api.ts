"use client";

import { API_URL } from "@/config";

const defaultToken =
  typeof window !== "undefined" && localStorage.getItem("firebaseToken");

export async function graphQLAPI(
  payload: Record<string, string | any>,
  token?: string
) {
  return await (
    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": String(token || defaultToken),
        "Apollo-Require-Preflight": "true",
      },
    })
  ).json();
}
