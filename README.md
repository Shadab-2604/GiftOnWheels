# Premium Car Collection

A modern React-based car inventory management system with a beautiful UI and separate admin portal.

## Features

### User Features
- Browse premium car collection
- Advanced filtering (category, rarity, price)
- Search functionality
- Responsive design
- WhatsApp enquiry integration

### Admin Features
- Secure login portal (accessible at `/admin`)
- Add/Edit/Delete cars
- Upload car images
- Manage inventory status
- Configure WhatsApp number
- Change admin password

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
VITE_API_BASE_URL=https://gow-backend.onrender.com/api
```

3. Run development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Routes

- `/` - User view (public car listing)
- `/admin` - Admin login page
- `/admin/dashboard` - Admin dashboard (protected)

## Technologies

- React 18
- TypeScript
- React Router
- Tailwind CSS
- Lucide React Icons
- Vite

## Admin Access

The admin panel is hidden from regular users and only accessible via the `/admin` route.
"# GiftOnWheels" 
