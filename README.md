# sonusX32

## How I got started with this project?
As a sound engineer at my church, I have dealt with issues managing files related to the Behringer Digital Mixer X32. We used scenes and channels with a different church, and often faced issues such as accidentally deleting files that were not theirs or ours. Additionally, we have overwritten or lost files that were essential for our ministries. 

Therefore, I developed a sound engineering file management platform specialized for the Behringer X32. I named the system **sonusX32**, where **"Sonus" means sound in Latin**, and **"X32"** comes from the Behringer X32 mixer.

## Features

### 🎛️ Intelligent File Organization
- Categorize recordings by **date, event, scene, and channel settings**.
- Create **customizable folder structures** to store recorded audio, scene files, and presets.
- Implement **metadata tagging** for quick search and retrieval (e.g., “Sunday Worship”, “Choir Rehearsal”).

### 🔄 Automatic Scene Management for Church Events
- Schedule **automatic scene switching** based on church events.
- Sync with **Google Calendar or internal scheduling system** to load the correct scenes at the right time.
- Assign **pre-configured scenes for different events** (e.g., Sermon, Choir, Wedding, Youth Service).

### 💾 Secure & Redundant Storage System
- **Auto-save** and **auto-backup** to prevent accidental data loss.
- Support for **cloud storage integration** (Google Drive, Dropbox, OneDrive).
- **Version history** to revert to previous scene settings if needed.

### 🔍 Quick Access & Retrieval
- Search recordings, scenes, and channels by **keywords, tags, or date**.
- **Graphical interface** showing a timeline of past recordings and scene changes.
- One-click **restore** previous settings if something goes wrong.

### 🖥️ User-Friendly Interface
- **Drag & drop** functionality to move recordings and scenes between folders.
- **Color-coded interface** to differentiate between event types.
- **Mobile and tablet compatibility** for quick access.

### 🎚️ Integration with Behringer X32
- Direct **import/export** of scenes and settings.
- Support for **remote control** via **Behringer X32 Edit Software API**.
- Automated file renaming based on **event type and date**.

### ⏳ Live Event Automation & Alerts
- Auto-adjust mixer settings based on **pre-set preferences for specific speakers or bands**.
- Send **alerts** if a scene is not saved or if storage is running low.

## 📌 Tech Stack
- **Frontend**: Electron.js (for a desktop app), React (for web-based control)
- **Backend**: Node.js, Python (for automation & API integration)
- **Database**: SQLite / PostgreSQL (for storing metadata and schedules)
- **Storage**: Local storage with cloud backup options
- **API Integration**: Behringer X32 OSC API for real-time communication

## 🚀 Next Steps
- Would you like this as a **desktop-only program**, or should it also support **web & mobile access**?
- Would you prefer an **offline solution**, or should it **integrate with cloud storage**?
- Any specific **automation features** you'd like to include for different church events?

Let's build **sonusX32** into an intuitive, powerful, and **reliable file management system** for sound engineers! 🎶
