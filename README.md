# Personal Portfolio Website (Full-Stack)

**Frontend:** HTML, CSS, JavaScript · **Backend:** Node.js + Express · **Database:** MongoDB (Atlas)

## Run locally
1. `npm install`
2. Copy `.env.example` to `.env` and set `MONGODB_URI` (free cluster at mongodb.com/atlas) and `ADMIN_KEY`.
3. `npm run seed` (adds sample projects)
4. `npm start` → open http://localhost:3000

## API
| Method | Route | Notes |
|---|---|---|
| GET | `/api/projects` | List projects |
| POST | `/api/projects` | Add project (header `x-admin-key`) |
| DELETE | `/api/projects/:id` | Remove project (header `x-admin-key`) |
| POST | `/api/contact` | Save contact message |

Add a project:
```
curl -X POST http://localhost:3000/api/projects -H "Content-Type: application/json" -H "x-admin-key: YOUR_KEY" \
 -d '{"title":"My App","description":"What it does","tech":["React"],"liveUrl":"https://...","repoUrl":"https://..."}'
```

## Deploy (Heroku)
```
git init && git add . && git commit -m "Portfolio"
heroku create your-name-portfolio
heroku config:set MONGODB_URI="..." ADMIN_KEY="..."
git push heroku main
heroku run npm run seed
```
In MongoDB Atlas, allow network access from `0.0.0.0/0` so Heroku can connect.
(Netlify hosts static sites only; to use it, host the `public/` folder there and the API on Heroku/Render.)

## Customize
Replace "Your Name" and the copy in `public/index.html`, then edit or replace the seeded projects in `seed.js`.
