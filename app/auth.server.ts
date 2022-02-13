import { createCookieSessionStorage } from "remix";
import { Authenticator, AuthorizationError } from "remix-auth";
import { SupabaseStrategy } from "remix-auth-supabase";
import { supabaseClient } from "~/supabase.server";
import type { Session } from "~/supabase.server";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "sb_session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === "production",
  },
});

export const supabaseStrategy = new SupabaseStrategy(
  {
    supabaseClient,
    sessionStorage,
    sessionKey: "accessToken", // if not set, default is sb:session
    sessionErrorKey: "sb:error", // if not set, default is sb:error
  },
  // simple verify example for email/password auth
  async ({ req, supabaseClient }) => {
    const form = await req.formData();
    const email = form?.get("email");
    const password = form?.get("password");

    if (!email) throw new AuthorizationError("Email is required");
    if (typeof email !== "string")
      throw new AuthorizationError("Email must be a string");

    if (!password) throw new AuthorizationError("Password is required");
    if (typeof password !== "string")
      throw new AuthorizationError("Password must be a string");

    const session = await supabaseClient.auth
      .signIn({ email, password })
      .then(({ session, error }): Session => {
        if (error || !session)
          throw new AuthorizationError(
            error?.message ?? "No user session found"
          );

        return session;
      });

    // if (session?.access_token) {
    //   const s = await sessionStorage.getSession();
    //   s.set("accessToken", session.access_token);
    // }

    return session;
  }
);

export const authenticator = new Authenticator<Session>(sessionStorage, {
  sessionKey: supabaseStrategy.sessionKey, // keep in sync
  sessionErrorKey: supabaseStrategy.sessionErrorKey, // keep in sync
});

authenticator.use(supabaseStrategy);
