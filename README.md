# AthleteGuard AI

AI-powered real-time pose analysis for athletes. Track form, count reps, and get instant movement feedback using MediaPipe Pose Landmarker.

## Features

- **Live AI Monitoring** – Real-time pose detection and form analysis via MediaPipe Pose Landmarker
- **Multi-Sport Support** – Strength Training (Squats), Running, and Basketball
- **Smart Rep Counting** – Automatic rep detection for strength workouts
- **Movement Feedback** – Instant warnings for form issues, symmetry, and posture
- **Session History** – Track and review all your past workouts with detailed metrics
- **Performance Analytics** – Visualize trends, reps, duration, and movement flags
- **Demo Mode** – Explore the app with realistic sample data without needing a camera
- **Dark Theme UI** – Clean, modern interface built with Tailwind CSS

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS + Framer Motion
- **AI/Vision:** MediaPipe Pose Landmarker
- **Charts:** Recharts
- **Icons:** Lucide React
- **Storage:** localStorage (client-side only)

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Femina23/AthleteGuard-AI.git
cd AthleteGuard-AI/athlete-guard-ai

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

## Usage

1. **Login/Dashboard** – Get an overview of your training stats
2. **Select Sport** – Choose from Strength Training, Running, or Basketball
3. **Start Monitoring** – Enable camera and begin live AI analysis
4. **Get Feedback** – View joint angles, rep counts, and real-time form corrections
5. **Review History** – Check past sessions in History or dive into Analytics

## Privacy

All data is stored locally in your browser via `localStorage`. No data is sent to external servers. Camera processing happens entirely on-device using MediaPipe.

## License

This project is for educational purposes.

## Author

[Femina23](https://github.com/Femina23)
