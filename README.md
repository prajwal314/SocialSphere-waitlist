# SocialSphere Waitlist Website

A modern, responsive waitlist landing page for SocialSphere — an intent-based social networking platform.

## Tech Stack

**Frontend:** Next.js, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons
**Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose

## Folder Structure

```
socialsphere-waitlist/
├── client/                 # Next.js frontend
│   ├── components/         # React components
│   ├── pages/              # Next.js pages
│   ├── lib/                # API client
│   ├── styles/             # Global CSS
│   └── public/             # Static assets
├── server/                 # Express backend
│   ├── controllers/        # Route handlers
│   ├── routes/             # API routes
│   ├── models/             # Mongoose models
│   ├── config/             # Database config
│   └── middleware/          # Error handling
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)

### 1. Clone & Install Dependencies

```bash
# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../server
npm install
```

### 2. Set Up MongoDB Atlas

1. Create a free cluster at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Get your connection string from Cluster > Connect > Drivers
3. Replace `<username>`, `<password>`, and cluster address

### 3. Configure Environment Variables

**Backend** (`server/.env`):
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/socialsphere?retryWrites=true&w=majority
CORS_ORIGIN=http://localhost:3000
```

**Frontend** (`client/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### 4. Run Locally

```bash
# Terminal 1 — start backend
cd server
npm run dev

# Terminal 2 — start frontend
cd client
npm run dev
```

Frontend: http://localhost:3000
Backend API: http://localhost:5000

## API Endpoints

| Method | Endpoint           | Description                |
|--------|--------------------|----------------------------|
| POST   | /api/waitlist      | Join the waitlist          |
| GET    | /api/waitlist      | Get all entries (admin)    |
| GET    | /api/health        | Health check               |

### POST /api/waitlist

```json
{
  "name": "John Doe",
  "email": "john@example.com"
}
```

### GET /api/waitlist

Returns all waitlist entries sorted newest first.

## Deployment

### Frontend → Vercel

1. Push the `client/` folder to a GitHub repo
2. Import project in [Vercel](https://vercel.com)
3. Set environment variable: `NEXT_PUBLIC_API_URL` = your Render URL
4. Deploy

### Backend → Render

1. Push the `server/` folder to a GitHub repo
2. Create a new Web Service in [Render](https://render.com)
3. Set:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables (MONGODB_URI, CORS_ORIGIN)
5. Deploy

## Exporting Emails

Once deployed, GET `https://your-api.onrender.com/api/waitlist` returns all entries as JSON. You can pipe this into a CSV for email marketing.

## Features

- Animated hero with gradient blobs and floating elements
- Dark/light mode with system preference detection
- Responsive design (mobile-first)
- Form validation with error/success states
- Rate-limited API endpoints
- MongoDB storage with duplicate email prevention
- SEO optimized with Open Graph and Twitter cards
- Accessibility friendly with ARIA labels and keyboard navigation
