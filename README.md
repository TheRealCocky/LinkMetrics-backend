# 🛠️ LinkedMetrics Backend

Backend of **LinkedMetrics**, built with **NestJS** and powered by **Prisma ORM** with **MongoDB**.  
Deployed on **Render** with full **CORS support**, **JWT Authentication**, and **REST API** for link rotation & analytics.  

---

## 🚀 Tech Stack

- ⚡ [NestJS](https://nestjs.com/) – Node.js framework for scalable apps  
- 🗄️ [MongoDB](https://www.mongodb.com/) – NoSQL database  
- 🧩 [Prisma](https://www.prisma.io/) – Type-safe ORM  
- 🔑 [JWT](https://jwt.io/) – Authentication & authorization  
- ☁️ [Render](https://render.com/) – Cloud hosting platform  

---

## 📸 Preview of Architecture

```mermaid
flowchart TD
    Client[🌐 Frontend (Next.js)] -->|REST API| Backend[NestJS Server]
    Backend -->|ORM| Prisma[Prisma]
    Prisma -->|Database| MongoDB[(MongoDB Atlas)]
