"use client";

import Link from "next/link";
import { gsap } from "gsap";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./Masonry.css";

export type MasonryItem = {
  id: string;
  img?: string;
  url: string;
  height: number;
  title?: string;
  typeLabel?: string | null;
};

type MasonryProps = {
  items: MasonryItem[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: "top" | "bottom" | "left" | "right" | "center" | "random";
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
};

type GridItem = MasonryItem & {
  x: number;
  y: number;
  w: number;
  h: number;
};

function resolveColumns(viewportWidth: number) {
  if (viewportWidth >= 640) return 2;
  return 1;
}

const useMeasure = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const update = () => setWidth(node.getBoundingClientRect().width);
    update();

    const ro = new ResizeObserver(() => update());
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  return [ref, width] as const;
};

function MasonryTile({
  item,
  colorShiftOnHover,
  scaleOnHover,
  hoverScale,
  onImageError,
}: {
  item: GridItem;
  colorShiftOnHover: boolean;
  scaleOnHover: boolean;
  hoverScale: number;
  onImageError: (id: string) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const showImage = Boolean(item.img);

  const handleMouseEnter = () => {
    if (!wrapperRef.current || !scaleOnHover) return;
    gsap.to(wrapperRef.current, {
      scale: hoverScale,
      duration: 0.3,
      ease: "power2.out",
    });
    if (colorShiftOnHover) {
      const overlay = wrapperRef.current.querySelector(".masonry-color-overlay");
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
    }
  };

  const handleMouseLeave = () => {
    if (!wrapperRef.current || !scaleOnHover) return;
    gsap.to(wrapperRef.current, {
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
    if (colorShiftOnHover) {
      const overlay = wrapperRef.current.querySelector(".masonry-color-overlay");
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
    }
  };

  return (
    <div
      ref={wrapperRef}
      data-key={item.id}
      className="masonry-item-wrapper"
      style={{
        left: item.x,
        top: item.y,
        width: item.w,
        height: item.h,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        href={item.url}
        className="masonry-item-link"
        aria-label={item.title ? `View project: ${item.title}` : undefined}
      >
        <div
          className={`masonry-item-img${showImage ? "" : " masonry-item-img--empty"}`}
        >
          {showImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.img}
              alt={item.title ?? "Project image"}
              className="masonry-item-photo"
              loading="lazy"
              decoding="async"
              onError={() => onImageError(item.id)}
            />
          ) : (
            <div aria-hidden className="masonry-item-shimmer" />
          )}

          {colorShiftOnHover && (
            <div className="masonry-color-overlay" aria-hidden />
          )}

          {(item.title || item.typeLabel) && (
            <div className="masonry-item-overlay">
              {item.typeLabel && (
                <span className="masonry-item-type">{item.typeLabel}</span>
              )}
              {item.title && (
                <span className="masonry-item-title">{item.title}</span>
              )}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}

export default function Masonry({
  items,
  ease = "power3.out",
  duration = 0.6,
  stagger = 0.05,
  animateFrom = "bottom",
  scaleOnHover = true,
  hoverScale = 0.97,
  blurToFocus = true,
  colorShiftOnHover = false,
}: MasonryProps) {
  const [containerRef, width] = useMeasure();
  const [columns, setColumns] = useState(1);
  const [failedImages, setFailedImages] = useState<Set<string>>(() => new Set());
  const hasAnimated = useRef(false);

  useLayoutEffect(() => {
    const updateColumns = () =>
      setColumns(resolveColumns(window.innerWidth));

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  const handleImageError = useCallback((id: string) => {
    setFailedImages((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const grid = useMemo(() => {
    if (!width) return [];

    const colHeights = new Array(columns).fill(0);
    const columnWidth = width / columns;
    const gap = 16;

    return items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = columnWidth * col;
      const tileHeight = child.height / 2;
      const y = colHeights[col];

      colHeights[col] += tileHeight + gap;

      return {
        ...child,
        img: failedImages.has(child.id) ? undefined : child.img,
        x,
        y,
        w: columnWidth,
        h: tileHeight,
      };
    });
  }, [columns, items, width, failedImages]);

  const containerHeight = useMemo(() => {
    if (!grid.length) return 0;
    return Math.max(...grid.map((item) => item.y + item.h));
  }, [grid]);

  const getEntranceOffset = useCallback(
    () => {
      let direction = animateFrom;

      if (animateFrom === "random") {
        const directions = ["top", "bottom", "left", "right"] as const;
        direction =
          directions[Math.floor(Math.random() * directions.length)] ?? "bottom";
      }

      switch (direction) {
        case "top":
          return { x: 0, y: -48 };
        case "bottom":
          return { x: 0, y: 48 };
        case "left":
          return { x: -48, y: 0 };
        case "right":
          return { x: 48, y: 0 };
        case "center":
          return { x: 0, y: 32 };
        default:
          return { x: 0, y: 40 };
      }
    },
    [animateFrom]
  );

  useLayoutEffect(() => {
    if (!grid.length) return;

    grid.forEach((item, index) => {
      const el = containerRef.current?.querySelector(
        `[data-key="${item.id}"]`
      ) as HTMLElement | null;
      if (!el) return;

      gsap.killTweensOf(el);
      el.style.left = `${item.x}px`;
      el.style.top = `${item.y}px`;
      el.style.width = `${item.w}px`;
      el.style.height = `${item.h}px`;

      if (!hasAnimated.current) {
        const offset = getEntranceOffset();
        gsap.fromTo(
          el,
          {
            opacity: 0,
            x: offset.x,
            y: offset.y,
            ...(blurToFocus && { filter: "blur(8px)" }),
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            ...(blurToFocus && { filter: "blur(0px)" }),
            duration: 0.75,
            ease: "power3.out",
            delay: index * stagger,
          }
        );
      } else {
        gsap.to(el, {
          left: item.x,
          top: item.y,
          width: item.w,
          height: item.h,
          duration,
          ease,
          overwrite: "auto",
        });
      }
    });

    hasAnimated.current = true;
  }, [
    grid,
    stagger,
    blurToFocus,
    duration,
    ease,
    getEntranceOffset,
    containerRef,
  ]);

  useEffect(() => {
    hasAnimated.current = false;
  }, [items]);

  if (!items.length) return null;

  const layoutReady = width > 0 && grid.length > 0;

  return (
    <div
      ref={containerRef}
      className="masonry-list"
      style={{ height: layoutReady ? containerHeight : 480 }}
    >
      {!layoutReady ? (
        <div className="masonry-loading" aria-hidden>
          {Array.from({ length: Math.min(items.length, columns || 1) }).map(
            (_, index) => (
              <div
                key={index}
                className="masonry-loading-tile"
                style={{ height: 220 + (index % 3) * 40 }}
              />
            )
          )}
        </div>
      ) : (
        grid.map((item) => (
          <MasonryTile
            key={item.id}
            item={item}
            colorShiftOnHover={colorShiftOnHover}
            scaleOnHover={scaleOnHover}
            hoverScale={hoverScale}
            onImageError={handleImageError}
          />
        ))
      )}
    </div>
  );
}
