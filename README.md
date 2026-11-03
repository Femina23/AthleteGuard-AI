# AthleteGuard AI

AI-Powered Multi-Sport Performance Monitoring and Injury Risk Awareness System

## Features

- **Real-Time Pose Detection**: MediaPipe Pose Landmarker integration with webcam
- **Multi-Sport Analysis**: Squat, Running, and Basketball monitoring
- **Movement Risk Awareness**: Explainable rule-based feedback
- **Performance Analytics**: Charts and session history with Recharts
- **Privacy First**: All processing happens in-browser, no data uploaded

## Installation

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Demo Instructions

1. Open the application in your browser
2. Click "Get Started" or navigate to Sports Selection
3. Choose a sport (Strength Training recommended for demo)
4. Click "Start Live Monitoring"
5. Allow camera access when prompted
6. Click "Start Camera" then "Start Monitoring"
7. Perform squats in front of the camera
8. View real-time metrics, joint angles, and movement feedback
9. Stop monitoring to save the session
10. Check Dashboard, Analytics, and History pages

## Limitations

- Movement analysis is rule-based and educational only
- Not a medical diagnosis tool
- Requires good lighting and camera positioning
- MediaPipe model loads from CDN (requires internet)
- Performance depends on device capabilities

## Architecture

- Frontend: React + Vite + TypeScript
- Styling: Tailwind CSS
- Icons: Lucide React
- Animations: Framer Motion
- Charts: Recharts
- AI: MediaPipe Pose Landmarker (browser-based)
- Storage: Browser localStorage
