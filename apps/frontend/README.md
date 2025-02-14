# 📂 **SkyShare Frontend**  
A **modern cloud-sharing platform** built with **React**, powered by a **NestJS backend**, and managed in a **TurboRepo monorepo**. SkyShare enables users to securely upload, manage, and share files seamlessly.

![SkyShare Banner](screenshots/banner.png)

---

## 🚀 **Features**
✅ Secure file sharing with authentication  
✅ Intuitive **drag-and-drop** file uploads  
✅ **PDF & document preview** with `react-pdf-viewer`  
✅ Real-time file updates with **Recoil state management**  
✅ Beautiful UI with **Ant Design & TailwindCSS**  
✅ Optimized with **TurboRepo** for efficient development  
✅ Supports **audio, video, image, and document** previews  
✅ **Favorite functionality** to save important files  
✅ **File sharing via email** to collaborate with other users  

---

## 📦 **Tech Stack**
- **Frontend**: React, Vite, TailwindCSS, Recoil, React Router, Ant Design  
- **Backend**: NestJS (handled separately in the monorepo)  
- **Build Tool**: TurboRepo  
- **State Management**: Recoil  
- **API Calls**: Axios  

---

## 🎨 **Screenshots**
Here are some screenshots of the frontend interface:

### 📁 **Dashboard View**
![Dashboard Screenshot](screenshots/dashboard.png)

### 📤 **File Upload**
![File Upload Screenshot](screenshots/upload.png)

### 🔍 **PDF Preview**
![PDF Preview Screenshot](screenshots/pdf_preview.png)

### 🎵 **Audio Preview**
![Audio Preview Screenshot](screenshots/audio_preview.png)

### 🎥 **Video Preview**
![Video Preview Screenshot](screenshots/video_preview.png)

### 📸 **Image Preview**
![Image Preview Screenshot](screenshots/image_preview.png)

### 📄 **Document Sharing**
![Document Sharing Screenshot](screenshots/document_sharing.png)

*(Make sure to replace these file names with actual screenshots in your repo under the `screenshots/` folder.)*

---

## 🛠 **Installation & Setup**

### ⚡ **Prerequisites**
- Node.js `>= 18`
- PNPM / Yarn / NPM (preferred: `pnpm`)
- TurboRepo installed globally _(optional)_

### 🏗️ **Step 1: Clone the repository**
```sh
git clone https://github.com/shray-jayn/SkyShare.git
cd apps
cd frontend
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

### 🏃 **Step 3: Start the frontend app**
```sh
pnpm dev  # or yarn dev
```
Your SkyShare frontend will be running at **`http://localhost:5173`** (default Vite port).

---


## 🏗 **Build for Production**
To build the frontend:
```sh
pnpm build  # or yarn build
```
For a preview of the production build:
```sh
pnpm preview  # or yarn preview
```

---

## 📜 **Folder Structure**
```
/skyshare
  ├── /apps
  │   ├── /frontend   # React app (this repo)
  │   ├── /backend    # NestJS backend (handled separately)
  ├── /packages
  ├── turbo.json      # TurboRepo config
  ├── package.json
  ├── README.md
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

