/**
 * useVideoRecorder — Screen-capture based recording
 *
 * Uses `getDisplayMedia({ preferCurrentTab: true })` to capture the
 * browser tab natively, then crops each frame to the target element's
 * bounding rect via a lightweight `drawImage()` call (GPU-accelerated,
 * sub-millisecond, zero DOM serialization).
 *
 * This approach avoids the main-thread blocking caused by html-to-image's
 * `toCanvas()` which serialises the entire DOM to SVG on each frame.
 *
 * Output: WebM (VP9 → VP8 → plain webm, auto-detected)
 */

import { useState, useEffect, useRef, RefObject } from "react";

export interface UseVideoRecorderReturn {
  isRecording: boolean;
  countdown: number | null;
  toggleRecording: () => void;
}

/** Pick the best supported WebM codec. */
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

  // Internal refs — never trigger re-renders
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const rafRef = useRef<number>(0);
  const displayStreamRef = useRef<MediaStream | null>(null);
  const videoElRef = useRef<HTMLVideoElement | null>(null);
  const stoppingRef = useRef(false);

  // ── Countdown 3-2-1 → startCapture ───────────────────────────────────────
  useEffect(() => {
    if (countdown === null) return;

    if (countdown === 0) {
      setCountdown(null);
      startCapture();
      return;
    }

    const timer = setTimeout(
      () => setCountdown((c) => (c !== null ? c - 1 : null)),
      1000,
    );
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown]);

  // ── Start capture ────────────────────────────────────────────────────────
  async function startCapture() {
    const el = targetRef.current;
    if (!el) return;

    try {
      // 1. Capture current browser tab — near-zero overhead
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          // @ts-expect-error — displaySurface hint isn't in strict TS types yet
          displaySurface: "browser",
          frameRate: { ideal: 30, max: 60 },
          width: { ideal: 3840 },
          height: { ideal: 2160 },
        },
        audio: false,
        // @ts-expect-error — Chrome-specific: auto-selects current tab
        preferCurrentTab: true,
        // @ts-expect-error — Chrome 112+: include self in the picker
        selfBrowserSurface: "include",
      });

      displayStreamRef.current = displayStream;

      // 2. Hidden <video> element to decode the stream
      const video = document.createElement("video");
      video.srcObject = displayStream;
      video.muted = true;
      video.playsInline = true;
      await video.play();
      videoElRef.current = video;

      // Wait until the video has real dimensions
      await new Promise<void>((resolve) => {
        if (video.videoWidth > 0) return resolve();
        video.addEventListener("loadedmetadata", () => resolve(), {
          once: true,
        });
      });

      // 3. Offscreen canvas sized to the element
      const rect = el.getBoundingClientRect();
      // Ensure minimum 2× for crisp output, even on 1× DPI screens
      const dpr = Math.max(window.devicePixelRatio || 1, 2);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const ctx = canvas.getContext("2d")!;
      // Enable image smoothing for quality scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      // 4. Lightweight render loop — just crop the tab capture to the element
      //    `drawImage(video, …)` is a GPU texture blit, < 1ms per frame
      const drawFrame = () => {
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

      // 5. Feed the cropped canvas stream into MediaRecorder
      const mimeType = getSupportedMimeType();
      const canvasStream = canvas.captureStream(30);
      const recorder = new MediaRecorder(canvasStream, {
        mimeType,
        videoBitsPerSecond: 6_000_000, // 8 Mbps for sharp, crisp quality
      });

      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.start(200); // collect chunk every 200ms
      recorderRef.current = recorder;
      stoppingRef.current = false;
      setIsRecording(true);

      // Handle user clicking browser's "Stop sharing" button
      displayStream.getVideoTracks()[0].addEventListener("ended", () => {
        if (!stoppingRef.current) stopCapture();
      });
    } catch (err) {
      console.error("Failed to start recording:", err);
      cleanup();
    }
  }

  // ── Stop, assemble & download ────────────────────────────────────────────
  function stopCapture() {
    if (stoppingRef.current) return;
    stoppingRef.current = true;

    // Stop the render loop
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    }

    const recorder = recorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      // Request any remaining data before stopping
      recorder.requestData();

      recorder.onstop = () => {
        const mime = recorder.mimeType || "video/webm";
        const blob = new Blob(chunksRef.current, { type: mime });

        if (blob.size > 0) {
          const ts = new Date()
            .toISOString()
            .replace(/[:.]/g, "-")
            .slice(0, 19);
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `wa-recording-${ts}.webm`;
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 5000);
        }

        cleanup();
      };

      recorder.stop();
    } else {
      cleanup();
    }

    setIsRecording(false);
  }

  // ── Cleanup all resources ────────────────────────────────────────────────
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

  // ── Public toggle ────────────────────────────────────────────────────────
  function toggleRecording() {
    if (isRecording) {
      stopCapture();
    } else {
      setCountdown(3);
    }
  }

  return { isRecording, countdown, toggleRecording };
}
