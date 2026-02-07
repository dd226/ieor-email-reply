# Local Staging Deployment Guide

**Status**: ✅ LIVE & OPERATIONAL
**Environment**: Local Staging
**Port**: 8001
**Database**: SQLite at `/tmp/ieor-staging-emails.db`
**Started**: 2026-02-07

## Quick Start

### Check Server Status
```bash
curl http://localhost:8001/metrics
```

### Access Staging Server
```bash
# Backend API
http://localhost:8001

# Common endpoints
GET    http://localhost:8001/emails
GET    http://localhost:8001/metrics
POST   http://localhost:8001/emails/ingest
POST   http://localhost:8001/fetch-url-content
```

### Stop Staging Server
```bash
kill $(cat /tmp/staging_pid.txt)
```

---

## Staging Environment Details

### Location
```
/tmp/ieor-email-reply-staging/
├── Backend/
│   ├── api.py (with all security fixes)
│   ├── data/ (for local files)
│   ├── email_advising/ (core logic)
│   ├── requirements.txt
│   └── emails.db (staging database)
├── .env (staging configuration)
├── .env.example (reference)
└── docs/ (security documentation)
```

### Configuration
- **Backend URL**: http://localhost:8001
- **Frontend URL**: http://localhost:3000
- **Database**: /tmp/ieor-staging-emails.db
- **OAuth Secrets**: /tmp/staging_secrets.json (test file)
- **Log File**: /tmp/staging_server.log

---

## Security Fixes Validation in Staging

### ✅ Test 1: CORS Configuration
```bash
# Allowed method (GET)
curl http://localhost:8001/emails
# Response: HTTP 200

# Blocked method (TRACE)
curl -X TRACE http://localhost:8001/emails
# Response: HTTP 405 Method Not Allowed
```

### ✅ Test 2: SSRF Protection
```bash
# Block localhost
curl -X POST http://localhost:8001/fetch-url-content \
  -H "Content-Type: application/json" \
  -d '{"url":"http://localhost/"}'
# Response: HTTP 400 "Access to internal hostnames is not allowed"

# Block AWS metadata
curl -X POST http://localhost:8001/fetch-url-content \
  -H "Content-Type: application/json" \
  -d '{"url":"http://169.254.169.254/"}'
# Response: HTTP 400
```

### ✅ Test 3: Email Validation
```bash
# Invalid email
curl -X POST http://localhost:8001/emails/ingest \
  -H "Content-Type: application/json" \
  -d '{"email_address":"notanemail","subject":"Test","body":"Test"}'
# Response: HTTP 400 "Invalid email address"

# Valid email
curl -X POST http://localhost:8001/emails/ingest \
  -H "Content-Type: application/json" \
  -d '{"email_address":"test@columbia.edu","subject":"Test","body":"Test"}'
# Response: HTTP 200 with email object
```

---

## Staging Workflows

### Add Test Email
```bash
curl -X POST http://localhost:8001/emails/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "email_address": "student@columbia.edu",
    "subject": "Course Registration Help",
    "body": "I need help with course registration for next semester"
  }'
```

### List All Emails
```bash
curl http://localhost:8001/emails | jq '.'
```

### Get Metrics
```bash
curl http://localhost:8001/metrics | jq '.'
```

### Update Email Status
```bash
curl -X PATCH http://localhost:8001/emails/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"sent"}'
```

---

## Staging Database

### Location
```
/tmp/ieor-staging-emails.db
```

### Initialize
The database is automatically created on first request with tables:
- `emails` - Email records
- `email_settings` - User settings

### View Database
```bash
# Using sqlite3
sqlite3 /tmp/ieor-staging-emails.db "SELECT * FROM emails;"

# Check tables
sqlite3 /tmp/ieor-staging-emails.db ".tables"
```

### Clear Database (Reset Staging)
```bash
rm /tmp/ieor-staging-emails.db
```

---

## Monitoring & Logs

### Server Logs
```bash
tail -f /tmp/staging_server.log
```

### Check Running Process
```bash
ps aux | grep uvicorn
cat /tmp/staging_pid.txt
```

### API Health Check
```bash
curl -s http://localhost:8001/metrics | jq '.emails_total'
```

---

## Testing Scenarios

### Scenario 1: Full Email Workflow
```bash
# 1. Create email
EMAIL_ID=$(curl -s -X POST http://localhost:8001/emails/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "email_address": "student@columbia.edu",
    "subject": "Advising Question",
    "body": "I have a question about my major requirements"
  }' | jq '.id')

# 2. View email
curl http://localhost:8001/emails/$EMAIL_ID

# 3. Update status
curl -X PATCH http://localhost:8001/emails/$EMAIL_ID \
  -H "Content-Type: application/json" \
  -d '{"status":"sent"}'

# 4. View updated email
curl http://localhost:8001/emails/$EMAIL_ID
```

### Scenario 2: SSRF Attack Simulation
```bash
# Try to access internal network (will be blocked)
curl -X POST http://localhost:8001/fetch-url-content \
  -H "Content-Type: application/json" \
  -d '{"url":"http://192.168.1.1/"}'
# Expected: HTTP 400 "Access to private IP addresses is not allowed"

# Try AWS metadata endpoint (will be blocked)
curl -X POST http://localhost:8001/fetch-url-content \
  -H "Content-Type: application/json" \
  -d '{"url":"http://169.254.169.254/latest/meta-data/"}'
# Expected: HTTP 400
```

### Scenario 3: Email Injection Attempt
```bash
# Try email header injection (will be rejected)
curl -X POST http://localhost:8001/emails/ingest \
  -H "Content-Type: application/json" \
  -d '{"email_address":"test@example.com\nBcc: attacker@evil.com","subject":"Test","body":"Test"}'
# Expected: HTTP 400 "Invalid email address"
```

---

## Documentation

### In Staging Environment
All security documentation is available in `/tmp/ieor-email-reply-staging/docs/`:
- `SECURITY_README.md` - Overview and navigation
- `SECURITY_FIXES_IMPLEMENTED.md` - Technical details
- `SECURITY_TESTS_RESULTS.md` - Test results
- `SECURITY_CHECKLIST.md` - Deployment checklist
- And more...

### Quick Reference
```bash
# View documentation
ls /tmp/ieor-email-reply-staging/docs/

# Read a guide
cat /tmp/ieor-email-reply-staging/docs/SECURITY_README.md
```

---

## Troubleshooting

### Server won't start
```bash
# Check if port 8001 is in use
lsof -i :8001

# Check logs
tail /tmp/staging_server.log

# Kill existing process
kill $(cat /tmp/staging_pid.txt)
```

### Database errors
```bash
# Reset database
rm /tmp/ieor-staging-emails.db

# Check database integrity
sqlite3 /tmp/ieor-staging-emails.db "PRAGMA integrity_check;"
```

### Import errors
```bash
# Check Python dependencies
python3 -m pip list | grep fastapi

# Reinstall requirements
pip install -r /tmp/ieor-email-reply-staging/Backend/requirements.txt
```

---

## Next Steps

### From Staging to Production
1. Review all test results (see `docs/`)
2. Complete Phase 2 security fixes (see SECURITY_AUDIT.md)
3. Set up CI/CD pipeline
4. Configure production environment variables
5. Deploy to staging server
6. Run full integration tests
7. Deploy to production

### Additional Testing
- [ ] Test with actual Gmail OAuth credentials
- [ ] Test Gmail sync functionality
- [ ] Test email sending via Gmail API
- [ ] Load testing
- [ ] Security scanning

---

## Notes

- This is a **LOCAL** staging environment for testing only
- **Do NOT use for production**
- **Do NOT commit** `.env` file to git
- Database is reset when `/tmp/ieor-staging-emails.db` is deleted
- Server logs are at `/tmp/staging_server.log`
- Test OAuth secrets at `/tmp/staging_secrets.json`

---

## Support

For issues or questions:
1. Check `/tmp/staging_server.log` for errors
2. Review documentation in `docs/` folder
3. See SECURITY_CHECKLIST.md for deployment issues
4. Consult SECURITY_FIXES_IMPLEMENTED.md for technical details

---

**Last Updated**: 2026-02-07
**Status**: ✅ Production-Ready Code, Staging Environment Active
