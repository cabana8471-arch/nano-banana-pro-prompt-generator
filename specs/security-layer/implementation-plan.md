# Security Layer - Implementation Plan

## Architecture Overview

```
[Visitor] → [Site Password] → [Google OAuth] → [Allowlist/Code] → [Application]
              (Layer 1)        (Layer 2)         (Layer 3)
```

**3 Security Layers:**
1. **Layer 1:** Site password gate (cookie-based)
2. **Layer 2:** Google OAuth authentication (existing Better Auth)
3. **Layer 3:** Authorization via email allowlist or invitation codes

---

## Phase 1: Database Schema

### Tasks
- [x] Add `allowed_emails` table to `src/lib/schema.ts`
  - `id` (uuid, PK)
  - `email` (text, unique, indexed)
  - `addedBy` (references user, nullable)
  - `note` (text, optional)
  - `createdAt` (timestamp)

- [x] Add `invitation_codes` table to `src/lib/schema.ts`
  - `id` (uuid, PK)
  - `code` (text, unique, indexed, 8 chars)
  - `createdBy` (references user)
  - `redeemedBy` (references user, nullable)
  - `redeemedAt` (timestamp, nullable)
  - `expiresAt` (timestamp, nullable)
  - `maxUses` (integer, default 1)
  - `currentUses` (integer, default 0)
  - `isActive` (boolean, default true)
  - `createdAt` (timestamp)

- [x] Add `user_access_status` table to `src/lib/schema.ts`
  - `id` (uuid, PK)
  - `userId` (references user, unique, indexed)
  - `isAuthorized` (boolean)
  - `authorizedVia` (text: "allowlist" | "invitation_code")
  - `invitationCodeId` (references invitation_codes, nullable)
  - `authorizedAt` (timestamp)

- [x] Run `pnpm db:push` to apply schema changes

---

## Phase 2: Environment Variables

### Tasks
- [x] Update `src/lib/env.ts` - add to `serverEnvSchema`:
  - `SITE_PASSWORD` (string, min 8 chars, optional)
  - `ADMIN_EMAILS` (string, optional, comma-separated)

- [x] Update `checkEnv()` function with warnings for missing security vars

---

## Phase 3: Site Password (Layer 1)

### Tasks
- [x] Create `src/lib/site-password.ts` utility:
  - `getSitePassword()` - get password from env
  - `isSitePasswordEnabled()` - check if enabled
  - `hashPassword(password)` - SHA-256 hash
  - `verifySitePasswordCookie()` - verify cookie
  - `setSitePasswordCookie()` - set cookie after verification
  - Cookie config: `site_password_verified`, HTTPOnly, secure, 30 days

- [x] Create `src/app/api/site-password/route.ts`:
  - POST handler to verify password and set cookie
  - Return success/error response

- [x] Create `src/components/auth/site-password-form.tsx`:
  - Password input form
  - Error display
  - Loading state
  - Nano Banana Pro branding

- [x] Create `src/app/[locale]/site-password/page.tsx`:
  - Centered layout
  - Render SitePasswordForm component
  - Metadata for page title

---

## Phase 4: Authorization System (Layer 3)

### Tasks
- [x] Create `src/lib/authorization.ts`:
  - `isAdminEmail(email)` - check against ADMIN_EMAILS
  - `isEmailAllowed(email)` - check allowlist table
  - `isUserAuthorized(userId)` - check access status
  - `authorizeUserViaAllowlist(userId)` - auto-authorize if on list
  - `redeemInvitationCode(userId, code)` - redeem code
  - `generateInvitationCode(createdBy, options)` - create new code

- [x] Create `src/lib/require-authorization.ts`:
  - `requireAuthorization()` - server-side helper
  - Check session existence
  - Check admin status (bypass)
  - Try allowlist auto-authorization
  - Check existing authorization
  - Redirect to /unauthorized if not authorized

---

## Phase 5: Unauthorized Page

### Tasks
- [x] Create `src/components/auth/unauthorized-client.tsx`:
  - Display user's current email
  - Invitation code input form
  - Redeem code functionality
  - Contact admin instructions
  - Sign out button
  - Nano Banana Pro branding

- [x] Create `src/app/[locale]/unauthorized/page.tsx`:
  - Render UnauthorizedClient component
  - Page metadata

---

## Phase 6: Authorization API Routes

### Tasks
- [x] Create `src/app/api/authorization/check/route.ts`:
  - GET handler to check authorization status
  - Return authorized, isAdmin, authorizedVia

- [x] Create `src/app/api/authorization/redeem-code/route.ts`:
  - POST handler to redeem invitation code
  - Validate code format
  - Call redeemInvitationCode utility
  - Return success/error

---

## Phase 7: Middleware Updates

### Tasks
- [ ] Update `src/proxy.ts`:
  - Define public routes: `/site-password`, `/unauthorized`, `/api/site-password`, `/api/auth`
  - Add site password cookie check (Layer 1)
  - Keep existing session cookie check (Layer 2)
  - Add comment about Layer 3 being server-side
  - Handle redirects with locale preservation

---

## Phase 8: Protect Existing Routes

### Tasks
- [ ] Update `src/app/[locale]/photo-generator/layout.tsx`:
  - Replace `requireAuth()` with `requireAuthorization()`

- [ ] Update `src/app/[locale]/banner-generator/layout.tsx`:
  - Replace `requireAuth()` with `requireAuthorization()`

- [ ] Update `src/app/[locale]/logo-generator/layout.tsx`:
  - Replace `requireAuth()` with `requireAuthorization()`

- [ ] Update `src/app/[locale]/gallery/layout.tsx`:
  - Add `requireAuthorization()` check

- [ ] Update `src/app/[locale]/profile/layout.tsx`:
  - Add `requireAuthorization()` check

- [ ] Update `src/app/[locale]/avatars/layout.tsx`:
  - Add `requireAuthorization()` check

- [ ] Update other protected layouts (logos, products, references, cost-control)

---

## Phase 9: Protect Public Gallery

### Tasks
- [ ] Update `src/app/api/gallery/public/route.ts`:
  - Add session check (require authentication)
  - Add authorization check (require authorization)
  - Return 401 for unauthenticated
  - Return 403 for unauthorized

- [ ] Update `src/app/[locale]/gallery/public/page.tsx`:
  - Add `requireAuthorization()` check

- [ ] Update `src/app/api/gallery/user/[userId]/route.ts`:
  - Add authorization check

- [ ] Update `src/app/api/gallery/most-liked/route.ts`:
  - Add authorization check

- [ ] Update `src/app/api/gallery/top-contributors/route.ts`:
  - Add authorization check

---

## Phase 10: Admin API Routes

### Tasks
- [ ] Create `src/app/api/admin/allowlist/route.ts`:
  - GET: List all allowed emails (admin only)
  - POST: Add email to allowlist (admin only)
  - DELETE: Remove email from allowlist (admin only)

- [ ] Create `src/app/api/admin/invitation-codes/route.ts`:
  - GET: List all invitation codes (admin only)
  - POST: Generate new code (admin only)
  - PATCH: Activate/deactivate code (admin only)

---

## Phase 11: Final Validation

### Tasks
- [ ] Run `pnpm lint` - fix any linting errors
- [ ] Run `pnpm typecheck` - fix any type errors
- [ ] Manual testing:
  - [ ] Test site password gate
  - [ ] Test unauthorized flow with new user
  - [ ] Test allowlist auto-authorization
  - [ ] Test invitation code redemption
  - [ ] Test admin bypass
  - [ ] Test public gallery protection

---

## Files Summary

### New Files (14)
| File | Description |
|------|-------------|
| `src/lib/site-password.ts` | Site password utility functions |
| `src/lib/authorization.ts` | Authorization logic (allowlist, codes) |
| `src/lib/require-authorization.ts` | Server-side auth helper |
| `src/app/api/site-password/route.ts` | Site password API |
| `src/app/api/authorization/check/route.ts` | Auth status check API |
| `src/app/api/authorization/redeem-code/route.ts` | Code redemption API |
| `src/app/api/admin/allowlist/route.ts` | Allowlist management API |
| `src/app/api/admin/invitation-codes/route.ts` | Invitation codes API |
| `src/app/[locale]/site-password/page.tsx` | Site password page |
| `src/app/[locale]/unauthorized/page.tsx` | Unauthorized page |
| `src/components/auth/site-password-form.tsx` | Password form component |
| `src/components/auth/unauthorized-client.tsx` | Unauthorized UI component |

### Modified Files (12+)
| File | Changes |
|------|---------|
| `src/lib/schema.ts` | Add 3 new tables |
| `src/lib/env.ts` | Add env var schemas |
| `src/proxy.ts` | Add site password check |
| `src/app/api/gallery/public/route.ts` | Add auth checks |
| `src/app/[locale]/*/layout.tsx` | Replace auth with authorization |

---

## Vercel Configuration

After implementation, add to Vercel Dashboard → Settings → Environment Variables:

```
SITE_PASSWORD=your_secure_password_here
ADMIN_EMAILS=your_email@gmail.com,other_admin@gmail.com
```
