# Debug: Why Revalidation Logs Aren't Showing

## Problem
When you update content in WordPress, no logs appear in the Next.js terminal.

## Root Cause
The webhook is **not reaching Next.js** because of a network connectivity issue. WordPress logs show:
```
❌ Next.js webhook ERROR: cURL error 7: Failed to connect to 192.168.1.96 port 3000: Network is unreachable
```

## Solution Steps

### Step 1: Check WordPress Logs First
Check WordPress debug log to see what's happening:
```bash
# WordPress logs location
tail -f /wp-content/debug.log

# Look for these lines:
# 🔔 Sending Next.js webhook to: ...
# ❌ Next.js webhook ERROR: ...
# 🔄 Trying fallback URL: ...
```

### Step 2: Determine Where WordPress is Running

**Option A: WordPress is in Docker**
```php
// In functions.php, change line 40 to:
define('NEXTJS_URL', 'http://host.docker.internal:3000');
```

**Option B: WordPress is on Same Machine**
```php
// In functions.php, change line 40 to:
define('NEXTJS_URL', 'http://localhost:3000');
```

**Option C: WordPress is on Different Machine/VM**
```php
// In functions.php, keep:
define('NEXTJS_URL', 'http://192.168.1.96:3000');
// But check firewall settings!
```

### Step 3: Test Connection from WordPress

**If WordPress is in Docker:**
```bash
# Enter WordPress container
docker exec -it <wordpress-container> bash

# Test connection
curl -X POST http://host.docker.internal:3000/api/revalidate \
  -H "x-secret: nxjs_8k2m645445djasg855sdar889532fsdfs" \
  -H "Content-Type: application/json" \
  -d '{"action":"test","post_type":"post","slug":"test","post_id":999}'
```

**If WordPress is on same machine:**
```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "x-secret: nxjs_8k2m645445djasg855sdar889532fsdfs" \
  -H "Content-Type: application/json" \
  -d '{"action":"test","post_type":"post","slug":"test","post_id":999}'
```

### Step 4: Update functions.php

Based on your WordPress setup, update the `NEXTJS_URL` in `functions.php`:

1. Open `functions.php`
2. Find line 40 (or around there)
3. Change `NEXTJS_URL` to the correct value
4. Save the file

### Step 5: Test Again

1. **Update a post in WordPress**
2. **Check WordPress logs** (`/wp-content/debug.log`):
   - Should see: `✅ Next.js webhook SUCCESS`
3. **Check Next.js terminal**:
   - Should see: `🔔 Revalidation webhook received at: ...`

## Quick Fix Checklist

- [ ] Next.js server is running (`npm run dev`)
- [ ] WordPress can reach Next.js (test with curl from WordPress server)
- [ ] `NEXTJS_URL` in functions.php is correct for your setup
- [ ] `REVALIDATE_SECRET` in .env.local matches `NEXTJS_SECRET` in functions.php
- [ ] Check WordPress logs first (they show connection attempts)
- [ ] Check Next.js terminal (only shows logs if webhook reaches it)

## Expected Log Flow

### WordPress Logs (debug.log):
```
🔔 Sending Next.js webhook to: http://host.docker.internal:3000/api/revalidate
📦 Payload: {"action":"update","post_type":"post",...}
✅ Next.js webhook SUCCESS: {"success":true,...}
```

### Next.js Terminal:
```
============================================================
🔔 Revalidation webhook received at: 2025-11-30T...
📍 Request URL: /api/revalidate
📍 Request Method: POST
============================================================
🔐 Secret configured: true
🔑 Token received: true
📦 Webhook payload: {...}
🔄 Starting revalidation process...
✅ Revalidated homepage
✅ Revalidated all article pages
⏱️  Revalidation completed in 5ms
```

## If Still Not Working

1. **Check WordPress test page**: `yoursite.com/?test_nextjs_revalidation=1`
2. **Verify Next.js is accessible**: Test with curl from WordPress server
3. **Check firewall**: Make sure port 3000 is not blocked
4. **Check network**: WordPress and Next.js must be on same network or use proper Docker networking

## Most Common Fix

If WordPress is in Docker, change `functions.php` line 40:
```php
define('NEXTJS_URL', 'http://host.docker.internal:3000');
```

Then update a post in WordPress and check both:
- WordPress logs: `/wp-content/debug.log`
- Next.js terminal: Should show revalidation logs

