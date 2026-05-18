# Admin Dashboard - Quick Reference Card

## 🚀 New Features

### 1. Provider Payment (Requires Setup)
**Setup:** `cd QNCBE && node scripts/add-provider-payment-migration.js`

**What:** Set different amounts for client payment vs provider payment

**Where:** Pending Bookings → Assign Provider → Provider Payment field

**Example:**
- Client pays: UGX 150,000
- Provider gets: UGX 120,000
- Platform keeps: UGX 30,000

---

### 2. Send Notifications (Ready to Use)
**Where:** Admin Dashboard → Send Notifications tab

**Recipients:**
- All Users
- All Patients
- All Providers  
- All Admins
- Specific User (by ID)

**Types:**
- General
- Announcement
- Warning
- Maintenance
- System Update

**Quick Templates Available:** Yes (4 templates)

---

### 3. User Suspension (Ready to Use)
**Where:** Admin Dashboard → User Suspension tab

**Actions:**
- **Suspend** - Block login (reversible)
- **Activate** - Restore access
- **Delete** - Permanent removal (type DELETE to confirm)

**Search/Filter:**
- By name, email, or ID
- By role (patient/provider/admin)
- By status (active/suspended/pending)

**Safety:**
- Cannot suspend/delete yourself
- Delete requires typing "DELETE"
- Users get notified automatically

---

## 📋 Dashboard Tabs

1. Overview - Stats
2. Pending Bookings - Assign providers ⭐ (now with provider payment)
3. Provider Apps - Approve providers
4. Admin Requests - Approve admins
5. All Bookings - View all
6. Users - User stats
7. Payments - Payment management
8. **Send Notifications** ⭐ NEW
9. **User Suspension** ⭐ NEW

---

## 🔑 Common Tasks

### Assign Provider with Custom Payment
1. Pending Bookings tab
2. Click "Assign Provider"
3. Select provider
4. Enter rate per day
5. Enter number of days
6. **Enter provider payment** ⭐
7. Assign

### Send Announcement to All Users
1. Send Notifications tab
2. Recipients: "All Users"
3. Type: "Announcement"
4. Write message
5. Send

### Suspend a User
1. User Suspension tab
2. Search for user
3. Click "Suspend"
4. Confirm

### Delete a User
1. User Suspension tab
2. Find user
3. Click "Delete"
4. Type "DELETE"
5. Confirm

---

## 🛡️ Safety Rules

- ❌ Cannot suspend yourself
- ❌ Cannot delete yourself
- ✅ Delete requires typing "DELETE"
- ✅ All actions notify users
- ✅ Suspend is reversible
- ❌ Delete is permanent

---

## 📚 Documentation

- `ADMIN-FEATURES-GUIDE.md` - Full feature guide
- `SETUP-NEW-FEATURES.md` - Setup instructions
- `PROVIDER-PAYMENT-FEATURE.md` - Provider payment guide
- `FEATURES-SUMMARY.md` - Complete summary

---

## 🆘 Quick Troubleshooting

**Provider payment not working?**
→ Run migration: `node scripts/add-provider-payment-migration.js`

**Notifications not sending?**
→ Check backend is running, verify message not empty

**Cannot suspend user?**
→ Check you're not suspending yourself

**User not found?**
→ Refresh the page, check filters

---

## 🎯 Best Practices

### Notifications
- Test on yourself first
- Be clear and concise
- Use appropriate type
- Target right audience

### User Management
- Suspend before deleting
- Document reasons
- Review regularly
- Communicate with users

### Provider Payment
- Set fair provider rates
- Consider platform costs
- Be consistent
- Review periodically

---

## 📞 Need Help?

1. Check documentation files
2. Review browser console
3. Check backend logs
4. Verify database connection
5. Test API endpoints

---

**Version:** 1.0  
**Last Updated:** 2026-05-18
