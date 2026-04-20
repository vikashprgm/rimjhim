import { getCurrentWindow } from "@tauri-apps/api/window";

export function Titlebar({ title = "Untitled Note" }: { title?: string }) {
  const appWindow = getCurrentWindow();

  return (
    <div
      className="titlebar"
      style={{
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 12px",
        borderBottom: "1px solid hsl(var(--border))",
        background: "hsl(var(--background))",
        flexShrink: 0,
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      {/* Left: Logo + name + active note title */}
      <div
        data-tauri-drag-region
        style={{ display: "flex", alignItems: "center", gap: "7px", flex: 1 }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="3" fill="#7F77DD" />
          <circle cx="8" cy="8" r="6.5" stroke="#7F77DD" strokeWidth="1" />
          <path d="M8 3 Q11 5.5 8 8 Q5 10.5 8 13" stroke="#7F77DD" strokeWidth="1" fill="none" />
        </svg>
        <span style={{ fontSize: "12px", fontWeight: 500 }}>RimJhim</span>
        {title && (
          <span style={{ fontSize: "11px", color: "hsl(var(--muted-foreground))", marginLeft: "2px" }}>
            — {title}
          </span>
        )}
      </div>

      {/* Center: pure drag region */}
      <div data-tauri-drag-region style={{ flex: 1, height: "100%" }} />

      {/* Right: window controls (macOS-style) */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {[
          { color: "#FFBD2E", action: () => appWindow.minimize(), label: "minimize" },
          { color: "#28C941", action: () => appWindow.toggleMaximize(), label: "maximize" },
          { color: "#FF5F57", action: () => appWindow.close(), label: "close" },
        ].map(({ color, action, label }) => (
          <button
            key={label}
            onClick={action}
            aria-label={label}
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              background: color,
              border: "none",
              cursor: "pointer",
              padding: 0,
              flexShrink: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}