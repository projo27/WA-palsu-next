import React, { useRef, useEffect } from "react";
import { Trash2, Download, Upload, Camera } from "lucide-react";
import { toPng } from "html-to-image";
import { Message, ChatSettings } from "../../types";
import { cn } from "../../lib/utils";
import { StatusBar } from "./StatusBar";
import { ChatHeader } from "./ChatHeader";
import { MessageBubble } from "./MessageBubble";
import { ChatFooter } from "./ChatFooter";
import { NavigationBar } from "./NavigationBar";
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

  // Custom cursor refs
  const deviceFrameRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  // Drag-to-scroll refs
  const chatMainRef = useRef<HTMLElement>(null);
  const isDragging = useRef(false);
  const dragStartY = useRef(0);
  const scrollStartTop = useRef(0);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Custom Assistive-Touch Cursor ──────────────────────────────────────────
  useEffect(() => {
    const frame = deviceFrameRef.current;
    const cursor = cursorRef.current;
    if (!frame || !cursor) return;

    const onMouseMove = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
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
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      frame.removeEventListener("mousemove", onMouseMove);
      frame.removeEventListener("mouseenter", onMouseEnter);
      frame.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // ── Drag-to-Scroll on Chat Content ────────────────────────────────────────
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

  // ── Screenshot ─────────────────────────────────────────────────────────────
  const handleScreenshot = async () => {
    const frame = deviceFrameRef.current;
    if (!frame) return;

    // Sembunyikan custom cursor sementara agar tidak ikut ter-capture
    if (cursorRef.current) cursorRef.current.style.opacity = "0";

    try {
      const dataUrl = await toPng(frame, {
        pixelRatio: 2,
        cacheBust: true,
      });

      const timestamp = new Date()
        .toISOString()
        .replace(/[:.]/g, "-")
        .slice(0, 19);
      const link = document.createElement("a");
      link.download = `wa-screenshot-${timestamp}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error("Error capturing screenshot:", error);
      alert("Gagal mengambil screenshot. Silakan coba lagi.");
    } finally {
      if (cursorRef.current) cursorRef.current.style.opacity = "";
    }
  };

  // ── Export / Import ────────────────────────────────────────────────────────
  const handleExport = () => {
    const exportData = { settings, messages };
    const json = JSON.stringify(exportData, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const timestamp = new Date()
      .toISOString()
      .replace(/[:.]/g, "-")
      .slice(0, 19);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wa-chat-${timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportClick = () => {
    importInputRef.current?.click();
  };

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
    // Reset agar file yang sama bisa di-import ulang
    e.target.value = "";
  };

  return (
    <div className="flex-1 flex items-center justify-center sticky top-8 h-full p-4 my-auto">
      {/* ── Assistive-Touch Cursor ── */}
      <div
        ref={cursorRef}
        className="pointer-events-none fixed z-9999"
        style={{
          opacity: 0,
          top: 0,
          left: 0,
          transform: "translate(-50%, -50%) scale(1)",
          transition: "transform 80ms ease, opacity 120ms ease",
        }}
        aria-hidden="true"
      >
        {/* Outer frosted ring */}
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
          {/* Inner dot */}
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

      <div className="relative h-full">
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
          </div>
        </div>

        {/* Floating Action Buttons for Preview */}
        <div className="absolute -right-16 top-0 flex flex-col gap-2">
          {/* Clear All */}
          <button
            onClick={clearAll}
            className="w-12 h-12 bg-red-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-red-600 active:scale-95 transition-all"
            title="Hapus semua pesan"
          >
            <Trash2 size={20} />
          </button>

          {/* Export Chat */}
          <button
            onClick={handleExport}
            className="w-12 h-12 bg-emerald-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-emerald-600 active:scale-95 transition-all"
            title="Export chat ke JSON"
          >
            <Download size={20} />
          </button>

          {/* Import Chat */}
          <button
            onClick={handleImportClick}
            className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-600 active:scale-95 transition-all"
            title="Import chat dari JSON"
          >
            <Upload size={20} />
          </button>

          {/* Hidden file input for import */}
          <input
            ref={importInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleImportFile}
            className="hidden"
          />

          {/* Screenshot */}
          <button
            onClick={handleScreenshot}
            className="w-12 h-12 bg-violet-500 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-violet-600 active:scale-95 transition-all"
            title="Screenshot ke PNG"
          >
            <Camera size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
