# Mission Control Web Dashboard

A secure, responsive web dashboard for monitoring your Mission Control system.

## Features

- 🔒 Password-protected authentication (NextAuth)
- 👥 Real-time agent status monitoring
- 📋 Task board with live updates
- 💻 System health checks (Ollama, Gateway, Disk)
- 📱 Responsive design (desktop, tablet, mobile)
- 🔄 Auto-refresh every 10 seconds

## Quick Start

### 1. Install Dependencies

```bash
cd mission-control-web
npm install
```

### 2. Configure Environment

Copy `.env.local` and update with your values:

```bash
cp .env.local .env.local.actual
```

Edit `.env.local.actual`:
- `AUTH_SECRET`: Generate with `openssl rand -base64 32`
- `AUTH_PASSWORD`: Your desired dashboard password
- `DATABASE_URL`: PostgreSQL connection string
- `MISSION_CONTROL_API`: Your Mission Control endpoint

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001)

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

## Project Structure

```
mission-control-web/
├── src/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── agents/    # Agent status endpoint
│   │   │   ├── tasks/     # Task data endpoint
│   │   │   ├── status/    # System health endpoint
│   │   │   └── auth/      # NextAuth endpoints
│   │   ├── auth/
│   │   │   └── signin/    # Login page
│   │   ├── globals.css    # Global styles
│   │   ├── layout.tsx     # Root layout
│   │   └── page.tsx       # Dashboard
│   ├── lib/
│   │   └── db.ts          # Database connection
│   └── middleware.ts      # Auth middleware
├── .env.local             # Environment variables (gitignored)
├── next.config.ts         # Next.js config
├── package.json
└── README.md
```

## Security

- Password authentication required for all routes
- Sessions expire after 30 days
- Environment variables for sensitive data
- PostgreSQL connection pooling
- Middleware protects all non-auth routes

## API Endpoints

| Endpoint | Description | Auth Required |
|----------|-------------|---------------|
| `GET /api/agents` | List all agents with status | Yes |
| `GET /api/tasks` | Get tasks by column | Yes |
| `GET /api/status` | System health check | Yes |
| `GET /api/subagents` | Recent subagent history | Yes |

## Customization

### Change Theme Colors
Edit `src/app/globals.css` and modify the gradient background.

### Add More Widgets
Create new card components in `src/app/page.tsx` following the existing pattern.

### Extend Authentication
See [NextAuth docs](https://next-auth.js.org/) for OAuth providers, email login, etc.

## Troubleshooting

### Database Connection Errors
- Verify PostgreSQL is running: `systemctl --user status alfred-hub.service`
- Check DATABASE_URL format: `postgresql://user:pass@host:port/dbname`
- Test connection: `PGPASSWORD=yourpass psql -h localhost -U alfred -d mission_control`

### Auth Not Working
- Ensure AUTH_SECRET is set (min 32 chars)
- Check .env.local is loaded (restart dev server after changes)
- Clear browser cookies and try again

### Build Fails
- Run `npm run lint` to catch TypeScript errors
- Delete `.next` folder and rebuild
- Ensure all dependencies are installed

## License

MIT
