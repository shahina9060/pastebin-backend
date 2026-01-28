Deployed URL
Frontend:
https://pastebin-frontend-five.vercel.app

Backend (API + HTML view):
https://pastebin-backend-one.vercel.app

Public Git Repositories
Backend Repository:
https://github.com/shahina9060/pastebin-backend

Frontend Repository:
https://github.com/shahina9060/pastebin-frontend

How to Run the App Locally: 
Clone the repositories
git clone https://github.com/shahina9060/pastebin-backend
git clone https://github.com/shahina9060/pastebin-frontend

Backend Setup
cd pastebin-backend
npm install

Create a .env file in the backend root:

MONGO_URI=your_mongodb_connection_string
BASE_URL=http://localhost:8000

Start the backend:

npm run dev

The backend will run on:

http://localhost:8000



Frontend Setup
cd pastebin-frontend
npm install
npm start

The frontend will run on:

http://localhost:3000

Persistence Layer

MongoDB is used as the persistence layer.

Mongoose is used as the ODM to define schemas and interact with the database.

Each paste is stored with content, expiration time (TTL), view limits, and view count.

Important Design Decisions

The backend is designed for serverless deployment on Vercel (no app.listen()).

Pastes can have optional expiration time and view limits.

All unavailable pastes (missing, expired, or view-limit exceeded) return HTTP 404.

Paste content is safely escaped before rendering HTML to prevent XSS attacks.

CORS is restricted to the deployed frontend and localhost.
