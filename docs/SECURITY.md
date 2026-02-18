# Security Policy

## Supported Versions

We release patches for security vulnerabilities. Currently, only the latest version is supported.

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

---

## Reporting a Vulnerability

We take security seriously. If you discover a security vulnerability, please follow these steps:

### 1. Do Not Open a Public Issue

Please **do not** open a public GitHub issue for security vulnerabilities. This could put all users at risk.

### 2. Report Privately

Send a detailed report to the project maintainers by:

1. **Opening a Security Advisory** (Preferred)
   - Go to the Security tab in the GitHub repository
   - Click "Report a vulnerability"
   - Fill out the form with detailed information

2. **Opening a Private Issue**
   - Create a new issue
   - Mark it as a security concern
   - Provide detailed information

### 3. What to Include

Your report should include:

- **Description**: Clear description of the vulnerability
- **Impact**: What an attacker could achieve
- **Steps to Reproduce**: Detailed steps to reproduce the issue
- **Affected Versions**: Which versions are affected
- **Possible Fix**: If you have suggestions for fixing the issue
- **Additional Context**: Any other relevant information

**Example Report:**
```markdown
**Vulnerability Type**: [e.g., SQL Injection, XSS, etc.]

**Description**:
[Clear description of the vulnerability]

**Impact**:
[What could an attacker do with this vulnerability?]

**Steps to Reproduce**:
1. [First step]
2. [Second step]
3. [...]

**Affected Versions**:
[e.g., All versions, v1.0.0 - v1.2.0]

**Suggested Fix**:
[If you have suggestions]

**Additional Information**:
[Any other relevant details]
```

### 4. Response Time

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity (see below)

---

## Vulnerability Severity

We classify vulnerabilities using the following severity levels:

### Critical
- **Response Time**: 24 hours
- **Fix Timeline**: 1-3 days
- **Examples**: 
  - Remote code execution
  - Authentication bypass
  - Data breach potential

### High
- **Response Time**: 48 hours
- **Fix Timeline**: 3-7 days
- **Examples**:
  - Privilege escalation
  - API key exposure
  - Session hijacking

### Medium
- **Response Time**: 72 hours
- **Fix Timeline**: 7-14 days
- **Examples**:
  - Cross-site scripting (XSS)
  - CSRF vulnerabilities
  - Information disclosure

### Low
- **Response Time**: 7 days
- **Fix Timeline**: 14-30 days
- **Examples**:
  - Minor information leaks
  - Denial of service (local)
  - Best practice violations

---

## Security Best Practices

### For Users

#### 1. API Key Security

**Never expose your Gemini API key:**

```bash
# Bad ✗
export API_KEY="AIza..."
git add .env
git commit -m "Add API key"  # Don't do this!

# Good ✓
# Add .env to .gitignore
echo ".env" >> .gitignore
echo "API_KEY=your_key_here" > .env
```

**Use environment variables in production:**

```javascript
// Bad ✗
const API_KEY = "AIza..."; // Hardcoded key

// Good ✓
const API_KEY = process.env.API_KEY;
```

#### 2. Input Validation

Always validate user input:

```javascript
// Good ✓
app.post('/api/paraphrase', (req, res) => {
  const { text } = req.body;
  
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
  }
  
  if (text.length > 10000) {
    return res.status(400).json({ error: 'Text too long' });
  }
  
  // Process text
});
```

#### 3. Rate Limiting

Implement rate limiting in production:

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.use('/api', limiter);
```

#### 4. HTTPS Only

Always use HTTPS in production:

```javascript
// Redirect HTTP to HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

#### 5. Security Headers

Add security headers:

```javascript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
    },
  },
}));
```

#### 6. CORS Configuration

Configure CORS properly:

```javascript
import cors from 'cors';

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

### For Contributors

#### 1. Dependency Security

Check for vulnerable dependencies:

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# For critical fixes
npm audit fix --force
```

#### 2. Code Review

- Review all code for security issues
- Never commit sensitive data
- Check for hardcoded credentials
- Validate all inputs
- Sanitize all outputs

#### 3. Secret Scanning

Before committing:

```bash
# Check for secrets
git diff --staged | grep -i "api_key\|password\|secret\|token"
```

#### 4. Environment Variables

Use `.env.example` for documentation:

```bash
# .env.example
API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=development
```

```bash
# .env (gitignored)
API_KEY=actual_key_value
```

---

## Known Security Considerations

### 1. API Key Exposure

**Risk**: Gemini API keys could be exposed if not properly secured.

**Mitigation**:
- Never commit API keys to version control
- Use environment variables
- Rotate keys regularly
- Monitor API usage for anomalies

### 2. Input Injection

**Risk**: Malicious input could be sent to the Gemini API.

**Mitigation**:
- Validate all user input
- Limit input length
- Sanitize special characters if needed
- Implement rate limiting

### 3. Rate Limiting

**Risk**: API abuse could lead to excessive costs or service degradation.

**Mitigation**:
- Implement rate limiting per IP
- Monitor API usage
- Set usage quotas
- Add captcha for high-volume usage

### 4. Data Privacy

**Risk**: User text data could be exposed or logged.

**Mitigation**:
- Don't log user input in production
- Use secure HTTPS connections
- Follow Gemini API privacy policies
- Inform users about data handling

### 5. Dependency Vulnerabilities

**Risk**: Third-party dependencies may have security vulnerabilities.

**Mitigation**:
- Regularly update dependencies
- Use `npm audit` to check for vulnerabilities
- Pin dependency versions
- Review security advisories

### 6. Cross-Site Scripting (XSS)

**Risk**: User input could be rendered unsafely in the browser.

**Mitigation**:
- Sanitize HTML output
- Use Content Security Policy headers
- Escape user input before rendering
- Use modern frameworks with XSS protection

---

## Security Checklist

Before deploying to production:

- [ ] All API keys are in environment variables
- [ ] HTTPS is enabled
- [ ] Security headers are configured
- [ ] Rate limiting is implemented
- [ ] Input validation is in place
- [ ] Dependencies are up to date
- [ ] No hardcoded secrets in code
- [ ] CORS is properly configured
- [ ] Error messages don't expose sensitive info
- [ ] Logs don't contain sensitive data
- [ ] Authentication is implemented (if needed)
- [ ] File upload validation (if applicable)
- [ ] SQL injection protection (if using database)
- [ ] XSS protection is in place
- [ ] CSRF protection is in place

---

## Security Updates

We will notify users of security issues through:

1. **GitHub Security Advisories**: Published for all security vulnerabilities
2. **Release Notes**: Security fixes mentioned in release notes
3. **GitHub Issues**: Public disclosure after fix is released

### Staying Updated

To stay informed about security updates:

1. **Watch the repository** on GitHub
2. **Enable security alerts** in your GitHub settings
3. **Subscribe to releases** to get notified of new versions
4. **Follow the project** for announcements

---

## Disclosure Policy

### Coordinated Disclosure

We follow a coordinated disclosure process:

1. **Report Received**: We acknowledge your report within 48 hours
2. **Validation**: We validate and assess the vulnerability
3. **Fix Development**: We develop and test a fix
4. **Private Patch**: We may provide a patch to critical users
5. **Public Release**: We release a fix in a new version
6. **Public Disclosure**: We publish a security advisory
7. **Recognition**: We credit the reporter (if desired)

### Timeline

- **Day 0**: Vulnerability reported
- **Day 1-2**: Initial response and validation
- **Day 3-7**: Fix development
- **Day 7-14**: Testing and verification
- **Day 14-21**: Release preparation
- **Day 21-30**: Public disclosure

**Note**: Critical vulnerabilities may be addressed faster.

---

## Bug Bounty Program

We currently **do not** have a bug bounty program. However, we greatly appreciate security researchers who responsibly disclose vulnerabilities. We will:

- Credit you in the security advisory (if desired)
- Mention you in release notes
- Provide a public thank you

---

## Compliance

### Data Protection

This application:
- Does not store user data permanently (by default)
- Processes text through Google Gemini API
- Follows Google's API terms of service
- Recommends GDPR compliance for EU users

### API Usage

- Follow [Google Gemini API Terms](https://ai.google.dev/terms)
- Respect rate limits
- Don't use for illegal purposes
- Don't process sensitive personal data without user consent

---

## Security Resources

### External Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Google Gemini API Security](https://ai.google.dev/docs/security)

### Tools

- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit): Check for vulnerabilities
- [Snyk](https://snyk.io/): Security scanning
- [OWASP ZAP](https://www.zaproxy.org/): Security testing
- [GitGuardian](https://www.gitguardian.com/): Secret scanning

---

## Contact

For security concerns:

- **Security Advisories**: Use GitHub Security tab
- **General Questions**: Open a GitHub issue (non-sensitive)
- **Private Reports**: Use GitHub private vulnerability reporting

---

## Acknowledgments

We thank the following security researchers for responsibly disclosing vulnerabilities:

*No vulnerabilities reported yet*

---

**Last Updated**: 2026-02-18

---

Thank you for helping keep the AI Plagiarism & Paraphrase Assistant secure! 🔒
