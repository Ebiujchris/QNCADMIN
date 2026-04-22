# QNC SOLUTIONS - Admin Panel

A comprehensive admin panel for managing the QNC Solutions healthcare booking system.

## 🛡️ Admin Panel Features

### **Authentication & Security**
- Secure admin login with role verification
- Admin registration with access codes
- Protected routes for admin-only access
- Session management with JWT tokens

### **Dashboard Overview**
- **System Statistics**: Total bookings, users, revenue tracking
- **Real-time Monitoring**: Pending bookings, system health
- **Quick Actions**: Refresh data, generate reports, system settings

### **Core Admin Functions**

#### 🚨 **Pending Bookings Management**
- View all pending booking requests
- Assign qualified providers based on service type
- Urgency level indicators (Normal, Urgent, Emergency)
- Patient and booking details review
- Provider assignment with automatic notifications

#### 📋 **All Bookings Overview**
- Complete booking history and tracking
- Advanced filtering by status and search
- Booking status management (Pending → Assigned → Paid → Completed)
- Provider assignment tracking
- Service completion monitoring

#### 👥 **User Management**
- User statistics and analytics
- Provider specialization breakdown
- Active provider management
- User growth insights and ratios
- Provider verification and status tracking

#### 💰 **Payment Management**
- Revenue tracking and analytics
- Payment history and records
- Payment method management
- Revenue insights and growth metrics
- Payment processing and refund management

### **Admin Responsibilities**

1. **Booking Assignment**
   - Review incoming booking requests
   - Match patients with qualified providers
   - Ensure proper service type alignment
   - Monitor urgency levels and prioritize accordingly

2. **System Monitoring**
   - Track system performance and health
   - Monitor user activity and engagement
   - Oversee payment processing and revenue
   - Manage provider network and availability

3. **Quality Control**
   - Ensure service quality standards
   - Monitor completion rates and feedback
   - Handle disputes and issues
   - Maintain system integrity

4. **Reporting & Analytics**
   - Generate system reports
   - Track key performance indicators
   - Monitor growth metrics
   - Analyze user behavior and trends

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js (v16+)
- Backend API running on port 5000
- Admin access credentials

### **Installation**
```bash
cd QNCADMIN
npm install
```

### **Development**
```bash
npm run dev
```
Admin panel runs on: http://localhost:3001

### **Default Admin Credentials**
- **Email**: admin@qnc.com
- **Password**: admin123
- **Registration Code**: QNC2024ADMIN

## 🔧 **Configuration**

### **API Integration**
- Backend API: http://localhost:5000
- Automatic proxy configuration for `/api` routes
- JWT token authentication
- Role-based access control

### **Admin Registration**
- Requires admin registration code: `QNC2024ADMIN`
- Only users with admin role can access the panel
- Secure session management

## 📊 **Admin Workflow**

### **Daily Operations**
1. **Login** to admin panel
2. **Review** pending bookings (priority)
3. **Assign** providers to new requests
4. **Monitor** system statistics and health
5. **Handle** any issues or disputes

### **Assignment Process**
1. **View** pending booking details
2. **Review** patient requirements and urgency
3. **Select** qualified provider from filtered list
4. **Assign** provider with automatic notifications
5. **Track** booking progress through completion

### **Monitoring Tasks**
- Check system health indicators
- Review user growth and engagement
- Monitor payment processing
- Track provider network status
- Generate reports as needed

## 🎨 **UI Features**

### **Modern Design**
- Clean, professional interface
- Responsive design for all devices
- Intuitive navigation and workflows
- Real-time data updates

### **User Experience**
- Toast notifications for all actions
- Loading states for async operations
- Comprehensive error handling
- Quick action buttons and shortcuts

### **Data Visualization**
- Statistics cards and metrics
- Progress bars and indicators
- Status badges and color coding
- Tabular data with filtering

## 🔒 **Security Features**

- **Role-based Access**: Only admin users can access
- **Protected Routes**: Authentication required for all pages
- **Secure Sessions**: JWT token management
- **Access Logging**: All admin actions are tracked
- **Registration Control**: Admin code required for new accounts

## 📱 **Responsive Design**

The admin panel is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices
- Various screen sizes and orientations

## 🚀 **Production Deployment**

```bash
npm run build
# Deploy dist/ folder to your hosting service
```

## 📞 **Support**

For admin panel support or issues:
- Check system logs and error messages
- Verify backend API connectivity
- Ensure proper admin credentials
- Contact system administrator if needed

---

**QNC Solutions Admin Panel** - Comprehensive healthcare system management