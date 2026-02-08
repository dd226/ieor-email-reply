# IEOR Email Reply - Services Setup Guide

## ✅ Current Status

Both services are **RUNNING** and **CONFIGURED** for persistent operation:

### Backend FastAPI Server
- **Status**: ✅ Running
- **Process**: `uvicorn Backend.api:app --port 8001`
- **URL**: http://localhost:8001
- **API Docs**: http://localhost:8001/docs
- **Metrics**: http://localhost:8001/metrics
- **Port**: 8001

### Frontend Next.js Application
- **Status**: ✅ Running
- **Process**: `npm start` (production build)
- **URL**: http://localhost:3000
- **Port**: 3000

---

## 🔄 Persistent Services (macOS)

Both services are configured as **LaunchAgent** services that:
- ✅ Auto-start on system reboot
- ✅ Auto-restart if they crash
- ✅ Log output to `~/Library/Logs/`

### Service Configuration Files

1. **Backend Service**
   - Location: `/Users/dd226/Library/LaunchAgents/com.ieor.emailreply.backend.plist`
   - Status: Loaded
   - Port: 8001

2. **Frontend Service**
   - Location: `/Users/dd226/Library/LaunchAgents/com.ieor.emailreply.frontend.plist`
   - Status: Loaded
   - Port: 3000

---

## 🛠️ Managing Services

### Check Service Status
```bash
launchctl list | grep ieor
```

### Stop Backend Service
```bash
launchctl stop com.ieor.emailreply.backend
```

### Stop Frontend Service
```bash
launchctl stop com.ieor.emailreply.frontend
```

### Start Backend Service
```bash
launchctl start com.ieor.emailreply.backend
```

### Start Frontend Service
```bash
launchctl start com.ieor.emailreply.frontend
```

### Reload Service Configuration
```bash
launchctl unload /Users/dd226/Library/LaunchAgents/com.ieor.emailreply.backend.plist
launchctl load /Users/dd226/Library/LaunchAgents/com.ieor.emailreply.backend.plist
```

---

## 📊 Service Logs

### Backend Logs
```bash
# Standard output
tail -f ~/Library/Logs/ieor-emailreply-backend.log

# Error output
tail -f ~/Library/Logs/ieor-emailreply-backend-error.log
```

### Frontend Logs
```bash
# Standard output
tail -f ~/Library/Logs/ieor-emailreply-frontend.log

# Error output
tail -f ~/Library/Logs/ieor-emailreply-frontend-error.log
```

---

## 🔑 Environment Configuration

### Backend Environment Variables
The backend uses `.env` file for configuration:

**Required:**
- `GOOGLE_OAUTH_CLIENT_FILE` - Path to Google OAuth credentials (currently commented out)
- `FRONTEND_URL` - Frontend URL for OAuth redirects (set to `http://localhost:3000`)

**Optional:**
- `DATABASE_URL` - Database connection string (defaults to `./emails.db`)
- `DEBUG` - Debug mode (defaults to `false`)

**Current .env file location:**
```
/Users/dd226/ieor-email-reply/.env
```

### Add Google OAuth Credentials
1. Download `google_client_secrets.json` from Google Cloud Console
2. Update `.env` file:
   ```
   GOOGLE_OAUTH_CLIENT_FILE=/path/to/google_client_secrets.json
   ```
3. Restart backend service:
   ```bash
   launchctl stop com.ieor.emailreply.backend
   launchctl start com.ieor.emailreply.backend
   ```

---

## 🔍 Testing Services

### Backend Health Check
```bash
curl http://localhost:8001/metrics
```

Expected response (JSON):
```json
{
  "emails_total": 2,
  "emails_today": 2,
  "auto_count": 0,
  "review_count": 2,
  "sent_count": 0,
  "avg_confidence": 0.1,
  "avg_auto_confidence": 0.0
}
```

### Frontend Health Check
```bash
curl http://localhost:3000
```

Should return HTML page with application interface.

---

## 📝 Manual Service Start (if needed)

If services are not running for any reason, you can start them manually:

### Start Backend
```bash
cd /Users/dd226/ieor-email-reply
python3 -m uvicorn Backend.api:app --port 8001
```

### Start Frontend
```bash
cd /Users/dd226/ieor-email-reply/Frontend/code
npm start
```

---

## 🚀 System Reboot

After system reboot:
1. Both services will automatically start (within 30 seconds)
2. Check launchctl status: `launchctl list | grep ieor`
3. Verify running: `ps aux | grep -E "uvicorn|next-server"`
4. Access frontend: http://localhost:3000

---

## 🐛 Troubleshooting

### Service not starting?
1. Check logs: `tail ~/Library/Logs/ieor-emailreply-*.log`
2. Verify service is loaded: `launchctl list | grep ieor`
3. Try manual start to see error: `python3 -m uvicorn Backend.api:app --port 8001`

### Port already in use?
```bash
# Check what's using the port
lsof -i :8001  # For backend
lsof -i :3000  # For frontend

# Kill the process (if needed)
kill -9 <PID>
```

### Frontend not connecting to backend?
1. Verify backend is running: `curl http://localhost:8001/metrics`
2. Check frontend logs: `tail ~/Library/Logs/ieor-emailreply-frontend-error.log`
3. Verify CORS is configured in backend (check `Backend/api.py` line 115-121)

---

**Last Updated**: February 7, 2026
**Setup Status**: ✅ Complete
