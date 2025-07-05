import { CookiesFn, getCookie } from "cookies-next";
import ky from "ky";

export const api = ky.create({
  prefixUrl: process.env.NEXT_PUBLIC_API_URL,
  hooks: {
    beforeRequest: [
      async (request) => {
        let cookieStore: CookiesFn | undefined;

        if (typeof window === "undefined") {
          const { cookies: serverCookies } = await import("next/headers");

          cookieStore = serverCookies;
        }
        const token = getCookie("projeto:token", { cookies: cookieStore });

        if (token) {
          request.headers.set(
            "Authorization",
            `Bearer ${await token.valueOf()}`
          );
        }
      },
    ],
  },
});
