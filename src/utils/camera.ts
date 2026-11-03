import type { CameraDevice } from '../types';

export async function getCameraDevices(): Promise<CameraDevice[]> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices
      .filter(device => device.kind === 'videoinput')
      .map(device => ({
        deviceId: device.deviceId,
        label: device.label || `Camera ${device.deviceId.slice(0, 8)}`,
        kind: 'videoinput' as const,
      }));
  } catch (error) {
    console.error('Failed to enumerate camera devices:', error);
    return [];
  }
}

export async function requestCameraPermission(deviceId?: string): Promise<MediaStream | null> {
  const constraints: MediaStreamConstraints = {
    video: {
      deviceId: deviceId ? { ideal: deviceId } : undefined,
      width: { ideal: 1280 },
      height: { ideal: 720 },
      frameRate: { ideal: 30 },
      facingMode: 'user',
    },
    audio: false,
  };

  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    return stream;
  } catch (error: any) {
    // If exact/ideal constraints failed, attempt basic fallback
    if (error?.name === 'OverconstrainedError' || error?.name === 'ConstraintNotSatisfiedError') {
      try {
        console.warn('Camera constraints rejected, trying basic video constraints');
        return await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      } catch (fallbackError) {
        console.error('Fallback camera request also failed:', fallbackError);
        throw fallbackError;
      }
    }
    console.error('Failed to get camera permission:', error);
    throw error;
  }
}

export function stopMediaStream(stream: MediaStream | null): void {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
}

export function createVideoElement(stream: MediaStream): HTMLVideoElement {
  const video = document.createElement('video');
  video.srcObject = stream;
  video.playsInline = true;
  video.muted = true;
  video.setAttribute('playsinline', '');
  return video;
}

export async function waitForVideoReady(video: HTMLVideoElement): Promise<void> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Video ready timeout'));
    }, 10000);

    video.onloadedmetadata = () => {
      clearTimeout(timeout);
      video.play().then(resolve).catch(reject);
    };

    video.onerror = () => {
      clearTimeout(timeout);
      reject(new Error('Video load error'));
    };
  });
}

export function getVideoFrame(video: HTMLVideoElement, canvas: HTMLCanvasElement): ImageData | null {
  if (video.videoWidth === 0 || video.videoHeight === 0) return null;

  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.drawImage(video, 0, 0);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

export function drawLandmarksOnCanvas(
  ctx: CanvasRenderingContext2D,
  landmarks: { x: number; y: number; visibility: number }[],
  connections: [number, number][],
  videoWidth: number,
  videoHeight: number,
  options: {
    showSkeleton?: boolean;
    showPoints?: boolean;
    pointColor?: string;
    lineColor?: string;
    pointRadius?: number;
    lineWidth?: number;
    minVisibility?: number;
  } = {}
): void {
  const {
    showSkeleton = true,
    showPoints = true,
    pointColor = '#00b8d4',
    lineColor = '#00b8d4',
    pointRadius = 4,
    lineWidth = 2,
    minVisibility = 0.5,
  } = options;

  const visibleLandmarks = landmarks.map((lm, i) => ({
    ...lm,
    x: lm.x * videoWidth,
    y: lm.y * videoHeight,
    index: i,
    visible: lm.visibility >= minVisibility,
  }));

  if (showSkeleton) {
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    connections.forEach(([start, end]) => {
      const startLm = visibleLandmarks[start];
      const endLm = visibleLandmarks[end];

      if (startLm?.visible && endLm?.visible) {
        ctx.beginPath();
        ctx.moveTo(startLm.x, startLm.y);
        ctx.lineTo(endLm.x, endLm.y);
        ctx.stroke();
      }
    });
  }

  if (showPoints) {
    visibleLandmarks.forEach(lm => {
      if (lm.visible) {
        ctx.fillStyle = pointColor;
        ctx.beginPath();
        ctx.arc(lm.x, lm.y, pointRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
}

export function drawAngleOnCanvas(
  ctx: CanvasRenderingContext2D,
  landmarks: { x: number; y: number }[],
  angleData: { joint: string; angle: number; landmarks: [number, number, number] }[],
  videoWidth: number,
  videoHeight: number
): void {
  ctx.font = '12px Inter, sans-serif';
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 3;

  angleData.forEach(({ joint, angle, landmarks: [a, b, c] }) => {
    const lmA = landmarks[a];
    const lmB = landmarks[b];
    const lmC = landmarks[c];

    if (!lmA || !lmB || !lmC) return;

    const x = lmB.x * videoWidth;
    const y = lmB.y * videoHeight;

    ctx.strokeText(`${joint}: ${angle.toFixed(1)}°`, x + 15, y - 15);
    ctx.fillText(`${joint}: ${angle.toFixed(1)}°`, x + 15, y - 15);
  });
}