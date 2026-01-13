import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { createAuthMiddleware } from "better-auth/api"
import { syncUserRoleWithAdminEmails, recordLoginEvent } from "./authorization"
import { db } from "./db"

const hasGoogleOAuth =
  Boolean(process.env.GOOGLE_CLIENT_ID) &&
  Boolean(process.env.GOOGLE_CLIENT_SECRET);

if (!hasGoogleOAuth && (process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_SECRET)) {
  console.warn("Google OAuth is partially configured; provider disabled.");
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  ...(hasGoogleOAuth && {
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      },
    },
  }),
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // Handle sign-in events (including social sign-in)
      if (ctx.path.startsWith("/sign-in") || ctx.path.startsWith("/callback")) {
        const newSession = ctx.context.newSession;
        if (newSession) {
          const { user } = newSession;

          // Sync user role with ADMIN_EMAILS environment variable
          await syncUserRoleWithAdminEmails(user.id, user.email);

          // Extract IP address from headers
          const forwardedFor = ctx.headers?.get("x-forwarded-for");
          const ipAddress = forwardedFor
            ? forwardedFor.split(",")[0]?.trim() || null
            : ctx.headers?.get("x-real-ip") || null;

          // Extract user agent from headers
          const userAgent = ctx.headers?.get("user-agent") || null;

          // Record the login event
          await recordLoginEvent(user.id, ipAddress, userAgent);
        }
      }
    }),
  },
})
