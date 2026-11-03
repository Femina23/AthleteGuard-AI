# AthleteGuard AI

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React 19"/>
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/MediaPipe-Pose_Landmarker-FF6F00?style=for-the-badge&logo=google&logoColor=white" alt="MediaPipe"/>
</p>

<p align="center">
  <strong>Real-Time AI-Powered Pose Analysis & Form Correction for Athletes</strong>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage-guide">Usage Guide</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

---

## Overview

**AthleteGuard AI** is an intelligent, browser-based fitness analysis platform that leverages Google's MediaPipe Pose Landmarker to provide real-time biomechanical feedback during workouts. Built with modern web technologies, it helps athletes of all levels improve their form, prevent injuries, and track their progress through data-driven insights—all processed entirely on-device for maximum privacy. 

Whether you're perfecting your squat form, optimizing your running gait, or refining basketball landing mechanics, AthleteGuard AI acts as your personal AI coach, delivering instant feedback without the need for expensive wearables or cloud-based video processing.

---

## Features

### Core Functionality

- **Real-Time Pose Detection** - Utilizes MediaPipe Pose Landmarker for high-accuracy, 33-point body landmark tracking at up to 30 FPS directly in the browser.
- **Multi-Sport Analysis** - Tailored feedback for three key disciplines:
  - **Strength Training** - Squat form analysis with depth tracking, posture correction, and rep counting
  - **Running** - Gait analysis with cadence estimation, stride symmetry, and knee extension monitoring
  - **Basketball** - Jump mechanics and landing analysis with knee flexion and asymmetry detection
- **Intelligent Rep Counting** - Automated squat rep detection based on knee angle thresholds with precise phase tracking (standing, bottom, standing).
- **Live Movement Feedback** - Contextual, color-coded alerts for form issues including excessive forward lean, asymmetry, poor landing mechanics, and overextension.
- **Joint Angle Visualization** - Real-time display of key joint angles (knees, hips, ankles) with confidence scores.
- **Skeleton Overlay** - Optional visual pose skeleton and angle annotations rendered directly on the camera feed.

### Data & Analytics

- **Session History** - Complete log of all workouts with timestamps, durations, rep counts, metrics, and movement flags. Search and filter by sport type.
- **Performance Analytics Dashboard** - Interactive charts powered by Recharts showing session trends, rep progression, duration analysis, sport distribution, and movement flag frequency over time.
- **Per-Sport Insights** - Dedicated breakdowns for each sport with total sessions, time spent, reps completed, and flagged movements.
- **Local Data Persistence** - All session data stored securely in `localStorage` with no external database or cloud sync required.
- **Demo Mode** - Built-in sample dataset (22 realistic sessions) for testing and demonstrations without a camera or workout history.

### User Experience

- **Modern Dark UI** - Sleek, athletic-themed interface with smooth Framer Motion animations
- **Responsive Design** - Fully optimized for desktop and tablet experiences
- **Quick Start Actions** - One-click navigation to start analyzing your preferred sport
- **Settings Panel** - Customize camera resolution, FPS, overlay visibility, and preferences
- **Error Boundaries** - Robust error handling for graceful degradation
- **Educational Disclaimers** - Clear messaging that feedback is for educational purposes only, not medical diagnosis

---

## Demo

Want to see it in action without a camera? 

1. Launch the app and navigate to **Settings**
2. Go to **Demo Data Mode** and click **Load Demo Data**
3. Explore the populated **Dashboard**, **Analytics**, and **History** pages with 22 pre-generated realistic sessions across all three sports

---

## Tech Stack

| Category | Technologies |
| --- | --- |
| **Framework** | [React 19](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 8.3](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) |
| **Computer Vision** | [Google MediaPipe Pose Landmarker](https://developers.google.com/mediapipe/solutions/vision/pose_landmarker) |
| **Data Visualization** | [Recharts](https://recharts.org/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Routing/State** | React Context API |
| **Linting** | [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) |

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v18.0.0 or higher
- [npm](https://www.npmjs.com/) v9.0.0 or higher
- A modern browser with WebRTC support (Chrome, Edge, Firefox recommended)
- A webcam for live monitoring

### Setup Steps

```bash
# 1. Clone the repository
git clone https://github.com/Femina23/AthleteGuard-AI.git

# 2. Navigate to the project directory
cd AthleteGuard-AI/athlete-guard-ai

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Type-check with `tsc` and build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run Oxlint for code quality checks |

---

## Usage Guide

### Getting Started

1. **Launch** - Open the app in your browser and log in (demo authentication)
2. **Select Your Sport** - Navigate to "Sports" and choose Strength Training, Running, or Basketball
3. **Prepare** - Click "Start Camera" to enable your webcam. Ensure you're fully visible in frame
4. **Analyze** - Click "Start Monitoring" to begin real-time pose analysis
5. **Review** - Click "Stop Monitoring" or "Stop Camera" to save your session and view results in History/Analytics

### Tips for Best Results

- **Lighting**: Use well-lit environments for optimal pose detection accuracy
- **Framing**: Position yourself so your full body is visible in the camera frame
- **Clothing**: Wear form-fitting clothing for better landmark detection
- **Space**: Ensure adequate space around you for movement (especially for squats and jumps)
- **Stability**: Use a stable camera setup (tripod or fixed position recommended)

### Understanding the Feedback

| Indicator | Meaning |
| --- | --- |
| **Green (Info)** | Good form or no issues detected |
| **Yellow (Warning)** | Form deviation detected - consider adjusting your technique |
| **Red (Critical)** | Significant form issue requiring immediate attention |
| **Joint Angles** | Real-time measurements in degrees with confidence percentage |
| **Rep Count** | Automatically tracked for strength training sessions |

---

## Architecture

### Project Structure

```
athlete-guard-ai/
├── src/
│   ├── components/      # Reusable UI components (Cards, Buttons, Layouts)
│   ├── context/         # React Context for global state management
│   ├── hooks/           # Custom hooks (useCamera, useMediaPipePose, useSessionManager)
│   ├── pages/           # Route-level page components
│   ├── utils/           # Helper functions (calculations, storage, demo data)
│   ├── types/           # TypeScript type definitions
│   └── constants/       # App constants and configurations
├── public/              # Static assets
└── dist/                # Production build output
```

### Key Components

- **`useMediaPipePose`** - Manages MediaPipe Pose Landmarker initialization, model loading, and real-time landmark detection
- **`usePoseReliability`** - Validates pose tracking quality based on landmark visibility and sport-specific requirements
- **`useSessionManager`** - Handles in-memory session tracking during live monitoring
- **`AppContext`** - Central state management for sessions, settings, auth, and demo mode with localStorage persistence
- **`calculations.ts`** - Biomechanical calculations (joint angles, forward lean, symmetry) and form analysis algorithms
- **`LiveMonitoring`** - Main analysis interface orchestrating camera, pose detection, and real-time feedback

### Data Flow

1. **Capture** - Webcam stream captured via `getUserMedia`
2. **Detection** - MediaPipe processes frames and returns 33 body landmarks
3. **Analysis** - Custom algorithms calculate angles, symmetry, and form metrics
4. **Feedback** - Real-time UI updates with rep counts, flags, and visual overlays
5. **Persistence** - Session finalized on stop and saved to localStorage via AppContext

---

## Privacy & Security

- **100% Client-Side** - All pose detection and analysis runs locally in your browser using WebAssembly
- **No Data Transmission** - Camera feeds and biometric data never leave your device
- **Local Storage Only** - Sessions stored in browser localStorage, fully under your control
- **No Third-Party Tracking** - No analytics, cookies, or external data collection
- **Offline Capable** - After initial model load, core functionality works offline

---

## Browser Compatibility

| Browser | Support | Notes |
| --- | --- | --- |
| Chrome | ✅ Fully Supported | Recommended for best performance |
| Edge | ✅ Fully Supported | Chromium-based, works well |
| Firefox | ⚠️ Partial | MediaPipe may have performance variations |
| Safari | ⚠️ Limited | WebRTC/WebAssembly support varies |

*Requires camera permissions and modern JavaScript/WebAssembly support.*

---

## Known Limitations

- **Lighting Dependent** - Accuracy decreases in poor lighting conditions
- **Single Person Tracking** - Optimized for single-user analysis
- **Camera Required** - Live monitoring requires a webcam; use Demo Mode otherwise
- **Educational Use** - Not a substitute for professional coaching or medical advice
- **Performance** - May require a reasonably modern device for smooth 30 FPS tracking

---

## Roadmap

- [ ] Multi-angle analysis support
- [ ] Export session reports as PDF
- [ ] Additional sport types (Weightlifting, Yoga, etc.)
- [ ] Custom workout programs
- [ ] Mobile responsive improvements
- [ ] Offline PWA support

---

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please ensure your code follows the existing style, passes linting checks, and includes appropriate documentation.

---

## License

This project is developed for educational and academic purposes. See the repository for more details.

---

## Acknowledgments

- [Google MediaPipe](https://developers.google.com/mediapipe) - For the incredible pose estimation models
- [Vite](https://vitejs.dev/) - For blazing fast development experience
- [React](https://react.dev/) - For the robust UI framework
- [Tailwind CSS](https://tailwindcss.com/) - For beautiful, utility-first styling

---

## Author

**Femina**  

<p align="center">
  <strong>Train Smarter. Move Better. Perform Stronger.</strong>
</p>
