# WordPress to Next.js Network Troubleshooting Guide

## Problem: "Network is unreachable" Error

If you see this error in WordPress logs:
```
❌ Next.js webhook ERROR: cURL error 7: Failed to connect to 192.168.1.96 port 3000: Network is unreachable
```

This means WordPress cannot reach your Next.js server. Follow these steps:

## Step 1: Determine Where WordPress is Running

### Option A: WordPress is in Docker Container
If WordPress is running in Docker (Docker Desktop, Docker Compose, etc.):

1. **Try this URL first:**
   ```php
   define('NEXTJS_URL', 'http://host.docker.internal:3000');
   ```

2. **If that doesn't work, try:**
   ```php
   define('NEXTJS_URL', 'http://172.17.0.1:3000');
   ```

3. **To find Docker gateway IP:**
   ```bash
   # From inside WordPress container
   ip route | grep default
   # Or
   cat /etc/hosts | grep host
   ```

### Option B: WordPress is on Same Machine as Next.js
If WordPress and Next.js are both on the same machine:

```php
define('NEXTJS_URL', 'http://localhost:3000');
// OR
define('NEXTJS_URL', 'http://127.0.0.1:3000');
```

### Option C: WordPress is on Different Machine/VM
If WordPress is on a different machine or VM:

1. **Find Next.js machine's IP:**
   ```bash
   # On Next.js machine
   ifconfig | grep "inet " | grep -v 127.0.0.1
   ```

2. **Use that IP:**
   ```php
   define('NEXTJS_URL', 'http://192.168.1.96:3000'); // Replace with your IP
   ```

3. **Make sure firewall allows port 3000:**
   ```bash
   # On Next.js machine (macOS)
   sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
   
   # Or temporarily disable firewall for testing
   ```

## Step 2: Test Connection from WordPress

### Method 1: Use WordPress Test Page
Visit: `yoursite.com/?test_nextjs_revalidation=1`

This will show you:
- Which URL is configured
- If connection succeeds or fails
- Detailed error messages

### Method 2: Test from WordPress Container/Server

If WordPress is in Docker:
```bash
# Enter WordPress container
docker exec -it <wordpress-container-name> bash

# Test connection
curl -X POST http://host.docker.internal:3000/api/revalidate \
  -H "x-secret: nxjs_8k2m645445djasg855sdar889532fsdfs" \
  -H "Content-Type: application/json" \
  -d '{"action":"test","post_type":"post","slug":"test","post_id":999}'
```

If WordPress is on same machine:
```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "x-secret: nxjs_8k2m645445djasg855sdar889532fsdfs" \
  -H "Content-Type: application/json" \
  -d '{"action":"test","post_type":"post","slug":"test","post_id":999}'
```

## Step 3: Verify Next.js is Running

On the Next.js machine:
```bash
# Check if Next.js is running
lsof -i :3000

# Test endpoint directly
curl -X POST http://localhost:3000/api/revalidate \
  -H "x-secret: nxjs_8k2m645445djasg855sdar889532fsdfs" \
  -H "Content-Type: application/json" \
  -d '{"action":"test","post_type":"post","slug":"test","post_id":999}'
```

## Step 4: Automatic Fallback (Already Implemented)

The updated `functions.php` now automatically tries fallback URLs if the primary fails:
- If IP address fails → tries `localhost`
- If `localhost` fails → tries `host.docker.internal`
- If `host.docker.internal` fails → tries Docker gateway `172.17.0.1`

Check WordPress logs (`/wp-content/debug.log`) to see which URL worked.

## Step 5: Common Solutions

### Solution 1: Docker Network Issue
```php
// In functions.php, change to:
define('NEXTJS_URL', 'http://host.docker.internal:3000');
```

### Solution 2: Firewall Blocking
```bash
# macOS - Allow Node.js through firewall
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --add /usr/local/bin/node
sudo /usr/libexec/ApplicationFirewall/socketfilterfw --unblockapp /usr/local/bin/node
```

### Solution 3: Use Docker Network
If both WordPress and Next.js are in Docker:
```yaml
# docker-compose.yml
services:
  wordpress:
    # ... your config
  nextjs:
    # ... your config

# Then use service name:
define('NEXTJS_URL', 'http://nextjs:3000');
```

### Solution 4: Use ngrok for Testing
```bash
# Install ngrok
brew install ngrok

# Expose Next.js
ngrok http 3000

# Use ngrok URL in WordPress
define('NEXTJS_URL', 'https://your-ngrok-url.ngrok.io');
```

## Step 6: Check WordPress Logs

After making changes, check WordPress debug log:
```bash
tail -f /wp-content/debug.log
```

Look for:
- `🔔 Sending Next.js webhook to: ...` - Shows which URL is being used
- `✅ Next.js webhook SUCCESS` - Connection worked!
- `❌ Next.js webhook ERROR` - Connection failed
- `🔄 Trying fallback URL: ...` - Shows fallback attempts

## Quick Fix Checklist

- [ ] Next.js server is running on port 3000
- [ ] WordPress can reach Next.js URL (test with curl)
- [ ] Firewall allows port 3000
- [ ] `NEXTJS_URL` in functions.php matches your setup
- [ ] `REVALIDATE_SECRET` in .env.local matches `NEXTJS_SECRET` in functions.php
- [ ] Check WordPress logs for detailed error messages

## Still Having Issues?

1. Check WordPress logs: `/wp-content/debug.log`
2. Check Next.js terminal for incoming requests
3. Try the test page: `yoursite.com/?test_nextjs_revalidation=1`
4. Verify network connectivity with `curl` from WordPress server

