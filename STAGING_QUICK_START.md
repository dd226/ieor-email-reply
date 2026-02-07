# Staging Deployment - Quick Start Guide

## 🚀 Server Status

**Status**: ✅ LIVE & RUNNING
**URL**: http://localhost:8001
**PID**: See `/tmp/staging_pid.txt`
**Logs**: `/tmp/staging_server.log`

## 📍 Locations

| Item | Location |
|------|----------|
| Staging Root | `/tmp/ieor-email-reply-staging/` |
| Backend | `/tmp/ieor-email-reply-staging/Backend/` |
| Database | `/tmp/ieor-staging-emails.db` |
| Config | `/tmp/ieor-email-reply-staging/.env` |
| Docs | `/tmp/ieor-email-reply-staging/docs/` |

## 🔧 Common Commands

```bash
# Check server health
curl http://localhost:8001/metrics

# List emails
curl http://localhost:8001/emails

# Add test email
curl -X POST http://localhost:8001/emails/ingest \
  -H "Content-Type: application/json" \
  -d '{"email_address":"test@columbia.edu","subject":"Test","body":"Test"}'

# Test CORS (TRACE should be blocked)
curl -X TRACE http://localhost:8001/emails

# Test SSRF (localhost should be blocked)
curl -X POST http://localhost:8001/fetch-url-content \
  -H "Content-Type: application/json" \
  -d '{"url":"http://localhost/"}'

# View logs
tail -f /tmp/staging_server.log

# Stop server
kill $(cat /tmp/staging_pid.txt)
```

## ✅ Validation Status

| Test | Status | Details |
|------|--------|---------|
| Server Health | ✅ PASS | HTTP 200 on /metrics |
| CORS | ✅ PASS | TRACE blocked (HTTP 405) |
| SSRF | ✅ PASS | localhost blocked |
| Email Validation | ✅ PASS | Valid/invalid emails handled |
| Configuration | ✅ PASS | .env configured |

## 📖 Documentation

- **STAGING_DEPLOYMENT_GUIDE.md** - Full deployment guide
- **docs/SECURITY_README.md** - Security overview
- **docs/SECURITY_FIXES_IMPLEMENTED.md** - Technical details
- **docs/SECURITY_TESTS_RESULTS.md** - Test results

## ⚙️ Configuration

**File**: `/tmp/ieor-email-reply-staging/.env`

```
GOOGLE_OAUTH_CLIENT_FILE=/tmp/staging_secrets.json
FRONTEND_URL=http://localhost:3000
DATABASE_URL=sqlite:////tmp/ieor-staging-emails.db
DEBUG=true
```

## 🛑 Stop Staging

```bash
kill $(cat /tmp/staging_pid.txt)
```

## ⚠️ Important Notes

- ✓ **LOCAL ONLY** - Not pushed to GitHub
- ✓ **DEVELOPMENT** - Testing purposes only
- ✓ **NOT PRODUCTION** - Use Phase 2 fixes before production
- ⚠️ **ISOLATED** - No git repository or tracking
- ⚠️ **TEMPORARY** - Database resets on /tmp/ clear

---

**Created**: 2026-02-07
**Status**: OPERATIONAL ✅
