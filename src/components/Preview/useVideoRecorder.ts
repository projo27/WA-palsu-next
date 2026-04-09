import { useState, useEffect, useRef, RefObject } from "react";

export interface UseVideoRecorderReturn {
  isRecording: boolean;
  countdown: number | null;
  toggleRecording: () => void;
}

function getSupportedMimeType(): string {
  const candidates = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ];
  return (
    candidates.find((t) => MediaRecorder.isTypeSupported(t)) ?? "video/webm"
  );
}

export function useVideoRecorder(
  targetRef: RefObject<HTMLElement | null>,
): UseVideoRecorderReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const rafRef = useRef<number>(0);
  const displayStreamRef = useRef<MediaStream | null>(null);
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const stoppingRef = useRef(false);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setCountdown(null);
      startCapture();
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => (c !== null ? c - 1 : null)), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  async function startCapture() {
    const el = targetRef.current;
    if (!el) return;

    try {
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          // @ts-expect-error - displaySurface hint
          displaySurface: "browser",
          frameRate: { ideal: 30, max: 60 },
          width: { ideal: 3840 },
          height: { ideal: 2160 },
        },
        audio: false,
        // @ts-expect-error - Chrome specific
        preferCurrentTab: true,
        // @ts-expect-error - Chrome 112+
        selfBrowserSurface: "include",
      });

      displayStreamRef.current = displayStream;

      const video = document.createElement("video");
      video.srcObject = displayStream;
      video.muted = true;
      video.playsInline = true;
      await video.play();
      videoElRef.current = video;

      await new Promise<void>((resolve) => {
        if (video.videoWidth > 0) return resolve();
        video.addEventListener("loadedmetadata", () => resolve(), { once: true });
      });

      const rect = el.getBoundingClientRect();
      const dpr = Math.max(window.devicePixelRatio || 1, 2);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const ctx = canvas.getContext("2d")!;
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      const drawFrame = () => {
        if (stoppingRef.current) return;
        const r = el.getBoundingClientRect();
        const scaleX = video.videoWidth / window.innerWidth;
        const scaleY = video.videoHeight / window.innerHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(
          video,
          r.left * scaleX,
          r.top * scaleY,
          r.width * scaleX,
          r.height * scaleY,
          0,
          0,
          canvas.width,
          canvas.height,
        );
        rafRef.current = requestAnimationFrame(drawFrame);
      };
      drawFrame();

      const mimeType = getSupportedMimeType();
      const canvasStream = canvas.captureStream(30);
      const recorder = new MediaRecorder(canvasStream, {
        mimeType,
        videoBitsPerSecond: 6_000_000,
      });

      chunksRef.current = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const fullBlob = new Blob(chunksRef.current, { type: mimeType });
        if (fullBlob.size > 0) {
          const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
          const url = URL.createObjectURL(fullBlob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `wa-recording-${ts}.webm`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          setTimeout(() => URL.revokeObjectURL(url), 5000);
        }
        cleanup();
        setIsRecording(false);
        stoppingRef.current = false;
      };

      recorder.onerror = (err) => {
        console.error("MediaRecorder error:", err);
        stopCapture();
      };

      recorder.start(1000); // Create a chunk every second
      recorderRef.current = recorder;
      setIsRecording(true);

      displayStream.getVideoTracks()[0].addEventListener("ended", () => {
        if (!stoppingRef.current) stopCapture();
      });

    } catch (err) {
      console.error("Failed to start recording:", err);
      cleanup();
    }
  }

  function stopCapture() {
    if (stoppingRef.current || !recorderRef.current) return;
    stoppingRef.current = true;

    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }

    if (recorderRef.current.state !== "inactive") {
      recorderRef.current.stop();
    } else {
      // If already inactive, manually trigger cleanup
      cleanup();
      setIsRecording(false);
      stoppingRef.current = false;
    }
  }

  function cleanup() {
    if (displayStreamRef.current) {
      displayStreamRef.current.getTracks().forEach((t) => t.stop());
      displayStreamRef.current = null;
    }
    if (videoElRef.current) {
      videoElRef.current.pause();
      videoElRef.current.srcObject = null;
      videoElRef.current = null;
    }
    recorderRef.current = null;
  }

  function toggleRecording() {
    if (isRecording) {
      stopCapture();
    } else {
      setCountdown(3);
    }
  }

  return { isRecording, countdown, toggleRecording };
}
