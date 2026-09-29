import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";

const GAP = 8;
const MARGIN = 12;
/** Below this, a side is too cramped to scroll in comfortably; use the whole screen. */
const MIN_SIDE = 280;

/**
 * Open/close state and fixed positioning for a floating panel anchored to a
 * trigger. The panel is meant to render in a portal, so it is never clipped by
 * a scrolling dialog; it flips above the trigger when there is no room below
 * and closes on outside clicks and Escape.
 */
export function usePopover<T extends HTMLElement = HTMLElement>() {
  const anchorRef = useRef<T>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState<CSSProperties>({ position: "fixed", visibility: "hidden" });

  const close = useCallback(() => {
    setOpen(false);
    anchorRef.current?.focus();
  }, []);

  const place = useCallback(() => {
    const anchor = anchorRef.current?.getBoundingClientRect();
    const panel = panelRef.current;
    if (!anchor || !panel) return;

    // scrollHeight is the full content height even while a max-height is applied.
    const { offsetWidth: width, scrollHeight: height } = panel;
    const viewport = window.innerHeight;
    const spaceBelow = viewport - anchor.bottom - GAP - MARGIN;
    const spaceAbove = anchor.top - GAP - MARGIN;
    const left = Math.min(Math.max(MARGIN, anchor.left), window.innerWidth - width - MARGIN);

    // Prefer below, then above; if it fits neither, use the roomier side (or the
    // whole screen when both are cramped) and let the panel scroll inside, so
    // its end is always reachable.
    let top: number;
    let maxHeight: number | undefined;
    if (height <= spaceBelow) {
      top = anchor.bottom + GAP;
    } else if (height <= spaceAbove) {
      top = anchor.top - GAP - height;
    } else if (Math.max(spaceBelow, spaceAbove) >= MIN_SIDE) {
      maxHeight = Math.max(spaceBelow, spaceAbove);
      top = spaceBelow >= spaceAbove ? anchor.bottom + GAP : MARGIN;
    } else {
      maxHeight = viewport - 2 * MARGIN;
      top = MARGIN;
    }

    setStyle({ position: "fixed", top, left, maxHeight, overflowY: maxHeight ? "auto" : undefined, visibility: "visible" });
  }, []);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!panelRef.current?.contains(target) && !anchorRef.current?.contains(target)) setOpen(false);
    };

    // Content that changes while open (search results) can change the height.
    const resize = new ResizeObserver(place);
    for (const child of Array.from(panelRef.current?.children ?? [])) resize.observe(child);

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      resize.disconnect();
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, place]);

  /** Escape closes the panel only — stopped here so an enclosing dialog stays open. */
  const onPanelKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.stopPropagation();
      event.nativeEvent.stopImmediatePropagation();
      close();
    }
  };

  return {
    open,
    toggle: () => setOpen((value) => !value),
    show: () => setOpen(true),
    close,
    anchorRef,
    panelRef,
    panelStyle: style,
    onPanelKeyDown,
  };
}
