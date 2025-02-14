# 📂 **SkyShare Backend**  
A **secure and scalable backend** for **SkyShare**, a cloud-sharing platform. Built with **NestJS**, it integrates with **PostgreSQL** via Prisma ORM and leverages **AWS S3** for file storage.

![SkyShare Backend](screenshots/backend_banner.png)

---

## 🚀 **Features**
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

## 📦 **Tech Stack**
- **Backend Framework**: NestJS  
- **Database**: PostgreSQL (managed with Prisma ORM)  
- **Storage**: AWS S3 (CloudFront for secure sharing)  
- **Authentication**: JWT-based authentication  
- **Email Service**: Mailersend  
- **Testing**: Jest  
- **CI/CD**: Docker (optional deployment setup)  

---

## 🛠 **Installation & Setup**

### ⚡ **Prerequisites**
- Node.js `>= 18`
- PostgreSQL `>= 14`
- AWS S3 bucket setup
- PNPM / Yarn / NPM (preferred: `pnpm`)

### 🏗️ **Step 1: Clone the repository**
```sh
git clone https://github.com/shray-jayn/SkyShare.git
cd apps
cd backend
```

### 🚀 **Step 2: Install dependencies**
Using PNPM:
```sh
pnpm install
```
Or with Yarn:
```sh
yarn install
```

### 📄 **Step 3: Setup Environment Variables**
Create a `.env` file in the project root and configure:
```ini
DATABASE_URL="postgresql://username:password@localhost:5432/skyshare"
JWT_SECRET="your-jwt-secret"
JWT_EXPIRES_IN_SECONDS=86400  # 24 hours
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=ap-south-1
AWS_S3_BUCKET=skyshare-bucket
CLOUDFRONT_DOMAIN="AWS_CLOUDFRONT_DOMAIN"
CLOUDFRONT_KEYPAIR_ID="AWS_CLOUDFRONT_PUBLIC_KEY"
CLOUDFRONT_PRIVATE_KEY="OPENSSL_PRIVATE_KEY"
MAILERSEND_API_KEY=your-mailersend-api-key
CORS_ORIGIN=http://localhost:5173
```

### 🏃 **Step 4: Run Database Migrations**
```sh
pnpm prisma migrate dev
```

### 🚀 **Step 5: Start the backend server**
```sh
pnpm dev  # or yarn dev
```
Your SkyShare backend will be running at **`http://localhost:3000`**.

---

## 📜 **API Routes**
### 🔐 **Authentication**
- `POST /auth/signup` - User signup
- `POST /auth/login` - User login

### 📁 **File Management**
- `POST /files/upload-url` - Get a pre-signed S3 URL for uploads
- `GET /files` - Fetch all user files
- `GET /files/favorites` - Fetch all favorite files
- `DELETE /files/:id` - Delete a file
- `PUT /files/toggle-favorite/:id` - Mark/unmark a file as favorite

### 🔗 **File Sharing**
- `POST /share/:fileId` - Create a shareable link
- `GET /share/:linkToken` - Validate a share link
- `DELETE /share/:linkToken/revoke` - Revoke a shared link

### 🔍 Search API

- `POST /search` - Search for files by name, type, or category

### 📩 **Email Notifications**
- `POST /email/send` - Send an email with file details

---

## 📜 **Folder Structure**
```
/skyshare-backend
  ├── /src
  │   ├── /access    # Access module
  │   ├── /auth      # Authentication module
  │   ├── /files     # File management module
  │   ├── /mail      # Email notification service
  │   ├── /search    # Search module
  │   ├── /user      # User module
  ├── /prisma        # Prisma schema & migrations
  ├── .env           # Environment variables
  ├── package.json   # Dependencies & scripts
  ├── README.md      # Documentation
```

---

## 🏗 **Build for Production**
To build the backend:
```sh
pnpm build  # or yarn build
```

---

## 🔍 **Linting & Code Quality**
Run ESLint to check for code issues:
```sh
pnpm lint
```

---

## 💡 **Contributing**
🚀 We welcome contributions! Feel free to:
- Open an **issue** for bug reports or feature requests  
- Create a **pull request** with your improvements  

---

## 📜 **License**
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

---

## 💌 **Contact & Support**
Have questions or suggestions?  
Reach out via **[shrayjayn1@gmail.com](mailto:shrayjayn1@gmail.com)** or open an issue.

---

