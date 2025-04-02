## 📦 Project Overview

This project is a **modern chat application** built using **React**, **Firebase**, and **Material UI**. It supports **real-time messaging**, **emoji integration**, and leverages **Zustand** for state management. Perfect as a starter project or for learning how to implement real-time features in web apps.

---

## 🚀 Features

- 🔥 Real-time chat using Firebase Firestore
- 💬 Emoji support with `emoji-picker-react`
- 🧠 State management with `Zustand`
- 🎨 Stylish and responsive UI with Material UI
- 🔔 Toast notifications via `react-toastify`
- ⚡ Lightning-fast development with Vite

---

## 🛠️ Tech Stack

| Tech            | Role                        |
|-----------------|-----------------------------|
| React           | Frontend framework          |
| Firebase        | Backend (auth & database)   |
| Material UI     | UI components               |
| Zustand         | Lightweight state manager   |
| Emoji Picker    | Emoji selection             |
| React Toastify  | Notifications               |
| Vite            | Build tool                  |

---

## 📂 Project Structure

```
Chat Application/
├── public/                  # Static assets
├── src/                     # Source code
│   ├── components/          # UI Components
│   ├── store/               # Zustand store
│   ├── firebase.js          # Firebase config
│   └── App.jsx              # Main App component
├── .env                     # Environment variables
├── package.json             # Dependencies & scripts
└── vite.config.js           # Vite configuration
```

---

## ⚙️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/chat-application.git
   cd chat-application
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a `.env` file with your Firebase config:
     ```
     VITE_API_KEY=your-api-key
     VITE_AUTH_DOMAIN=your-auth-domain
     VITE_PROJECT_ID=your-project-id
     VITE_STORAGE_BUCKET=your-storage-bucket
     VITE_MESSAGING_SENDER_ID=your-sender-id
     VITE_APP_ID=your-app-id
     ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

---

## 🧪 Scripts

| Command         | Description                 |
|----------------|-----------------------------|
| `npm run dev`  | Start the dev server        |
| `npm run build`| Create production build     |
| `npm run lint` | Lint the codebase           |
| `npm run preview` | Preview production build |

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.


---
