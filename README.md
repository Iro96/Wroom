<div align="center">
<a name="readme-top"></a>
<a href="https://github.com/Iro96/Wroom" target="_blank">
</a>

# 🚀 Wroom: OpenSources Real-Time Collaborative Editor

A sleek, dark-themed collaborative desktop editor built with **Electron** and **FastAPI**. Supports real-time editing via WebSocket, room-based sessions, and modern UI inspired by VS Code. Perfect for co-authoring code, notes, or files with no login required.

![image](https://github.com/Iro96/Wroom/blob/main/wroom.png)

[![Issues](https://img.shields.io/github/issues-raw/Iro96/Wroom)](https://github.com/Iro96/Wroom/issues)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/Iro96/Wroom/blob/main/LICENSE)
![GitHub Repo stars](https://img.shields.io/github/stars/Iro96/Wroom)

</div>

# 🚀 Wroom: Real-Time Collaborative Editor

A sleek, dark-themed collaborative desktop editor built with **Electron** and **FastAPI**. Supports real-time editing via WebSocket, room-based sessions, and modern UI inspired by VS Code. Perfect for co-authoring code, notes, or files with no login required.

</div>

---

## 🌟 Features

- 🔁 **Real-Time Collaboration** — Changes appear instantly for everyone in the room
- 🔐 **Author-Based Control** — Only the room creator can:
  - Copy invite link
  - Kick all members
  - Open new files (sync to all)
- 👥 **Live Editing for All** — All users (including the author) can:
  - Type and edit freely
  - Receive live content from others
- 🖥 **Cross-Platform Desktop App** — Built with Electron
- 🎨 **Modern UI** — Styled after Visual Studio Code in dark theme
- 📝 **File Support** — Markdown, DOCX, Excel, Code, and more
- 🔌 **Works Offline Locally** — Run backend and frontend together without cloud

---

## 🧠 How It Works

- Create a room → Unique room ID is generated
- Join with room ID → Editor syncs with author's content
- Type or paste → Changes broadcast to all others
- Author-only Permission: `Copy Room ID`, `Kick All Members`, `Open File`, `Save file directly`

---

## 📦 Folder Structure

```
Wroom/
├── backend/           # FastAPI + WebSocket backend
│   ├── main.py
│   ├── file_api.py
│   └── websocket_manager.py
├── electron/          # Electron-based frontend
│   ├── index.html
│   ├── main.js
│   ├── preload.js
│   ├── package-lock.json
│   └── package.json
├── shared/
│   ├── app.js
│   ├── styles.css
├── .gitignore
├── requirements.txt
├── README.md
└── LICENSE
```

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Python 3.8+
> Requires: fastapi 0.110.1, uvicorn 0.29.0 aiofiles 23.2.1, python-multipart 0.0.9

- Node.js (Electron frontend)

---

### Clone the repository
```bash
git clone https://github.com/Iro96/Wroom.git
cd Wroom
```

---

### 🐍 Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

---

### 💻 Frontend Setup (Electron)

```bash
cd electron
npm install
npm start
```

---

## 🧩 Information & Usage

### App Workflow

| Action                             | Description                                                                        |
| ---------------------------------- | ---------------------------------------------------------------------------------- |
| **Create Room**                    | Generates a unique room ID and registers the current user as the **author**.       |
| **Join Room**                      | Enter an existing room ID to join as a **member**.                                 |
| **Edit Document**                  | All users can edit the document. Changes are synced in real-time.                  |
| **Open File** (Author only)        | Author can load a local file into the editor. Contents are broadcast to all users. |
| **Save File**                      | Save the current editor content locally.                                           |
| **Kick All Members** (Author only) | Instantly removes all members from the room.                                       |
| **Copy Invite ID** (Author only)   | Copies the room ID to clipboard for inviting others.                               |
| **Leave Room**                     | Disconnects from the room and resets the UI.                                       |

### Roles and Permission

| Role   | Can Edit | Can Open Files | Can Kick Others | Can Copy Room ID |
| ------ | -------- | -------------- | --------------- | ---------------- |
| Author | ✅        | ✅              | ✅               | ✅                |
| Member | ✅        | ❌              | ❌               | ❌                |

---

## 🛡 License

Licensed under the **MIT License** — see [LICENSE](https://opensource.org/license/MIT) for more details.

---

## 🤝 Contributing

> We welcome pull requests and feedback!  
> Feel free to fork this repo and submit your improvements via PR.
> !Note: This Project still on working...

---

## 📈 Star History

[![Star History Chart](https://api.star-history.com/svg?repos=Iro96/Wroom&type=Date&theme=dark)](https://star-history.com/#Iro96/Wroom&Date)

---

<p align="right">
  <a href="#readme-top">↑ Back to Top ↑</a>
</p>
