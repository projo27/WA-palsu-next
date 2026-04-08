import React, { useRef, useEffect, useState } from "react";
import { Trash2, Download, Upload, Camera, Video, Square } from "lucide-react";
import { toPng } from "html-to-image";
import { Message, ChatSettings } from "../../types";
import { cn } from "../../lib/utils";
import { StatusBar } from "./StatusBar";
import { ChatHeader } from "./ChatHeader";
import { MessageBubble } from "./MessageBubble";
import { ChatFooter } from "./ChatFooter";
import { NavigationBar } from "./NavigationBar";
import { useVideoRecorder } from "./useVideoRecorder";
import bgDark from "../../assets/image/whatsapp-bg-dark.png";
import bgLight from "../../assets/image/whatsapp-bg-light.png";

interface PhonePreviewProps {
  settings: ChatSettings;
  messages: Message[];
  clearAll: () => void;
  onImport: (data: { settings: ChatSettings; messages: Message[] }) => void;
}

export const PhonePreview: React.FC<PhonePreviewProps> = ({
  settings,
  messages,
  clearAll,
  onImport,
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const importInputRef = useRef<HTMLInputElement>(null);

  // Recording wrapper — wraps device frame + cursor, this is the capture target
  const recordingWrapperRef = useRef<HTMLDivElement>(null);

  // Cursor ref — positioned absolute inside recordingWrapper (so it's captured in recordings)
  const deviceFrameRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Drag-to-scroll
  const chatMainRef = useRef<HTMLElement>(null);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const scrollStartTop = useRef(0);

  // Screenshot in-progress state (to hide cursor from PNG)
  const [screenshotting, setScreenshotting] = useState(false);

  // Video recorder hook
  const { isRecording, countdown, toggleRecording } = useVideoRecorder(recordingWrapperRef);

  // ── Auto-scroll to bottom on new messages ───────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Custom Assistive-Touch Cursor ────────────────────────────────────────
  // Cursor is now position:absolute inside recordingWrapper, so it is captured
  // in both screenshots (optionally hidden) and recordings.
  useEffect(() => {
    const frame = deviceFrameRef.current;
    const cursor = cursorRef.current;
    const wrapper = recordingWrapperRef.current;
    if (!frame || !cursor || !wrapper) return;

    const onMouseMove = (e: MouseEvent) => {
      // Position relative to the recording wrapper (= device frame position)
      const rect = wrapper.getBoundingClientRect();
      cursor.style.left = `${e.clientX - rect.left}px`;
      cursor.style.top = `${e.clientY - rect.top}px`;
    };

    const onMouseEnter = () => {
      cursor.style.opacity = "1";
      frame.style.cursor = "none";
    };

    const onMouseLeave = () => {
      cursor.style.opacity = "0";
      frame.style.cursor = "";
    };

    frame.addEventListener("mousemove", onMouseMove);
    frame.addEventListener("mouseenter", onMouseEnter);
    frame.addEventListener("mouseleave", onMouseLeave);
    // Still listen on window so the cursor dot position stays updated
    // even when moving fast across the frame edge
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      frame.removeEventListener("mousemove", onMouseMove);
      frame.removeEventListener("mouseenter", onMouseEnter);
      frame.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // ── Drag-to-Scroll ───────────────────────────────────────────────────────
  const onChatMouseDown = (e: React.MouseEvent<HTMLElement>) => {
    isDragging.current = true;
    dragStartY.current = e.clientY;
    scrollStartTop.current = chatMainRef.current?.scrollTop ?? 0;
    if (cursorRef.current) {
      cursorRef.current.style.transform = "translate(-50%, -50%) scale(0.75)";
    }
  };

  const onChatMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!isDragging.current || !chatMainRef.current) return;
    e.preventDefault();
    const delta = dragStartY.current - e.clientY;
    chatMainRef.current.scrollTop = scrollStartTop.current + delta;
  };

  const onChatMouseUp = () => {
    isDragging.current = false;
    if (cursorRef.current) {
      cursorRef.current.style.transform = "translate(-50%, -50%) scale(1)";
    }
  };

  // ── Screenshot → PNG (captures only device frame, cursor hidden) ─────────
  const handleScreenshot = async () => {
    const frame = deviceFrameRef.current;
    if (!frame) return;

    setScreenshotting(true);
    // Give React a tick to hide cursor before capturing
    await new Promise((r) => requestAnimationFrame(r));

    try {
      const dataUrl = await toPng(frame, { pixelRatio: 2, cacheBust: true });
      const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      const link = document.createElement("a");
      link.download = `wa-screenshot-${ts}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Screenshot error:", err);
      alert("Gagal mengambil screenshot. Silakan coba lagi.");
    } finally {
      setScreenshotting(false);
    }
  };

  // ── Export / Import JSON ─────────────────────────────────────────────────
  const handleExport = () => {
    const json = JSON.stringify({ settings, messages }, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const ts = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wa-chat-${ts}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => importInputRef.current?.click();

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (
          typeof parsed === "object" &&
          parsed !== null &&
          Array.isArray(parsed.messages) &&
          typeof parsed.settings === "object"
        ) {
          onImport(parsed);
        } else {
          alert(
            'Format JSON tidak valid. Pastikan file memiliki properti "messages" (array) dan "settings" (object).',
          );
        }
      } catch {
        alert("File tidak dapat dibaca. Pastikan file adalah JSON yang valid.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="flex-1 flex items-center justify-center sticky top-8 h-full p-4 my-auto">
      <div className="relative h-full">

        {/* ── Recording wrapper (device frame + cursor) ─────────────────── */}
        {/* This is the element captured by useVideoRecorder                */}
        <div ref={recordingWrapperRef} style={{ position: "relative", display: "inline-block" }}>

          {/* Assistive-Touch Cursor — absolute inside wrapper so it's captured */}
          <div
            ref={cursorRef}
            aria-hidden="true"
            style={{
              position: "absolute",
              pointerEvents: "none",
              zIndex: 9999,
              opacity: screenshotting ? 0 : undefined, // hide during PNG screenshot
              transform: "translate(-50%, -50%) scale(1)",
              transition: "transform 80ms ease, opacity 120ms ease",
              top: 0,
              left: 0,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.18)",
                border: "1.5px solid rgba(255,255,255,0.45)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.35)",
                backdropFilter: "blur(6px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: "rgba(200,200,200,0.20)",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.2)",
                }}
              />
            </div>
          </div>

          {/* Device Frame */}
          <div
            ref={deviceFrameRef}
            className={cn(
              "relative w-[380px] aspect-9/18 bg-black rounded-[3rem] p-3 shadow-2xl border-8 border-gray-800 overflow-hidden select-none",
              settings.layout === "desktop" &&
                "w-[600px] h-[400px] rounded-xl border-4",
            )}
          >
            {/* Screen Content */}
            <div
              className={cn(
                "w-full h-full rounded-4xl overflow-hidden flex flex-col relative",
                settings.isDarkMode
                  ? "bg-chat-dark text-[#e9edef]"
                  : "bg-chat-light text-[#111b21]",
              )}
              style={{
                backgroundColor: settings.chatBackgroundColor,
                fontFamily:
                  settings.layout === "android"
                    ? '"Roboto", sans-serif'
                    : '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
              }}
            >
              <StatusBar settings={settings} />
              <ChatHeader settings={settings} />

              {/* Chat Content — drag to scroll */}
              <main
                ref={chatMainRef}
                className="flex-1 overflow-y-auto p-3 space-y-2 relative custom-scrollbar"
                onMouseDown={onChatMouseDown}
                onMouseMove={onChatMouseMove}
                onMouseUp={onChatMouseUp}
                onMouseLeave={onChatMouseUp}
              >
                {/* Background Pattern */}
                <div
                  className="absolute h-full w-full inset-0 pointer-events-none bg-repeat opacity-[0.4] bg-size-[400px_auto]"
                  style={{
                    backgroundImage: `url(${settings.isDarkMode ? bgDark : bgLight})`,
                  }}
                />

                <div className="flex flex-col gap-1 relative z-10">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex flex-col">
                      <MessageBubble msg={msg} settings={settings} />
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </main>

              <ChatFooter settings={settings} />
              <NavigationBar settings={settings} />

              {/* ── 3-2-1 Countdown Overlay ─────────────────────────────── */}
              {countdown !== null && (
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  style={{ zIndex: 100, background: "rgba(0,0,0,0.55)" }}
                >
                  <span
                    key={countdown}
                    style={{
                      fontSize: 96,
                      fontWeight: 900,
                      color: "#fff",
                      lineHeight: 1,
                      textShadow: "0 0 40px rgba(255,255,255,0.6)",
                      animation: "countdown-pop 0.9s ease-out forwards",
                    }}
                  >
                    {countdown}
                  </span>
                </div>
              )}

              {/* ── Recording indicator dot ─────────────────────────────── */}
              {isRecording && (
                <div
                  className="absolute top-3 right-3 flex items-center gap-1.5 pointer-events-none"
                  style={{ zIndex: 100 }}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-red-500"
                    style={{ animation: "rec-blink 1s ease-in-out infinite" }}
                  />
                  <span className="text-[10px] font-bold text-red-400 tracking-wider">
                    REC
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* end recording wrapper */}

        {/* ── Floating Action Buttons (outside recording wrapper) ──────────── */}
        <div className="absolute -right-16 top-0 flex flex-col gap-2">
          {/* Clear All */}
          <button
            onClick={clearAll}
            className="w-12 h-12 bg-red-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-600 active:scale-95 transition-all"
            title="Hapus semua pesan"
          >
            <Trash2 size={20} />
          </button>

          {/* Export JSON */}
          <button
            onClick={handleExport}
            className="w-12 h-12 bg-emerald-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-600 active:scale-95 transition-all"
            title="Export chat ke JSON"
          >
            <Download size={20} />
          </button>

          {/* Import JSON */}
          <button
            onClick={handleImportClick}
            className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 active:scale-95 transition-all"
            title="Import chat dari JSON"
          >
            <Upload size={20} />
          </button>
          <input
            ref={importInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportFile}
            className="hidden"
          />

          {/* Screenshot PNG */}
          <button
            onClick={handleScreenshot}
            disabled={isRecording || countdown !== null}
            className="w-12 h-12 bg-violet-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-violet-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title="Screenshot ke PNG"
          >
            <Camera size={20} />
          </button>

          {/* Record / Stop Video */}
          <button
            onClick={toggleRecording}
            disabled={countdown !== null}
            className={cn(
              "w-12 h-12 rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed",
              isRecording
                ? "bg-red-600 hover:bg-red-700"
                : "bg-orange-500 hover:bg-orange-600",
            )}
            title={isRecording ? "Stop recording" : "Record video (WebM)"}
          >
            {isRecording ? (
              <Square size={18} fill="white" className="text-white" />
            ) : (
              <Video size={20} className="text-white" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
