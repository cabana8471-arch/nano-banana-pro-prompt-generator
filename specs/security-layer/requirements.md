# Security Layer - Requirements

## Overview
Implement an additional security layer for Nano Banana Pro to restrict access to the entire application. The application runs on Vercel Free tier and contains personal API keys that should not be accessible to unauthorized users.

## Business Requirements

### Access Control
- Only authorized users should have access to the application
- Authorization can be granted via:
  1. Email allowlist (predefined list of allowed email addresses)
  2. Invitation codes (one-time or multi-use codes)

### Scope of Protection
- The **entire application** must be protected, including:
  - Homepage
  - All generator pages (photo, banner, logo)
  - Gallery (both private and public)
  - Profile and settings
  - All API endpoints

### Authentication Method
- **Combination approach:**
  - Global site password (first layer - before seeing anything)
  - Email allowlist (for pre-approved users)
  - Invitation codes (for granting access to new users)

### Public Gallery
- Public gallery should only be visible to authenticated AND authorized users
- No anonymous access to any part of the application

## Functional Requirements

### FR-1: Site Password Gate
- All visitors must enter a site-wide password before accessing any content
- Password stored as environment variable (`SITE_PASSWORD`)
- Successful verification creates a secure cookie (30-day expiry)
- Cookie-based verification (no database required for this layer)

### FR-2: Email Allowlist
- Administrators can add/remove email addresses from allowlist
- Users with emails on the allowlist are automatically authorized after Google OAuth login
- Allowlist stored in database for persistence

### FR-3: Invitation Codes
- Administrators can generate invitation codes
- Codes can have:
  - Usage limits (single-use or multi-use)
  - Expiration dates (optional)
  - Active/inactive status
- Users can redeem codes to gain access
- Code redemption tracked (who, when)

### FR-4: Admin Management
- Admin users defined via `ADMIN_EMAILS` environment variable
- Admins bypass all authorization checks
- Admins can:
  - View and manage email allowlist
  - Generate new invitation codes
  - Deactivate existing codes
  - View code usage statistics

### FR-5: Unauthorized Access Handling
- Users who authenticate but are not authorized see a dedicated page
- Page displays:
  - Their current email
  - Option to enter an invitation code
  - Instructions to contact admin
  - Option to sign out and try another account

## Non-Functional Requirements

### NFR-1: Vercel Free Tier Compatibility
- All features must work within Vercel Free tier limits
- No external services required (beyond existing PostgreSQL)
- Efficient database queries

### NFR-2: Security
- Site password hashed in cookies (not stored plain text)
- Invitation codes are 8 characters, alphanumeric (no ambiguous characters)
- All sensitive operations require authentication
- Admin endpoints protected with email verification

### NFR-3: User Experience
- Clear error messages for access denial
- Simple, branded UI for password and unauthorized pages
- Fast authentication flow (cookie-based checks in middleware)

## User Stories

### US-1: First-Time Visitor
As a first-time visitor, I need to enter the site password before I can see any content, so that the application remains private.

### US-2: Authorized User (Allowlist)
As a user whose email is on the allowlist, I want to be automatically authorized after Google login, so that I don't need an invitation code.

### US-3: New User with Invitation
As a new user with an invitation code, I want to redeem my code after Google login, so that I can gain access to the application.

### US-4: Administrator
As an administrator, I want to manage the allowlist and generate invitation codes, so that I can control who has access to the application.

### US-5: Unauthorized User
As a user who is not authorized, I want to see clear instructions on how to gain access, so that I know what to do next.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `SITE_PASSWORD` | Yes | Global password for site access (min 8 chars) |
| `ADMIN_EMAILS` | Yes | Comma-separated list of admin email addresses |

## Database Tables

### `allowed_emails`
Stores the email allowlist for automatic authorization.

### `invitation_codes`
Stores generated invitation codes with usage tracking.

### `user_access_status`
Tracks authorization status for each user.
