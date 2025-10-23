# 🛰️ Twitch Chatbot

A lightweight, production-ready Twitch chatbot built in **TypeScript** using **tmi.js**, running in a fully isolated **Docker environment** with MySQL and Redis support.

This project showcases clean containerization, modular event-driven architecture, and reliable environment handling — ideal for demonstration, experimentation, or extension into a larger ecosystem.

---

## 🧩 Features

- **TypeScript + Node 20** runtime
- **tmi.js** for Twitch IRC chat interaction
- **Redis** + **MySQL** (isolated via Docker Compose)
- **Environment validation** with `dotenv`
- **Two-stage Docker build** (optimized for size & performance)
- Modular event listener architecture
- Minimal CPU and memory footprint (as low as 128MB)

---

## 🧰 Project Structure

```bash
src/
 ├─ config/
 │   ├─ env.config.ts       # Environment variable validation
 │   └─ tmi.config.ts       # TMI client configuration
 ├─ events/
 │   └─ tmi.events.ts       # Twitch chat event listeners
 ├─ main.ts                 # Application entrypoint
 └─ ...
Dockerfile
docker-compose.yml
.env
```

---

## ⚙️ Prerequisites

- [Docker Desktop](https://www.docker.com/)
- A Twitch account for your bot
- A valid **OAuth token** (see below)

---

## 🔑 Generating a Twitch OAuth Token

1. Go to this URL (replace `CLIENT_ID` with your bot’s client ID):

   ```bash
   https://id.twitch.tv/oauth2/authorize?client_id=CLIENT_ID
   &redirect_uri=http://localhost:3300
   &response_type=token
   &scope=chat:read+chat:edit+channel:moderate
   ```

2. Log in with the bot’s Twitch account and authorize access.

3. You’ll be redirected to your redirect URI — copy the `access_token` from the URL.

---

## 🧾 Environment Setup

Create a `.env` file in the project root:

```env
IRC_SERVER=irc.chat.twitch.tv
IRC_PORT=443
IRC_NICK=chatbot
IRC_TOKEN=oauth:your_twitch_oauth_token
IRC_CHANNEL=#yourchannel
```

---

## 🐳 Docker Usage

### Build and Run

```bash
docker compose up -d --build
```

This will:

- Build the bot (`chatbot-twitchbot`)
- Start MySQL (`chatbot-mysql`)
- Start Redis (`chatbot-redis`)

### Stop and Remove Containers

```bash
docker compose down -v
```

---

## 🧠 Verifying Containers

Check running containers:

```bash
docker ps
```

Connect to MySQL:

```bash
docker exec -it chatbot-mysql mysql -uroot -pexample -e "SHOW DATABASES;"
```

Ping Redis:

```bash
docker exec -it chatbot-redis redis-cli ping
```

Check bot logs:

```bash
docker logs -f chatbot-twitchbot
```

You should see:

```bash
[INFO] Connecting to irc-ws.chat.twitch.tv on port 443..
✅ connected to irc-ws.chat.twitch.tv:443 as chatbot
🎉 joined #yourchannel as chatbot
```

---

## 🧩 Configuration

| Variable      | Description                           |
| ------------- | ------------------------------------- |
| `IRC_NICK`    | Bot’s username                        |
| `IRC_TOKEN`   | Twitch OAuth token                    |
| `IRC_CHANNEL` | Channel to join (must start with `#`) |

---

## 📦 Resource Usage

| Container  | Memory  | CPU        | Notes               |
| ---------- | ------- | ---------- | ------------------- |
| Twitch Bot | ~128 MB | 0.25 core  | Lightweight runtime |
| MySQL      | ~256 MB | 0.25 core  | Persistent volume   |
| Redis      | ~32 MB  | negligible | In-memory cache     |

---

## 🚀 Future Improvements

- Add message logging and audit queue (Redis)
- Health checks for MySQL/Redis before bot startup
- Command system (`!status`, `!help`, etc.)
- Integration with Lumina metrics dashboard

---

## 🧑‍💻 Author

**John Desjardins**  
Ottawa, Canada  
[GitHub: desjjoh](https://github.com/desjjoh)

---

> _“Keep it modular. Keep it transparent. Keep it running.”_
