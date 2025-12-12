# Admin Settings - Requirements

## Overview

Implementation of an Admin Settings page (`/settings`) accessible only to users defined in the `ADMIN_EMAILS` environment variable, providing comprehensive user management, invitation system UI, and IP blocking capabilities.

---

## Functional Requirements

### FR1: Admin Access Control

- **FR1.1:** The settings page must be accessible only to users whose email is listed in `ADMIN_EMAILS` environment variable
- **FR1.2:** Non-admin users attempting to access `/settings` must be redirected to `/unauthorized`
- **FR1.3:** Admin link in navigation must only be visible to admin users

### FR2: User Roles System

- **FR2.1:** Two roles: `admin` and `user`
- **FR2.2:** Role stored in database `user` table (column: `role`)
- **FR2.3:** `ADMIN_EMAILS` env var remains the single source of truth for admin status
- **FR2.4:** User role syncs automatically on login based on `ADMIN_EMAILS`
- **FR2.5:** Admins can view but not manually change admin status (controlled by env var)

### FR3: User Management

- **FR3.1:** List all registered users with:
  - Name
  - Email
  - Role (badge)
  - Registration date
  - Last login date and IP
  - Status (active/blocked)
- **FR3.2:** Search users by name or email
- **FR3.3:** Filter users by role
- **FR3.4:** Pagination for user list
- **FR3.5:** Block/unblock user access
- **FR3.6:** View user login history

### FR4: Invitation System UI

- **FR4.1:** List all invitation codes with:
  - Code (with copy button)
  - Creator email
  - Max uses / Current uses
  - Status (active/used/expired/deactivated)
  - Expiration date
  - Creation date
- **FR4.2:** Generate new invitation codes with options:
  - Maximum uses (1-1000, default: 1)
  - Expiration date (optional)
- **FR4.3:** Copy code to clipboard
- **FR4.4:** Activate/deactivate codes
- **FR4.5:** Delete codes

### FR5: Email Allowlist UI

- **FR5.1:** List all allowed emails with:
  - Email address
  - Added by (admin email)
  - Note
  - Creation date
- **FR5.2:** Add email to allowlist with optional note
- **FR5.3:** Remove email from allowlist

### FR6: IP Blocking System

- **FR6.1:** Block specific IP addresses
- **FR6.2:** Block IP ranges (CIDR notation)
- **FR6.3:** List blocked IPs with:
  - IP address/range
  - Type (single/range)
  - Reason
  - Blocked by (admin email)
  - Status (active/inactive/expired)
  - Expiration date (optional)
- **FR6.4:** Activate/deactivate IP blocks
- **FR6.5:** Remove IP blocks
- **FR6.6:** IP blocking applies globally (middleware level) before any other checks
- **FR6.7:** Blocked IPs see a dedicated `/blocked` page

### FR7: Last Login Tracking

- **FR7.1:** Track login timestamp for each user
- **FR7.2:** Track IP address used during login
- **FR7.3:** Track user agent (browser info)
- **FR7.4:** Display last login info in user list

---

## Non-Functional Requirements

### NFR1: Security

- All admin endpoints require admin authentication
- IP blocking check runs at middleware level (Layer 0)
- Admin status determined server-side only

### NFR2: Performance

- User list pagination (default 20 per page)
- Efficient database queries with indexes

### NFR3: Internationalization

- Support for English (en) and Romanian (ro)
- All UI text externalized to translation files

### NFR4: UI/UX

- Use existing shadcn/ui components
- Tabs for different admin sections
- Confirmation dialogs for destructive actions
- Loading states for async operations
- Toast notifications for feedback

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Admin source of truth | `ADMIN_EMAILS` env var | Security - not stored in database |
| IP blocking location | Middleware (Layer 0) | Blocks before any page/API access |
| Blocked users page | Dedicated `/blocked` page | Clear user feedback |
| Role sync | On login | Keeps DB in sync with env var |

---

## Out of Scope

- Unit testing
- E2E testing
- Email notifications
- Audit logging (beyond login history)
- Two-factor authentication
- API rate limiting
