# Security Audit Report
## Columbia IEOR Email Advising System

**Date:** February 7, 2026
**Project:** TestEmailSystem
**Audit Type:** Code Security Review

---

## Executive Summary

This is an email advising system for the Columbia IEOR department that uses Gmail OAuth integration, TF-IDF similarity matching, and automated response generation. The system has several **security vulnerabilities** that need to be addressed before production deployment.

**Critical Issues:** 5
**High Issues:** 7
**Medium Issues:** 6

---

## 🔴 CRITICAL ISSUES

### 1. **Overly Permissive CORS Configuration** (api.py:78-84)
**Severity:** CRITICAL
**Location:** `Backend/api.py:78-84`

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,  # ⚠️ Dangerous with wildcards
    allow_methods=["*"],      # ⚠️ ALL methods allowed
    allow_headers=["*"],      # ⚠️ ALL headers allowed
)
```

**Issues:**
- `allow_methods=["*"]` allows TRACE, CONNECT, and other dangerous HTTP methods
- `allow_headers=["*"]` is overly permissive
- While origins are restricted, this is still too loose for production

**Recommendation:**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],  # Explicit methods only
    allow_headers=["Content-Type", "Authorization"],    # Specific headers
)
```

---

### 2. **Insecure OAuth State Storage** (api.py:915)
**Severity:** CRITICAL
**Location:** `Backend/api.py:69-70, 915, 925`

```python
# In-memory store for OAuth flows keyed by state
oauth_flows: Dict[str, Flow] = {}
```

**Issues:**
- OAuth state tokens stored in memory are lost on server restart
- No CSRF protection validation
- State tokens never expire, creating a session fixation vulnerability
- Multiple server instances would break the flow (no shared state)

**Recommendation:**
- Use a cache (Redis) or secure session store with TTL
- Validate state token format and expiration on callback
- Implement state token regeneration

---

### 3. **Unrestricted URL Fetching (SSRF)** (api.py:444-492)
**Severity:** CRITICAL
**Location:** `Backend/api.py:444-492`

```python
@app.post("/fetch-url-content")
def fetch_url_content(req: FetchURLRequest):
    response = requests.get(req.url, headers=headers, timeout=10)
```

**Issues:**
- **No URL validation** - allows fetching internal/private URLs
- No hostname whitelist
- No redirect limit checking
- Can be used for SSRF attacks to access:
  - Internal services (127.0.0.1, 169.254.169.254 AWS metadata)
  - Private network resources
  - Local files via `file://` protocol

**Recommendation:**
```python
from urllib.parse import urlparse
import ipaddress

def is_safe_url(url: str) -> bool:
    parsed = urlparse(url)
    if parsed.scheme not in ('http', 'https'):
        raise ValueError("Invalid scheme")

    # Block private IPs
    try:
        ip = ipaddress.ip_address(parsed.hostname)
        if ip.is_private or ip.is_loopback:
            raise ValueError("Private IP not allowed")
    except:
        pass

    # Block internal hostnames
    if parsed.hostname and parsed.hostname.lower() in ['localhost', 'metadata.google.internal']:
        raise ValueError("Internal host blocked")

    return True
```

---

### 4. **Weak Email Address Validation** (api.py:1242-1250)
**Severity:** CRITICAL
**Location:** `Backend/api.py:1242-1250, 1131-1137`

```python
# Extract UNI from email address (format: UNI@columbia.edu)
extracted_uni = None
if from_addr:
    from_addr_lower = from_addr.lower()
    if from_addr_lower.endswith("@columbia.edu"):
        extracted_uni = from_addr_lower.replace("@columbia.edu", "")
```

**Issues:**
- No email validation before sending
- Simple string replacement vulnerable to spoofing
- `parseaddr()` can be exploited with malformed email headers
- No verification that sender is actually authorized

**Recommendation:**
```python
import email_validator

try:
    validated = email_validator.validate_email(to_addr, check_deliverability=True)
    to_addr = validated.normalized
except email_validator.EmailNotValidError:
    raise HTTPException(status_code=400, detail="Invalid email address")
```

---

### 5. **Plaintext Secrets in Git** (api.py, .gitignore)
**Severity:** CRITICAL
**Location:** `.gitignore:6-7`

```
Backend/data/google_client_secrets.json  # ← If this ever gets committed
Backend/data/gmail_token.json
```

**Issues:**
- If `google_client_secrets.json` is accidentally committed, OAuth credentials are exposed
- `.gitignore` relies on not committing - but historical commits may contain it
- No environment variable validation

**Recommendation:**
```bash
# Verify no secrets in history
git log --all --full-history -S "client_secret\|refresh_token" -- "*.json"

# Use environment variables
GOOGLE_OAUTH_CLIENT_FILE should point to an external secrets manager
GMAIL_TOKEN_PATH should use encrypted storage
```

---

## 🟠 HIGH ISSUES

### 6. **SQL Injection Risk via Metadata** (api.py:842-846)
**Severity:** HIGH
**Location:** `Backend/api.py:254-297`

```python
@app.patch("/knowledge-base/{article_id}")
def update_knowledge_base_article(article_id: str, update: KBArticleUpdate):
    # article_id comes directly from URL without validation
```

**Issues:**
- `article_id` is used directly from URL path
- While SQLAlchemy handles parameterization, there's no validation
- No length limits or character restrictions
- File-based JSON could be exploited

**Recommendation:**
```python
import re
from pydantic import Field

class ArticleIdParam(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not re.match(r'^[a-zA-Z0-9_-]+$', v) or len(v) > 100:
            raise ValueError('Invalid article ID format')
        return v
```

---

### 7. **No Authentication/Authorization**
**Severity:** HIGH
**Location:** `Backend/api.py` (all endpoints)

**Issues:**
- ALL endpoints are publicly accessible
- No API key authentication
- No rate limiting
- Anyone can:
  - View all emails
  - Send emails as the advisor
  - Modify knowledge base
  - Disconnect Gmail
  - Add/delete reference corpus

**Recommendation:**
```python
from fastapi.security import HTTPBearer, HTTPAuthenticationCredentials

security = HTTPBearer()

@app.get("/emails")
async def list_emails(credentials: HTTPAuthenticationCredentials = Depends(security)):
    if credentials.credentials != os.getenv("API_SECRET_KEY"):
        raise HTTPException(status_code=403, detail="Unauthorized")
    # ... rest of endpoint
```

---

### 8. **XSS Vulnerability in HTML Email Rendering** (api.py:753-765)
**Severity:** HIGH
**Location:** `Backend/api.py:750-765`

```python
escaped_body = html.escape(body)
html_body = f"""<!DOCTYPE html>...{escaped_body.replace(chr(10), '<br>')}...</html>"""
```

**Issues:**
- While `html.escape()` is used, this is insufficient for HTML email context
- If template variables contain HTML, they could bypass escaping
- Email HTML injection possible through response templates
- No CSP for emails (though less critical)

**Recommendation:**
- Use proper HTML email library
```python
from markdownify import markdownify
from email.mime.text import MIMEText

# Sanitize before HTML rendering
clean_body = markdownify(body)
html_body = f"<html><body><p>{clean_body}</p></body></html>"
```

---

### 9. **OAuth Token Refresh Race Condition** (api.py:660-672)
**Severity:** HIGH
**Location:** `Backend/api.py:660-672`

```python
if not creds.valid:
    if creds.expired and creds.refresh_token:
        try:
            creds.refresh(GoogleAuthRequest())
            if email_address:
                save_gmail_credentials(creds, email_address)
        except Exception:
            return None, email_address
```

**Issues:**
- No lock mechanism for concurrent token refresh
- Multiple requests could refresh token simultaneously
- Token could be invalidated between check and use
- Exception swallowing hides token refresh failures

**Recommendation:**
```python
import threading

_token_lock = threading.Lock()

def load_gmail_credentials() -> tuple[Optional[Credentials], Optional[str]]:
    with _token_lock:
        # Load and refresh logic here
```

---

### 10. **localStorage for Sensitive Settings**
**Severity:** HIGH
**Location:** `Frontend/code/components/settings-tab.tsx:103-135`

```javascript
window.localStorage.setItem(EMAIL_SETTINGS_CACHE_KEY, JSON.stringify(next));
window.localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
```

**Issues:**
- localStorage is accessible via XSS attacks
- Auto-send threshold should not be stored client-side (can be tampered)
- Settings should be validated server-side
- localStorage data persists even after logout

**Recommendation:**
- Move settings to server-side session storage
- Use secure, httpOnly cookies for sensitive data
- Only cache display-only information

---

### 11. **No CSRF Protection on State-Changing Operations**
**Severity:** HIGH
**Location:** `Backend/api.py` (POST endpoints)

**Issues:**
- No CSRF tokens on POST/PATCH/DELETE operations
- Attacker can craft malicious links to delete emails, disconnect Gmail, etc.
- Especially dangerous for `/gmail/disconnect` and `/emails/{id}/send`

**Recommendation:**
```python
from fastapi_csrf_protect import CsrfProtect

@app.post("/emails/{email_id}/send")
async def send_email_reply(email_id: int, csrf_protect: CsrfProtect = Depends()):
    await csrf_protect.validate_csrf(request)
    # ... rest of endpoint
```

---

## 🟡 MEDIUM ISSUES

### 12. **Verbose Error Messages Leaking Information** (api.py)
**Severity:** MEDIUM
**Location:** Multiple endpoints

```python
raise HTTPException(status_code=500, detail=f"Error processing URL: {str(e)}")
```

**Issues:**
- Stack traces exposed to client
- File paths disclosed
- Internal implementation details revealed

**Recommendation:**
```python
import logging
logger = logging.getLogger(__name__)

try:
    # ... code
except Exception as e:
    logger.exception("Failed to process URL")  # Log details server-side
    raise HTTPException(status_code=500, detail="An error occurred")  # Generic message
```

---

### 13. **No Input Length Limits** (api.py)
**Severity:** MEDIUM
**Location:** Multiple endpoints

**Issues:**
- Email bodies can be unlimited size
- Knowledge base articles unbounded
- Reference corpus content has no max size (500char truncation exists but weak)
- DoS vulnerability through large payloads

**Recommendation:**
```python
from pydantic import BaseModel, Field

class EmailIn(BaseModel):
    body: str = Field(..., max_length=10000)
    subject: str = Field(..., max_length=500)
```

---

### 14. **Hardcoded Database Path** (api.py:498)
**Severity:** MEDIUM
**Location:** `Backend/api.py:498`

```python
DATABASE_URL = "sqlite:///./emails.db"  # Relative path
```

**Issues:**
- Database stored in relative path (unpredictable location)
- No encryption at rest
- SQLite not suitable for production (concurrent access issues)
- Backup location unclear

**Recommendation:**
```python
import os
database_path = os.getenv("DATABASE_URL", "/secure/path/emails.db")
DATABASE_URL = f"sqlite:///{database_path}"

# Or use production database
# DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:pass@localhost/emails")
```

---

### 15. **No Rate Limiting** (api.py)
**Severity:** MEDIUM
**Location:** All endpoints

**Issues:**
- No protection against brute force
- No limit on email sync requests
- URL fetching could be spammed

**Recommendation:**
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.post("/emails/sync")
@limiter.limit("5/minute")
def sync_emails(request: Request):
    # ...
```

---

### 16. **No Encryption of Sensitive Data in Database** (api.py:629)
**Severity:** MEDIUM
**Location:** `Backend/api.py:617-631`

```python
class EmailORM(Base):
    body = Column(Text, nullable=False)  # ← Plaintext email bodies
    suggested_reply = Column(Text, nullable=False)  # ← Plaintext responses
    email_address = Column(String, nullable=True)  # ← Plaintext addresses
```

**Issues:**
- Email contents stored in plaintext
- Database backups expose sensitive student data
- No encryption at rest
- Violates data privacy principles

**Recommendation:**
```python
from cryptography.fernet import Fernet

class EmailORM(Base):
    body = Column(Text, nullable=False)  # Encrypted

    def encrypt_body(self, text: str):
        cipher = Fernet(os.getenv("ENCRYPTION_KEY"))
        return cipher.encrypt(text.encode()).decode()
```

---

### 17. **No Audit Logging** (api.py)
**Severity:** MEDIUM
**Location:** All state-changing endpoints

**Issues:**
- No record of who sent which emails
- Cannot track modifications to knowledge base
- No accountability for auto-sent responses
- Violates compliance requirements

**Recommendation:**
```python
def log_audit(action: str, user: str, details: dict):
    # Log to file/database with timestamp
    logger.info(f"AUDIT: {user} performed {action}: {details}")
```

---

## 🔵 LOW ISSUES

### 18. **Dependency Management**
**Severity:** LOW
**Location:** `Frontend/code/package.json`

- Using `"latest"` for `@vercel/analytics`, `date-fns`, and `recharts`
- No lock file pinning to specific versions
- Should use exact versions for reproducible builds

**Recommendation:**
```json
"@vercel/analytics": "1.x.x",  // or specific version
"date-fns": "^3.0.0",
"recharts": "^2.x.x"
```

---

### 19. **Missing Environment Variable Validation**
**Severity:** LOW
**Location:** `Backend/api.py`

```python
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")
```

- No validation that variables exist in production
- Defaults to insecure localhost

**Recommendation:**
```python
def validate_environment():
    required = ["GOOGLE_OAUTH_CLIENT_FILE", "DATABASE_URL"]
    for var in required:
        if not os.getenv(var):
            raise ValueError(f"Missing required environment variable: {var}")

validate_environment()
```

---

### 20. **No Content Security Policy (CSP)**
**Severity:** LOW
**Location:** `Frontend/code/app/layout.tsx`

- No CSP headers set
- Vulnerable to inline script injection
- Allows loading scripts from any source

**Recommendation:**
- Add to `next.config.js`:
```javascript
const headers = [
  {
    key: "Content-Security-Policy",
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.vercel-insights.com; style-src 'self' 'unsafe-inline';"
  }
];
```

---

## Summary Table

| ID | Issue | Severity | Category | Fix Time |
|----|-------|----------|----------|----------|
| 1 | CORS Configuration | CRITICAL | Access Control | 15 min |
| 2 | OAuth State Storage | CRITICAL | Authentication | 2 hrs |
| 3 | SSRF in URL Fetch | CRITICAL | Input Validation | 1 hr |
| 4 | Email Validation | CRITICAL | Input Validation | 30 min |
| 5 | Secrets in Git | CRITICAL | Secrets Management | 1 hr |
| 6 | Metadata Validation | HIGH | Input Validation | 45 min |
| 7 | No Authentication | HIGH | Access Control | 3 hrs |
| 8 | XSS in HTML Email | HIGH | Output Encoding | 1 hr |
| 9 | Token Race Condition | HIGH | Concurrency | 1 hr |
| 10 | localStorage Security | HIGH | Data Protection | 2 hrs |
| 11 | No CSRF Protection | HIGH | Request Forgery | 1 hr |
| 12 | Error Message Leaking | MEDIUM | Information Disclosure | 30 min |
| 13 | No Input Size Limits | MEDIUM | Resource Exhaustion | 45 min |
| 14 | Hardcoded Database Path | MEDIUM | Configuration | 30 min |
| 15 | No Rate Limiting | MEDIUM | DoS Protection | 1 hr |
| 16 | No Data Encryption | MEDIUM | Confidentiality | 3 hrs |
| 17 | No Audit Logging | MEDIUM | Accountability | 2 hrs |
| 18 | Dependency Versions | LOW | Supply Chain | 30 min |
| 19 | Missing Env Validation | LOW | Configuration | 20 min |
| 20 | No CSP Headers | LOW | XSS Prevention | 20 min |

---

## Recommended Fix Priority

### Phase 1 - CRITICAL (Do before any deployment):
1. Fix CORS configuration
2. Implement proper OAuth state management
3. Add URL validation/allowlist
4. Add email validation
5. Audit git history for secrets
6. Add authentication

### Phase 2 - HIGH (Do before production):
7. Add input validation
8. Fix XSS in email rendering
9. Add CSRF protection
10. Fix token race condition
11. Move settings to server-side

### Phase 3 - MEDIUM (Production hardening):
12-17: Add error handling, limits, encryption, logging, rate limiting

### Phase 4 - LOW (Nice to have):
18-20: Dependency management, CSP, env validation

---

## Testing Recommendations

```bash
# OWASP Top 10 Testing
- Test unauthenticated access to all endpoints
- Test CSRF by crafting malicious HTML
- Test SQL injection with special characters
- Test XSS with <script> tags in inputs
- Test SSRF with internal IP addresses
- Test rate limiting by making rapid requests

# Security Headers
curl -I http://localhost:8000 | grep -i "security\|csrf\|csp"

# Dependency scanning
npm audit
pip-audit

# Static analysis
bandit Backend/api.py  # Python security
eslint Frontend/code/  # JavaScript security
```

---

## Conclusion

This system handles sensitive student data and integrates with Gmail, making security critical. The current implementation has **5 critical vulnerabilities** that could allow:
- Unauthorized access to all emails
- Sending emails as the advisor
- Exposure of OAuth credentials
- Internal network access (SSRF)
- Data tampering

**Recommendation:** Do not deploy to production until at least Phase 1 issues are resolved.

For questions or clarifications, security testing should be conducted in a controlled environment with proper authorization.
