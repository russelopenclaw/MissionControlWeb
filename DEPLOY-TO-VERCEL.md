# Deploy Mission Control Web to Vercel

## Quick Deploy Guide (10 minutes)

### Step 1: Push to GitHub

The code is ready in `/workspace/mission-control-web/`. Push it to GitHub:

```bash
cd /workspace/mission-control-web

# Create the repo on GitHub (you'll need to do this manually or fix token scope)
gh repo create russelopenclaw/MissionControlWeb --public

# Or manually:
# 1. Go to https://github.com/new
# 2. Repository name: MissionControlWeb
# 3. Owner: russelopenclaw 
# 4. Visibility: Public
# 5. Click "Create repository"

# Then push:
git remote add origin https://github.com/russelopenclaw/MissionControlWeb.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel

**Option A: Vercel Dashboard (Easiest)**

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select repository: `russelopenclaw/MissionControlWeb`
4. Click **"Import"**
5. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (auto-detected)
6. **Add Environment Variables** (click "Environment Variables"):
   - `DATABASE_URL`: `postgresql://alfred:AlfredDB2026Secure@YOUR_SERVER_IP:5432/mission_control`
   - `AUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `AUTH_PASSWORD`: Your desired dashboard password
7. Click **"Deploy"**
8. Wait ~2-3 minutes for build

**Option B: Vercel CLI**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Add environment variables
vercel env add DATABASE_URL production
vercel env add AUTH_SECRET production  
vercel env add AUTH_PASSWORD production

# Deploy to production
vercel --prod
```

### Step 3: Configure PostgreSQL Access

For Vercel to connect to your home PostgreSQL:

**Option 1: Expose PostgreSQL (Not Recommended for Production)**
- Port forward 5432 in your router
- Update DATABASE_URL with your public IP
- **Security risk**: Only do this temporarily for testing

**Option 2: Use Ngrok/Tunnel (Better)**
```bash
# Install ngrok
npm install -g ngrok

# Create tunnel
ngrok tcp 5432

# Use the ngrok URL in DATABASE_URL
# Example: postgresql://alfred:AlfredDB2026Secure@0.tcp.ngrok.io:12345/mission_control
```

**Option 3: Self-Host on Same Network (Best for Home Lab)**
- Deploy to a Raspberry Pi or home server
- Access via local IP: `http://YOUR_SERVER_IP:3001`

### Step 4: Test Access

1. Visit your Vercel URL (e.g., `https://mission-control-web.vercel.app`)
2. Enter the password you set in `AUTH_PASSWORD`
3. You should see the dashboard with:
   - Agent status cards
   - Task overview
   - System health indicators

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:port/db` |
| `AUTH_SECRET` | Secret for JWT signing (32+ chars) | `abc123...` (use `openssl rand -base64 32`) |
| `AUTH_PASSWORD` | Dashboard login password | `my-secure-password` |

## Local Development

```bash
cd mission-control-web

# Install dependencies
npm install

# Copy env file and edit
cp .env.local .env.local.actual
# Edit .env.local.actual with your values

# Run dev server
npm run dev
```

Open http://localhost:3001

## Troubleshooting

### Database Connection Timeout
- Verify PostgreSQL is running: `systemctl --user status alfred-hub.service`
- Check firewall allows connections
- Test locally first: `psql -h localhost -U alfred -d mission_control`

### Build Fails
- Check Vercel deploy logs for specific error
- Ensure all TypeScript types are correct
- Delete `.next` folder and rebuild locally

### Auth Not Working
- Ensure `AUTH_SECRET` is at least 32 characters
- Clear browser cookies
- Check middleware is protecting routes

## Security Checklist

- [ ] Change default `AUTH_PASSWORD`
- [ ] Generate unique `AUTH_SECRET` (don't use example)
- [ ] Use environment variables (don't commit `.env.local`)
- [ ] Consider adding rate limiting for production
- [ ] Set up HTTPS (Vercel does this automatically)

## Next Steps

After deployment, you can:

1. **Add Custom Domain**: Vercel → Settings → Domains
2. **Set Up Auto-Deploy**: Every git push triggers rebuild
3. **Add More Features**: Extend the dashboard with new widgets
4. **Mobile App**: Use the same API for a React Native app

## Support

Issues? Check:
- Vercel logs: `vercel logs`
- Local test: `npm run dev`
- Database: `psql -h localhost -U alfred -d mission_control`
