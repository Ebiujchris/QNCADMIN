# Setup Guide - Admin Notifications & User Suspension

## Quick Start

These features are **ready to use** - no database migrations required! The existing database schema already supports these features.

## What's New

### 1. System Notifications Tab
Send notifications to any user or group of users from the admin dashboard.

### 2. User Suspension Tab
Manage user accounts - suspend, activate, or delete users.

## How to Access

1. Login to admin dashboard at `/admin/login`
2. Look for two new tabs in the navigation:
   - **Send Notifications**
   - **User Suspension**

## Features Overview

### Send Notifications
- Broadcast to all users or specific groups
- Choose notification types (general, announcement, warning, etc.)
- Quick templates for common messages
- See recipient count before sending

### User Suspension
- Search and filter users by role and status
- Suspend users (prevents login)
- Activate suspended users
- Permanently delete users (requires confirmation)
- View user details (ID, name, email, role, status, join date)

## No Setup Required!

These features use the existing `notifications` and `users` tables. Just start using them!

## Testing the Features

### Test Notifications
1. Go to **Send Notifications** tab
2. Select "Specific User" and enter your user ID
3. Write a test message
4. Click "Send Notification"
5. Check your notifications in your dashboard

### Test User Suspension
1. Go to **User Suspension** tab
2. Find a test user account
3. Click "Suspend" to test suspension
4. Click "Activate" to restore access
5. Try logging in as that user to verify

## Important Notes

- You cannot suspend or delete yourself
- Deleted users cannot be recovered
- All actions send automatic notifications to affected users
- Suspended users cannot login but their data remains

## API Endpoints Added

```
POST   /api/admin/notifications/send    - Send system notifications
GET    /api/admin/users/all             - Get all users
POST   /api/admin/users/:id/suspend     - Suspend a user
POST   /api/admin/users/:id/activate    - Activate a user
DELETE /api/admin/users/:id             - Delete a user permanently
```

## Security Features

- Admin authentication required for all endpoints
- Admins cannot suspend/delete themselves
- Delete requires typing "DELETE" to confirm
- All status changes are logged with timestamps

## Next Steps

1. Login to admin dashboard
2. Explore the new tabs
3. Send a test notification to yourself
4. Review the full guide: `QNCADMIN/ADMIN-FEATURES-GUIDE.md`

## Support

For detailed usage instructions, see:
- `QNCADMIN/ADMIN-FEATURES-GUIDE.md` - Complete feature documentation
- Check browser console for any errors
- Verify backend server is running
