import { getCurrentWindow } from "@tauri-apps/api/window";
const appWindow = getCurrentWindow();

export type ResizeDirection = 'East' | 'North' | 'NorthEast' | 'NorthWest' | 'South' | 'SouthEast' | 'SouthWest' | 'West';

type Handle = {
  direction: ResizeDirection;
  style: React.CSSProperties;
};

const EDGE = 5;    // px — thin edge handles
const CORNER = 10; // px — larger corner grab zones

const handles: Handle[] = [
  // Edges
  { direction: "North",     style: { top: 0, left: CORNER, right: CORNER, height: EDGE, cursor: "n-resize" } },
  { direction: "South",     style: { bottom: 0, left: CORNER, right: CORNER, height: EDGE, cursor: "s-resize" } },
  { direction: "East",      style: { right: 0, top: CORNER, bottom: CORNER, width: EDGE, cursor: "e-resize" } },
  { direction: "West",      style: { left: 0, top: CORNER, bottom: CORNER, width: EDGE, cursor: "w-resize" } },
  // Corners
  { direction: "NorthWest", style: { top: 0, left: 0, width: CORNER, height: CORNER, cursor: "nw-resize" } },
  { direction: "NorthEast", style: { top: 0, right: 0, width: CORNER, height: CORNER, cursor: "ne-resize" } },
  { direction: "SouthWest", style: { bottom: 0, left: 0, width: CORNER, height: CORNER, cursor: "sw-resize" } },
  { direction: "SouthEast", style: { bottom: 0, right: 0, width: CORNER, height: CORNER, cursor: "se-resize" } },
];

export function ResizeHandles() {
  return (
    <>
      {handles.map(({ direction, style }) => (
        <div
          key={direction}
          onMouseDown={(e) => {
            e.preventDefault();
            appWindow.startResizeDragging(direction);
          }}
          style={{
            position: "fixed",
            zIndex: 9999,
            ...style,
          }}
        />
      ))}
    </>
  );
}