# Admin Features Guide

## New Features Added

### 1. System Notifications
Send notifications to users directly from the admin dashboard.

### 2. User Suspension & Management
Suspend, activate, or permanently delete users.

---

## System Notifications

### Location
Admin Dashboard → **Send Notifications** tab

### Features

#### Recipient Options
- **All Users** - Send to everyone on the platform
- **All Patients** - Send to all patients only
- **All Providers** - Send to all healthcare providers only
- **All Admins** - Send to all administrators only
- **Specific User** - Send to one user by their ID

#### Notification Types
- **General** - Standard notifications
- **Announcement** - Important announcements
- **Warning** - Warning messages
- **Maintenance** - System maintenance notices
- **System Update** - Feature updates and changes

#### Quick Templates
Pre-written templates for common notifications:
- Maintenance Notice
- Feature Update
- Thank You Message
- Profile Update Reminder

### How to Use

1. Go to **Send Notifications** tab
2. Select recipient type
3. Choose notification type
4. Write your message (or use a template)
5. Click **Send Notification**

### Example Use Cases

**Maintenance Notice:**
```
Recipients: All Users
Type: Maintenance
Message: System maintenance scheduled for tonight at 11 PM. 
Services may be temporarily unavailable.
```

**Provider Update:**
```
Recipients: All Providers
Type: Announcement
Message: New payment structure implemented. Check your 
dashboard for updated earnings information.
```

**Individual Notice:**
```
Recipients: Specific User (ID: 42)
Type: Warning
Message: Please update your profile information within 
48 hours to continue using the platform.
```

---

## User Suspension & Management

### Location
Admin Dashboard → **User Suspension** tab

### Features

#### Search & Filter
- **Search** - Find users by name, email, or ID
- **Filter by Role** - Patient, Provider, Admin
- **Filter by Status** - Active, Suspended, Pending

#### User Actions

##### 1. Suspend User
- Prevents user from logging in
- User receives notification about suspension
- Can be reversed by activating the user
- **Use when:** Temporary account restriction needed

##### 2. Activate User
- Restores access to suspended accounts
- User receives notification about activation
- **Use when:** Lifting suspension or approving pending accounts

##### 3. Delete User
- **PERMANENT** - Cannot be undone
- Removes user and all associated data
- Requires typing "DELETE" to confirm
- Admin cannot delete themselves
- **Use when:** Removing spam accounts or permanent bans

### How to Use

#### Suspending a User
1. Go to **User Suspension** tab
2. Find the user (use search/filters)
3. Click **Suspend** button
4. Confirm the action
5. User is immediately suspended

#### Activating a User
1. Filter by Status: **Suspended**
2. Find the user
3. Click **Activate** button
4. User can now login

#### Deleting a User
1. Find the user
2. Click **Delete** button
3. Review user information in modal
4. Type **DELETE** (in capitals)
5. Click **Delete Permanently**

### Safety Features

- Admins cannot suspend or delete themselves
- Delete requires typing "DELETE" to confirm
- All actions are logged
- Users receive notifications about status changes

### User Information Displayed

- **ID** - Unique user identifier
- **Name** - User's full name
- **Email** - Contact email
- **Role** - Patient, Provider, or Admin
- **Status** - Active, Suspended, or Pending
- **Joined** - Account creation date

---

## API Endpoints

### Send Notifications
```
POST /api/admin/notifications/send
Body: {
  recipientType: 'all' | 'patient' | 'provider' | 'admin' | 'custom',
  customUserId: number (required if recipientType is 'custom'),
  message: string,
  notificationType: 'general' | 'announcement' | 'warning' | 'maintenance' | 'update'
}
```

### Get All Users
```
GET /api/admin/users/all
Returns: Array of all users with their details
```

### Suspend User
```
POST /api/admin/users/:id/suspend
```

### Activate User
```
POST /api/admin/users/:id/activate
```

### Delete User
```
DELETE /api/admin/users/:id
```

---

## Best Practices

### Notifications
1. **Be Clear** - Write concise, actionable messages
2. **Choose Right Type** - Use appropriate notification types
3. **Target Audience** - Send to relevant user groups only
4. **Test First** - Send to yourself first for important announcements

### User Management
1. **Suspend First** - Try suspension before deletion
2. **Document Reasons** - Keep records of why users were suspended/deleted
3. **Communicate** - Users receive automatic notifications, but consider additional communication for serious issues
4. **Review Regularly** - Check suspended accounts periodically

### Security
1. **Verify Identity** - Confirm user identity before taking action
2. **Check Impact** - Consider if user has active bookings before suspension
3. **Backup Data** - Export user data before deletion if needed
4. **Audit Trail** - Monitor who performs admin actions

---

## Troubleshooting

### "Failed to send notification"
- Check database connection
- Verify recipient type is valid
- Ensure message is not empty

### "Cannot suspend user"
- You cannot suspend yourself
- Check if user exists
- Verify admin permissions

### "Delete button disabled"
- User may have active bookings
- Check if you're trying to delete yourself
- Verify admin permissions

### No users showing in suspension tab
- Check your filters
- Verify database connection
- Refresh the page

---

## User Notifications

When you take actions, users receive these notifications:

### Suspension
> "Your account has been suspended. Please contact support for more information."

### Activation
> "Your account has been reactivated. You can now login and use the platform."

### Custom Notifications
> [Your custom message]

---

## Quick Reference

| Action | Reversible | User Notified | Requires Confirmation |
|--------|-----------|---------------|---------------------|
| Send Notification | N/A | Yes | No |
| Suspend User | Yes | Yes | Yes (browser confirm) |
| Activate User | Yes | Yes | No |
| Delete User | **NO** | No | Yes (type DELETE) |

---

## Support

For issues or questions about these features:
1. Check this documentation
2. Review the troubleshooting section
3. Check browser console for errors
4. Contact system administrator
