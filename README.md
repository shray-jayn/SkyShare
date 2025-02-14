# Turborepo Starter - SkyShare

This is the root **Turborepo** for **SkyShare**, a cloud-sharing platform that includes both **frontend** and **backend** applications.

---

## 🚀 **Using this Example**
Run the following command to create a new Turborepo:
```sh
npx create-turbo@latest
```

---

## 📦 **What's Inside?**
This Turborepo includes the following packages/apps:

### **Apps**
- `apps/frontend`: SkyShare **React** frontend
- `apps/backend`: SkyShare **NestJS** backend

### **Packages**
- `@repo/ui`: A shared React component library
- `@repo/eslint-config`: ESLint configurations (includes `eslint-config-next` and `eslint-config-prettier`)
- `@repo/typescript-config`: TypeScript configurations used throughout the monorepo

Each package/app is **100% TypeScript**.

---

## 🚀 **SkyShare Features**
✅ **User Authentication** (JWT-based authentication)  
✅ **File Upload & Management** (AWS S3 integration)  
✅ **Share Files via Public Links** (CloudFront signed URLs)  
✅ **Role-Based Access Control** (Admin/User roles)  
✅ **Favorite & Search Files** (Filter and categorize files)  
✅ **Email Notifications** (Mailersend integration)  
✅ **Prisma ORM** for **PostgreSQL** database management  
✅ **CORS & Security Configurations** (Environment-based access control)  
✅ **Search API** to find files efficiently  

---

## 🛠 **Utilities**
This Turborepo has additional tools already set up:
- **TypeScript** for static type checking
- **ESLint** for code linting
- **Prettier** for code formatting

---

## 🏗 **Setup & Build**
### 🔧 **Setup Locally**
1. **Clone the repository**
```sh
git clone https://github.com/shray-jayn/SkyShare.git
cd skyshare
```
2. **Install dependencies**
```sh
pnpm install
```
3. **Setup environment variables**
Create a `.env` file in the root directory and configure it with required values (database credentials, AWS, JWT, etc.).

4. **Run database migrations**
```sh
pnpm prisma migrate dev
```

### 🏗 **Build**
To build all apps and packages, run:
```sh
pnpm build
```

---

## 🏃 **Develop**
To develop all apps and packages, run:
```sh
pnpm dev
```

---

## ⚡ **Remote Caching**
Turborepo can use **Remote Caching** to share cache artifacts across machines, enabling you to share build caches with your team and CI/CD pipelines.

By default, Turborepo caches locally. To enable **Remote Caching**, you need a **Vercel** account. If you don't have an account, create one and enter the following commands:
```sh
cd skyshare
npx turbo login
```
This will authenticate the Turborepo CLI with your Vercel account.

Next, link your Turborepo to **Remote Cache** by running:
```sh
npx turbo link
```

---

## 🔗 **Useful Links**
Learn more about **Turborepo**:
- [Tasks](https://turbo.build/repo/docs/core-concepts/tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)

---

