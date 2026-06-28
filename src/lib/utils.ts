import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const transition = {
  duration: 0.9,
  delay: 0.5,
  ease: [0.25, 0.1, 0.25, 1],
};
export const brurRenderVariant = {
  hidden: { filter: "blur(10px)", transform: "translateY(20%)", opacity: 0 },
  visible: { filter: "blur(0)", transform: "translateY(0)", opacity: 1 },
};

export const shimmerBlur =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgZmlsbD0iIzFhMWExYSIvPjwvc3ZnPg==";

export const rollInView = {
  base: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
  transition: {
    type: "spring",
    stiffness: 100,
    damping: 10,
    restDelta: 0.001,
    duration: 0.3,
    delay: 0.3,
    when: "beforeChildren", //use this instead of delay
    staggerChildren: 0.2,
  },
};
