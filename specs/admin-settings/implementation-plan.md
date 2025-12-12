# Admin Settings - Implementation Plan

## Overview

This document outlines the implementation plan for the Admin Settings feature, broken into phases with actionable tasks.

**Estimated files:** ~45-55 files modified/created

---

## Phase 1: Database Schema

### Tasks

- [x] **1.1** Add `role` column to `user` table in `src/lib/schema.ts`
  - Type: `text("role").notNull().default("user")`
  - Values: `"admin"` | `"user"`

- [x] **1.2** Add `isBlocked` column to `user` table in `src/lib/schema.ts`
  - Type: `boolean("is_blocked").notNull().default(false)`

- [x] **1.3** Create `userLoginHistory` table in `src/lib/schema.ts`
  ```typescript
  - id: uuid primary key
  - userId: text (FK to user, cascade delete)
  - ipAddress: text (nullable)
  - userAgent: text (nullable)
  - loginAt: timestamp (default now)
  - Index on userId
  ```

- [x] **1.4** Create `blockedIps` table in `src/lib/schema.ts`
  ```typescript
  - id: uuid primary key
  - ipAddress: text (not null)
  - ipType: text (default "single") - "single" | "range"
  - reason: text (nullable)
  - blockedBy: text (FK to user, set null on delete)
  - isActive: boolean (default true)
  - createdAt: timestamp (default now)
  - expiresAt: timestamp (nullable)
  - Index on ipAddress
  ```

- [x] **1.5** Generate database migration
  - Run `pnpm db:generate`

- [x] **1.6** Apply database migration
  - Run `pnpm db:migrate`

---

## Phase 2: TypeScript Types

### Tasks

- [x] **2.1** Create `src/lib/types/admin.ts` with interfaces:
  - `AdminUser` - user with role, isBlocked, lastLogin info
  - `UserPagination` - pagination metadata
  - `UsersResponse` - paginated users response
  - `BlockedIp` - blocked IP entry
  - `InvitationCode` - invitation code (if not exists)
  - `AllowedEmail` - allowed email entry
  - `InvitationStatus` - type for invitation status
  - `CreateInvitationOptions` - options for creating invitations
  - `BlockIpOptions` - options for blocking IPs

---

## Phase 3: Authorization Functions

### Tasks

- [x] **3.1** Add user management functions to `src/lib/authorization.ts`:
  - `getAllUsers(params)` - list users with pagination, search, filter
  - `updateUserRole(userId, role)` - update user role
  - `setUserBlocked(userId, isBlocked)` - block/unblock user
  - `syncUserRoleWithAdminEmails(userId, email)` - sync role on login

- [x] **3.2** Add login tracking functions to `src/lib/authorization.ts`:
  - `recordLoginEvent(userId, ipAddress, userAgent)` - record login
  - `getLastLogin(userId)` - get last login info
  - `getUserLoginHistory(userId, params)` - get login history with pagination

- [x] **3.3** Add IP blocking functions to `src/lib/authorization.ts`:
  - `isIpBlocked(ipAddress)` - check if IP is blocked
  - `isIpInRange(ip, cidr)` - helper for CIDR matching
  - `blockIp(ipAddress, ipType, blockedBy, reason?, expiresAt?)` - block IP
  - `unblockIp(id)` - remove IP block
  - `setIpBlockActive(id, isActive)` - activate/deactivate
  - `getAllBlockedIps()` - list all blocked IPs

- [x] **3.4** Add invitation code delete function to `src/lib/authorization.ts`:
  - `deleteInvitationCode(codeId)` - delete invitation code

---

## Phase 4: Backend API Routes

### Tasks

- [x] **4.1** Create `src/app/api/admin/users/route.ts`:
  - `GET` - List users with pagination, search, role filter
  - `PATCH` - Update user role or blocked status

- [x] **4.2** Create `src/app/api/admin/blocked-ips/route.ts`:
  - `GET` - List all blocked IPs
  - `POST` - Block an IP address
  - `PATCH` - Activate/deactivate IP block
  - `DELETE` - Remove IP block

- [x] **4.3** Create `src/app/api/admin/login-history/route.ts`:
  - `GET` - Get login history for a user (query param: userId)

- [x] **4.4** Update `src/app/api/admin/invitation-codes/route.ts`:
  - Add `DELETE` handler to delete invitation codes

- [x] **4.5** Create `src/app/api/security/check-ip/route.ts`:
  - `GET` - Check if IP is blocked (Edge-compatible)
  - Used by middleware for IP blocking

- [x] **4.6** Create `src/app/api/admin/check/route.ts`:
  - `GET` - Check if current user is admin (for client-side nav)

---

## Phase 5: Admin Hook

### Tasks

- [x] **5.1** Create `src/hooks/use-admin.ts` with:
  - State: users, invitations, allowlist, blockedIps
  - State: loading, error states for each section
  - State: pagination for users

- [x] **5.2** Add user management actions:
  - `loadUsers(params)` - fetch users
  - `updateUserRole(userId, role)` - change role
  - `setUserBlocked(userId, isBlocked)` - block/unblock

- [x] **5.3** Add invitation management actions:
  - `loadInvitations()` - fetch all invitations
  - `createInvitation(options)` - create new code
  - `toggleInvitationActive(id, isActive)` - activate/deactivate
  - `deleteInvitation(id)` - delete code

- [x] **5.4** Add allowlist management actions:
  - `loadAllowlist()` - fetch allowlist
  - `addToAllowlist(email, note)` - add email
  - `removeFromAllowlist(id)` - remove email

- [x] **5.5** Add IP blocking actions:
  - `loadBlockedIps()` - fetch blocked IPs
  - `blockIp(options)` - block IP
  - `toggleIpBlockActive(id, isActive)` - activate/deactivate
  - `removeIpBlock(id)` - remove block

---

## Phase 6: Admin UI Components

### Tasks

#### Users Tab
- [x] **6.1** Create `src/components/admin/users-tab.tsx`
  - Search input
  - Role filter dropdown
  - User table
  - Pagination controls

- [x] **6.2** Create `src/components/admin/user-table.tsx`
  - Avatar, name, email columns
  - Role badge column
  - Created date column
  - Last login column (date + IP)
  - Status badge column
  - Actions column (edit button)

- [x] **6.3** Create `src/components/admin/user-edit-dialog.tsx`
  - Display user info
  - Role selector (disabled for admin emails)
  - Block toggle switch
  - Save/cancel buttons

#### Invitations Tab
- [x] **6.4** Create `src/components/admin/invitations-tab.tsx`
  - Create code button
  - Invitations table

- [x] **6.5** Create `src/components/admin/invitation-table.tsx`
  - Code column with copy button
  - Creator column
  - Uses column (current/max)
  - Status badge column
  - Expires column
  - Actions column (toggle, delete)

- [x] **6.6** Create `src/components/admin/invitation-create-dialog.tsx`
  - Max uses input (1-1000)
  - Expiration date picker (optional)
  - Create/cancel buttons

#### Allowlist Tab
- [x] **6.7** Create `src/components/admin/allowlist-tab.tsx`
  - Add email button
  - Allowlist table

- [x] **6.8** Create `src/components/admin/allowlist-table.tsx`
  - Email column
  - Added by column
  - Note column
  - Created column
  - Actions column (delete)

- [x] **6.9** Create `src/components/admin/allowlist-add-dialog.tsx`
  - Email input
  - Note textarea (optional)
  - Add/cancel buttons

#### Security Tab
- [x] **6.10** Create `src/components/admin/security-tab.tsx`
  - Block IP button
  - Blocked IPs table

- [x] **6.11** Create `src/components/admin/ip-blocklist-table.tsx`
  - IP address column
  - Type badge column (single/range)
  - Reason column
  - Blocked by column
  - Status badge column
  - Expires column
  - Actions column (toggle, delete)

- [x] **6.12** Create `src/components/admin/ip-block-dialog.tsx`
  - IP address input
  - Type selector (single/range)
  - Reason textarea (optional)
  - Expiration date picker (optional)
  - Block/cancel buttons

---

## Phase 7: Admin Pages

### Tasks

- [x] **7.1** Create `src/app/[locale]/settings/layout.tsx`
  - Use `requireAdmin()` for protection
  - Basic layout wrapper

- [x] **7.2** Create `src/app/[locale]/settings/page.tsx`
  - Page title
  - Tabs component with 4 tabs:
    - Users (UsersTab)
    - Invitations (InvitationsTab)
    - Allowlist (AllowlistTab)
    - Security (SecurityTab)

- [x] **7.3** Create `src/app/[locale]/blocked/page.tsx`
  - "Access Blocked" message
  - Display user's IP address
  - Contact admin suggestion
  - No authentication required

---

## Phase 8: Navigation Update

### Tasks

- [x] **8.1** Update `src/components/site-header.tsx`:
  - Add state for admin check
  - Fetch admin status from `/api/admin/check`
  - Add Admin link (Shield icon) visible only to admins
  - Add to both desktop and mobile navigation

---

## Phase 9: Internationalization

### Tasks

- [x] **9.1** Add admin translations to `src/messages/en.json`:
  - `admin.title` - "Admin Settings"
  - `admin.tabs.*` - Tab labels
  - `admin.users.*` - User management strings
  - `admin.invitations.*` - Invitation strings
  - `admin.allowlist.*` - Allowlist strings
  - `admin.security.*` - Security/IP blocking strings
  - `admin.common.*` - Common action buttons

- [x] **9.2** Add admin translations to `src/messages/ro.json`:
  - Same structure as English

- [x] **9.3** Add blocked page translations:
  - `blocked.title` - "Access Blocked"
  - `blocked.message` - Explanation message
  - `blocked.contact` - Contact suggestion

---

## Phase 10: Middleware IP Blocking

### Tasks

- [x] **10.1** Update `src/proxy.ts`:
  - Add Layer 0 IP check at the beginning of `proxy()` function
  - Extract client IP from headers (x-forwarded-for, x-real-ip)
  - Call `/api/security/check-ip` endpoint
  - Exclude check-ip endpoint from blocking check (avoid loop)
  - Redirect blocked IPs to `/${locale}/blocked`

- [x] **10.2** Add `/blocked` to `sitePasswordPublicRoutes` in proxy.ts
  - Blocked users should see the blocked page without site password

---

## Phase 11: Login Tracking Integration

### Tasks

- [x] **11.1** Update Better Auth hooks in `src/lib/auth.ts`:
  - Add `after.signIn` hook
  - Call `syncUserRoleWithAdminEmails()` on login
  - Call `recordLoginEvent()` on login

---

## Phase 12: Final Validation

### Tasks

- [x] **12.1** Run `pnpm lint` and fix any issues
- [x] **12.2** Run `pnpm typecheck` and fix any type errors
- [ ] **12.3** Manually test all admin features:
  - User list, search, filter, pagination
  - User role display (synced with ADMIN_EMAILS)
  - User blocking
  - Invitation creation, copying, toggling, deletion
  - Allowlist add/remove
  - IP blocking, toggling, removal
  - Blocked page display
  - Navigation admin link visibility
- [ ] **12.4** Test with both English and Romanian locales
- [ ] **12.5** Test responsive design (mobile view)

---

## Files Summary

### New Files (~35)

| File | Description |
|------|-------------|
| `src/lib/types/admin.ts` | TypeScript interfaces |
| `src/hooks/use-admin.ts` | Admin hook |
| `src/app/api/admin/users/route.ts` | Users API |
| `src/app/api/admin/blocked-ips/route.ts` | IP blocking API |
| `src/app/api/admin/login-history/route.ts` | Login history API |
| `src/app/api/security/check-ip/route.ts` | IP check API |
| `src/app/api/admin/check/route.ts` | Admin check API |
| `src/app/[locale]/settings/layout.tsx` | Settings layout |
| `src/app/[locale]/settings/page.tsx` | Settings page |
| `src/app/[locale]/blocked/page.tsx` | Blocked page |
| `src/components/admin/users-tab.tsx` | Users tab |
| `src/components/admin/user-table.tsx` | Users table |
| `src/components/admin/user-edit-dialog.tsx` | Edit user dialog |
| `src/components/admin/invitations-tab.tsx` | Invitations tab |
| `src/components/admin/invitation-table.tsx` | Invitations table |
| `src/components/admin/invitation-create-dialog.tsx` | Create invitation dialog |
| `src/components/admin/allowlist-tab.tsx` | Allowlist tab |
| `src/components/admin/allowlist-table.tsx` | Allowlist table |
| `src/components/admin/allowlist-add-dialog.tsx` | Add email dialog |
| `src/components/admin/security-tab.tsx` | Security tab |
| `src/components/admin/ip-blocklist-table.tsx` | IP blocklist table |
| `src/components/admin/ip-block-dialog.tsx` | Block IP dialog |
| `drizzle/XXXX_admin_settings.sql` | Database migration |

### Modified Files (~10)

| File | Changes |
|------|---------|
| `src/lib/schema.ts` | Add columns + tables |
| `src/lib/authorization.ts` | Add new functions |
| `src/lib/auth.ts` | Add login hooks |
| `src/app/api/admin/invitation-codes/route.ts` | Add DELETE |
| `src/components/site-header.tsx` | Add admin link |
| `src/messages/en.json` | Add admin section |
| `src/messages/ro.json` | Add admin section |
| `src/proxy.ts` | Add IP blocking layer |
