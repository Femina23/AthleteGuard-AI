import { useEffect, useState, useRef, useCallback } from 'react';
import { getCameraDevices, requestCameraPermission, stopMediaStream, waitForVideoReady } from '../utils/camera';
import type { CameraDevice } from '../types';

interface UseCameraOptions {
  deviceId?: string;
  autoStart?: boolean;
}

interface UseCameraReturn {
  stream: MediaStream | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isLoading: boolean;
  error: string | null;
  devices: CameraDevice[];
  selectedDeviceId: string;
  startCamera: (deviceId?: string) => Promise<void>;
  stopCamera: () => void;
  switchCamera: (deviceId: string) => Promise<void>;
}

export function useCamera({ deviceId: initialDeviceId, autoStart = false }: UseCameraOptions = {}): UseCameraReturn {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devices, setDevices] = useState<CameraDevice[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const loadDevices = useCallback(async () => {
    const cams = await getCameraDevices();
    setDevices(cams);
    if (cams.length > 0 && !selectedDeviceId) {
      const preferred = cams.find(c => c.label.toLowerCase().includes('back')) || cams[0];
      setSelectedDeviceId(preferred.deviceId);
    }
  }, [selectedDeviceId]);

  const startCamera = useCallback(async (deviceId?: string) => {
    const targetDeviceId = deviceId || selectedDeviceId || initialDeviceId;
    if (!targetDeviceId) {
      setError('No camera device selected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (streamRef.current) {
        stopMediaStream(streamRef.current);
      }

      const newStream = await requestCameraPermission(targetDeviceId);
      if (!newStream) {
        throw new Error('Failed to access camera');
      }

      streamRef.current = newStream;
      setStream(newStream);
      setSelectedDeviceId(targetDeviceId);

      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await waitForVideoReady(videoRef.current);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start camera');
      setStream(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedDeviceId, initialDeviceId]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      stopMediaStream(streamRef.current);
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setStream(null);
  }, []);

  const switchCamera = useCallback(async (deviceId: string) => {
    await startCamera(deviceId);
  }, [startCamera]);

  useEffect(() => {
    loadDevices();
  }, [loadDevices]);

  useEffect(() => {
    if (autoStart) {
      startCamera();
    }

    return () => {
      stopCamera();
    };
  }, []);

  return {
    stream,
    videoRef,
    isLoading,
    error,
    devices,
    selectedDeviceId,
    startCamera,
    stopCamera,
    switchCamera,
  };
}
