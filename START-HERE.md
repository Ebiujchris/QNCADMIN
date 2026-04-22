# 🚀 QNC Admin Panel - Quick Start

## ⚠️ IMPORTANT: Start Backend First!

Before running the admin panel, make sure the backend is running:

### 1. Start Backend Server
```bash
cd QNCBE
npm install
npm run setup-db  # Initialize database
npm run dev       # Start backend on port 5000
```

### 2. Start Admin Panel
```bash
cd QNCADMIN
npm install
npm run dev       # Start admin panel on port 3001
```

## 🔧 Troubleshooting API Errors

If you see **400 Bad Request** errors:

### Check Backend Status
1. **Backend must be running** on http://localhost:5000
2. **Database must be connected** (Neon PostgreSQL)
3. **API endpoints must be accessible**

### Test Backend Connection
```bash
# Test if backend is running
curl http://localhost:5000/api/health

# Should return: {"message": "QNC Booking API is running!"}
```

### Common Issues & Solutions

#### ❌ **API 400 Errors**
- **Cause**: Backend not running or database connection failed
- **Solution**: Start backend first, check database connection

#### ❌ **CORS Errors**
- **Cause**: Frontend trying to connect to backend on different port
- **Solution**: Vite proxy is configured, ensure backend is on port 5000

#### ❌ **Database Errors**
- **Cause**: Database not initialized or connection failed
- **Solution**: Run `npm run setup-db` in QNCBE folder

## 🔑 Default Admin Credentials

- **Email**: admin@qnc.com
- **Password**: admin123
- **Registration Code**: QNC2024ADMIN

## 📱 Access Points

- **Admin Panel**: http://localhost:3001
- **Backend API**: http://localhost:5000
- **Main App**: http://localhost:3000 (if running QNCFE)

## ✅ Startup Checklist

1. ✅ **Backend running** on port 5000
2. ✅ **Database connected** (Neon PostgreSQL)
3. ✅ **Admin panel running** on port 3001
4. ✅ **Can login** with admin credentials
5. ✅ **API calls working** (no 400 errors)

## 🆘 Still Having Issues?

### Check Backend Logs
```bash
cd QNCBE
npm run dev
# Look for database connection messages
```

### Check Network Tab
- Open browser DevTools → Network tab
- Look for failed API calls
- Check if calls are going to http://localhost:5000

### Verify Database
- Ensure Neon database is accessible
- Check DATABASE_URL in QNCBE/.env
- Run database setup script

## 🎯 Quick Test

1. **Start backend**: `cd QNCBE && npm run dev`
2. **Start admin panel**: `cd QNCADMIN && npm run dev`
3. **Open**: http://localhost:3001
4. **Login**: admin@qnc.com / admin123
5. **Check**: Dashboard loads without errors

---

**Need Help?** Make sure both backend and database are running before starting the admin panel!