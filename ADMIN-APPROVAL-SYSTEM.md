# QNC Solutions Admin Approval System

## Overview
The QNC Solutions healthcare booking system now implements a secure admin approval process to ensure only authorized personnel can access administrative functions.

## How It Works

### 1. First Admin Account
- The very first admin account registered is automatically approved
- This ensures there's always at least one admin to approve subsequent requests
- No approval process needed for the first admin

### 2. Subsequent Admin Requests
- All additional admin registration requests require approval
- New admin accounts are created with `status: 'pending'`
- Existing admins receive notifications about new requests
- Pending accounts cannot login until approved

### 3. Approval Process
1. User registers for admin access via `/register`
2. Account is created with pending status
3. Admin request record is created in `admin_requests` table
4. Existing admins are notified
5. Admins can view pending requests in the dashboard
6. Admins can approve or reject requests
7. User is notified of the decision

## Admin Dashboard Features

### Admin Requests Tab (🔐)
- View all pending admin access requests
- See requester details and reason for access
- Approve or reject requests with one click
- Real-time updates and notifications

### Key Information Displayed
- Requester name and email
- Request reason/justification
- Request date
- User account creation date
- Request ID for tracking

## Database Schema

### Users Table
- Added `status` field: 'active', 'pending', 'suspended'
- Pending users cannot login

### Admin Requests Table
```sql
CREATE TABLE admin_requests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    requested_by VARCHAR(255) NOT NULL,
    request_reason TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    approved_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoints

### Admin Approval Endpoints
- `GET /api/admin/admin-requests` - Get pending requests
- `POST /api/admin/admin-requests/:id/approve` - Approve request
- `POST /api/admin/admin-requests/:id/reject` - Reject request

### Authentication Updates
- Login now checks user status
- Pending users receive appropriate error message
- Registration creates approval request for non-first admins

## Security Features

1. **No Default Credentials**: Removed hardcoded admin accounts
2. **Approval Required**: All new admins must be approved
3. **Audit Trail**: All approval actions are logged
4. **Status Tracking**: User status prevents unauthorized access
5. **Notifications**: Real-time alerts for new requests

## Usage Instructions

### For New Admins
1. Go to admin panel registration page
2. Fill out the form with detailed reason for access
3. Submit request
4. Wait for approval notification
5. Login once approved

### For Existing Admins
1. Check dashboard for notification badges
2. Navigate to "Admin Requests" tab
3. Review pending requests carefully
4. Approve or reject based on legitimacy
5. Users are automatically notified

## Testing the System

1. **First Admin**: Register first admin account (auto-approved)
2. **Second Admin**: Register another admin (requires approval)
3. **Login Test**: Try logging in with pending account (should fail)
4. **Approval Test**: Approve the request from first admin
5. **Login Success**: Second admin can now login

## Benefits

- **Enhanced Security**: No unauthorized admin access
- **Accountability**: All admin accounts are vetted
- **Audit Trail**: Complete record of who approved whom
- **Flexibility**: Easy to approve legitimate requests
- **Scalability**: System works for any number of admins

## Notifications

The system sends notifications for:
- New admin requests (to existing admins)
- Request approved (to requester)
- Request rejected (to requester)

All notifications appear in the user's notification center within the application.