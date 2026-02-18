# API Documentation

Complete API reference for the AI Plagiarism & Paraphrase Assistant.

## Table of Contents
- [Base URL](#base-url)
- [Authentication](#authentication)
- [Endpoints](#endpoints)
  - [Source Detection](#source-detection)
  - [Paraphrasing](#paraphrasing)
- [Error Handling](#error-handling)
- [Rate Limits](#rate-limits)
- [Examples](#examples)

---

## Base URL

**Development:**
```
http://localhost:3000/api
```

**Production:**
```
https://your-domain.com/api
```

---

## Authentication

### Current Implementation
The current version does not require authentication for local development.

### Production Recommendations

For production deployments, we recommend implementing one of the following:

#### Option 1: API Key Authentication
```javascript
// Add to server.js
const API_KEY = process.env.ADMIN_API_KEY;

app.use('/api', (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== API_KEY) {
    return res.status(401).json({ error: 'Invalid API key' });
  }
  next();
});
```

**Usage:**
```bash
curl -X POST http://localhost:3000/api/detect-source \
  -H "X-API-Key: your_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{"text": "your text"}'
```

#### Option 2: JWT Token Authentication
```javascript
// Install: npm install jsonwebtoken
import jwt from 'jsonwebtoken';

// Middleware
function authenticateToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

app.use('/api', authenticateToken);
```

---

## Endpoints

### Source Detection

Detect potential sources of text using Google Search grounding.

#### Request

```http
POST /api/detect-source
Content-Type: application/json

{
  "text": "string (required)"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| text | string | Yes | The text to analyze for sources (max 10,000 characters) |

#### Response

**Success (200 OK):**
```json
{
  "source_summary": "This text appears to be from academic literature discussing climate change impacts...",
  "author_estimate": "Likely authored by environmental scientists or climate researchers",
  "confidence_score": 87,
  "grounding_urls": [
    "https://www.nature.com/articles/climate-change-2023",
    "https://www.sciencedirect.com/article/environmental-impact",
    "https://www.ipcc.ch/reports/"
  ]
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| source_summary | string | Detailed analysis of potential sources |
| author_estimate | string | Estimated authorship or origin |
| confidence_score | number | Confidence level (0-100%) |
| grounding_urls | array | List of URLs found during search grounding |

#### Example

**cURL:**
```bash
curl -X POST http://localhost:3000/api/detect-source \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Climate change represents one of the most significant challenges facing humanity in the 21st century."
  }'
```

**JavaScript:**
```javascript
const response = await fetch('/api/detect-source', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Your text to analyze...'
  })
});

const data = await response.json();
console.log('Confidence:', data.confidence_score);
console.log('Sources:', data.grounding_urls);
```

**Python:**
```python
import requests

response = requests.post(
    'http://localhost:3000/api/detect-source',
    json={'text': 'Your text to analyze...'}
)

data = response.json()
print(f"Confidence: {data['confidence_score']}%")
print(f"Sources: {data['grounding_urls']}")
```

---

### Paraphrasing

Generate an academic paraphrase of the provided text.

#### Request

```http
POST /api/paraphrase
Content-Type: application/json

{
  "text": "string (required)"
}
```

**Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| text | string | Yes | The text to paraphrase (max 5,000 characters) |

#### Response

**Success (200 OK):**
```json
{
  "original_text": "Machine learning is a subset of artificial intelligence...",
  "paraphrased_text": "The discipline of machine learning constitutes a specialized domain within artificial intelligence...",
  "analysis": {
    "similarity_score_estimate": 35.5,
    "transformation_summary": "Applied semantic-preserving transformations including lexical substitution, syntactic restructuring, and discourse reorganization while maintaining academic register."
  }
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| original_text | string | The input text (echoed back) |
| paraphrased_text | string | AI-generated academic paraphrase |
| analysis.similarity_score_estimate | number | Estimated similarity to original (lower = more different, 0-100) |
| analysis.transformation_summary | string | Description of transformation strategies applied |

#### Example

**cURL:**
```bash
curl -X POST http://localhost:3000/api/paraphrase \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Machine learning algorithms can process vast amounts of data to identify patterns and make predictions."
  }'
```

**JavaScript:**
```javascript
const response = await fetch('/api/paraphrase', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    text: 'Your text to paraphrase...'
  })
});

const data = await response.json();
console.log('Original:', data.original_text);
console.log('Paraphrased:', data.paraphrased_text);
console.log('Similarity:', data.analysis.similarity_score_estimate + '%');
```

**Python:**
```python
import requests

response = requests.post(
    'http://localhost:3000/api/paraphrase',
    json={'text': 'Your text to paraphrase...'}
)

data = response.json()
print(f"Original: {data['original_text']}")
print(f"Paraphrased: {data['paraphrased_text']}")
print(f"Similarity: {data['analysis']['similarity_score_estimate']}%")
```

---

## Error Handling

All endpoints return standard HTTP status codes and error messages.

### Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| 200 | OK | Request successful |
| 400 | Bad Request | Invalid input or missing required fields |
| 401 | Unauthorized | Authentication failed (if enabled) |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server or API error |
| 503 | Service Unavailable | External API (Gemini) unavailable |

### Error Response Format

```json
{
  "error": "Error message description",
  "details": "Additional error context (optional)"
}
```

### Common Errors

#### 400 Bad Request
```json
{
  "error": "Text is required"
}
```
**Cause:** Missing or empty `text` field in request body.

#### 500 Internal Server Error
```json
{
  "error": "Failed to parse model response as JSON."
}
```
**Cause:** Gemini API returned unexpected format. Usually temporary.

#### 503 Service Unavailable
```json
{
  "error": "Gemini API is currently unavailable"
}
```
**Cause:** External API issues. Retry after a few seconds.

### Error Handling Example

```javascript
async function detectSource(text) {
  try {
    const response = await fetch('/api/detect-source', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Request failed');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error:', error.message);
    // Handle error appropriately
    return null;
  }
}
```

---

## Rate Limits

### Current Implementation
No rate limiting in local development.

### Production Recommendations

Implement rate limiting to protect your API:

```javascript
// Install: npm install express-rate-limit
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later.' }
});

app.use('/api', limiter);
```

### Recommended Tiers

| Tier | Requests/Hour | Requests/Day |
|------|---------------|--------------|
| Free | 100 | 500 |
| Basic | 500 | 2,000 |
| Pro | 2,000 | 10,000 |
| Enterprise | Unlimited | Unlimited |

### Rate Limit Headers

When rate limiting is enabled, responses include:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## Examples

### Complete Integration Example

```javascript
class PlagiarismAPI {
  constructor(baseURL = 'http://localhost:3000/api') {
    this.baseURL = baseURL;
  }
  
  async request(endpoint, data) {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error.message);
      throw error;
    }
  }
  
  detectSource(text) {
    return this.request('/detect-source', { text });
  }
  
  paraphrase(text) {
    return this.request('/paraphrase', { text });
  }
  
  async analyzeAndParaphrase(text) {
    // First detect sources
    const sourceResult = await this.detectSource(text);
    
    // Then paraphrase if needed
    if (sourceResult.confidence_score > 70) {
      const paraphraseResult = await this.paraphrase(text);
      return {
        source: sourceResult,
        paraphrase: paraphraseResult
      };
    }
    
    return { source: sourceResult };
  }
}

// Usage
const api = new PlagiarismAPI();

// Analyze text
const result = await api.analyzeAndParaphrase(
  "Your text to analyze and potentially paraphrase..."
);

console.log('Source Confidence:', result.source.confidence_score);
if (result.paraphrase) {
  console.log('Paraphrased:', result.paraphrase.paraphrased_text);
}
```

### Error Recovery Example

```javascript
async function robustParaphrase(text, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch('/api/paraphrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      if (response.ok) {
        return await response.json();
      }
      
      // If rate limited, wait and retry
      if (response.status === 429) {
        const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`Rate limited. Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // For other errors, throw
      const error = await response.json();
      throw new Error(error.error);
      
    } catch (error) {
      if (attempt === maxRetries) {
        console.error('Max retries reached:', error.message);
        throw error;
      }
      console.log(`Attempt ${attempt} failed, retrying...`);
    }
  }
}
```

---

## Best Practices

1. **Input Validation**: Always validate text length before sending requests
2. **Error Handling**: Implement proper try-catch blocks and user feedback
3. **Rate Limiting**: Respect rate limits and implement exponential backoff
4. **Caching**: Cache results for identical text to reduce API calls
5. **Timeouts**: Set reasonable timeouts for API requests (30s recommended)
6. **Logging**: Log errors and response times for monitoring
7. **Security**: Use HTTPS in production and implement authentication

---

## Support

For API-related issues or questions:
- Open an issue: [GitHub Issues](https://github.com/Ghulam-Mustafa-Keerio/AI-Plagiarism-Paraphrase-Assistant/issues)
- Check the main [README](../README.md) for general documentation

---

## Changelog

### Version 1.0.0 (Current)
- Initial API release
- Source detection endpoint
- Paraphrasing endpoint
- JSON responses with detailed metadata
