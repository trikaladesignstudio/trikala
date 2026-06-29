"use client";

import { Button } from "@/components/ui/button";
import { useScrollLock } from "@/context/ScrollContainerContext";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";

type PriceCalculatorOverlayProps = {
  open: boolean;
  projectType: string;
  projectImage?: string;
  onClose: () => void;
  children: ReactNode;
};

export default function PriceCalculatorOverlay({
  open,
  projectType,
  projectImage,
  onClose,
  children,
}: PriceCalculatorOverlayProps) {
  const { setScrollLocked } = useScrollLock();
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    setScrollLocked(true);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      setScrollLocked(false);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose, setScrollLocked]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <motion.div
          key="price-calculator-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`${projectType} price estimator`}
          initial={{ y: prefersReducedMotion ? 0 : 24 }}
          animate={{ y: 0 }}
          exit={{ y: prefersReducedMotion ? 0 : 16 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className={cn(
            "fixed inset-0 z-50 flex min-h-[100dvh] flex-col overflow-hidden bg-zinc-50",
            "shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
          )}
        >
          <header className="sticky top-0 z-10 shrink-0 border-b border-zinc-200/80 bg-zinc-50">
            <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                {projectImage ? (
                  <div className="relative hidden h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-zinc-200/80 sm:block">
                    <Image
                      src={projectImage}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                ) : null}
                <div className="min-w-0">
                  <p className="text-xs uppercase tracking-[0.14em] text-zinc-500">
                    Estimating
                  </p>
                  <h2 className="truncate font-silver text-xl tracking-tight text-zinc-900 sm:text-2xl md:text-3xl">
                    {projectType}
                  </h2>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClose}
                className="shrink-0 rounded-full border-zinc-200 bg-white px-3.5 font-semibold text-zinc-700 shadow-none hover:border-zinc-300 hover:bg-zinc-50 hover:text-black active:scale-[0.98]"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back
              </Button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto overscroll-contain bg-zinc-50">
            <div className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
              {children}
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body
  );
}
