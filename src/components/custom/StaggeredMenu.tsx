"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

import "./StaggeredMenu.css";

export interface StaggeredMenuItem {
  label: string;
  ariaLabel: string;
  link: string;
  external?: boolean;
}

export interface StaggeredMenuSocialItem {
  label: string;
  link: string;
}

export interface StaggeredMenuCta {
  label: string;
  link: string;
  ariaLabel?: string;
  external?: boolean;
}

interface StaggeredMenuProps {
  position?: "left" | "right";
  colors?: string[];
  items?: StaggeredMenuItem[];
  socialItems?: StaggeredMenuSocialItem[];
  displaySocials?: boolean;
  displayItemNumbering?: boolean;
  className?: string;
  logoUrl?: string;
  menuButtonColor?: string;
  openMenuButtonColor?: string;
  accentColor?: string;
  changeMenuColorOnOpen?: boolean;
  isFixed?: boolean;
  embedded?: boolean;
  hideLogo?: boolean;
  closeOnClickAway?: boolean;
  cta?: StaggeredMenuCta;
  onMenuOpen?: () => void;
  onMenuClose?: () => void;
}

const panelEase = [0.22, 1, 0.36, 1] as const;

const StaggeredMenu = ({
  position = "right",
  colors = ["#D1C1A4", "#774931"],
  items = [],
  socialItems = [],
  displaySocials = false,
  displayItemNumbering = true,
  className,
  logoUrl = "/static/logo.webp",
  menuButtonColor = "#fff",
  openMenuButtonColor = "#170800",
  accentColor = "#774931",
  changeMenuColorOnOpen = true,
  isFixed = false,
  embedded = false,
  hideLogo = false,
  closeOnClickAway = true,
  cta,
  onMenuOpen,
  onMenuClose,
}: StaggeredMenuProps) => {
  const [open, setOpen] = useState(false);
  const [tappedIndex, setTappedIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  const preLayerColors = useMemo(() => {
    const raw = colors.length ? colors.slice(0, 4) : ["#D1C1A4", "#774931"];
    const arr = [...raw];
    if (arr.length >= 3) {
      const mid = Math.floor(arr.length / 2);
      arr.splice(mid, 1);
    }
    return arr;
  }, [colors]);

  const offscreenX = position === "left" ? "-100%" : "100%";

  const closeMenu = useCallback(() => {
    setOpen(false);
    setTappedIndex(null);
    onMenuClose?.();
  }, [onMenuClose]);

  const handleItemClick = useCallback(
    (idx: number) => {
      setTappedIndex(idx);
      window.setTimeout(() => {
        closeMenu();
      }, reduceMotion ? 0 : 260);
    },
    [closeMenu, reduceMotion]
  );

  const openMenu = useCallback(() => {
    setOpen(true);
    onMenuOpen?.();
  }, [onMenuOpen]);

  const toggleMenu = useCallback(() => {
    if (open) {
      closeMenu();
    } else {
      openMenu();
    }
  }, [closeMenu, open, openMenu]);

  useEffect(() => {
    if (!closeOnClickAway || !open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest(".staggered-menu-panel") &&
        !target.closest(".sm-toggle")
      ) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeOnClickAway, closeMenu, open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const toggleColor =
    open && changeMenuColorOnOpen ? openMenuButtonColor : menuButtonColor;

  const exitDuration = reduceMotion ? 0 : 0.32;

  const layerVariants = {
    closed: {
      x: offscreenX,
      transition: { duration: exitDuration, ease: [0.65, 0, 0.35, 1] },
    },
    open: (i: number) => ({
      x: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.5,
        ease: panelEase,
        delay: reduceMotion ? 0 : i * 0.07,
      },
    }),
  };

  const panelVariants = {
    closed: {
      x: offscreenX,
      transition: { duration: exitDuration, ease: [0.65, 0, 0.35, 1] },
    },
    open: {
      x: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.65,
        ease: panelEase,
        delay: reduceMotion ? 0 : preLayerColors.length * 0.07 + 0.08,
      },
    },
  };

  const itemVariants = {
    closed: { y: "140%", rotate: 10, opacity: 0 },
    open: (i: number) => ({
      y: 0,
      rotate: 0,
      opacity: 1,
      transition: {
        duration: reduceMotion ? 0 : 1,
        ease: panelEase,
        delay: reduceMotion ? 0 : 0.25 + i * 0.1,
      },
    }),
  };

  const MotionLink = motion.create(Link);
  const MotionAnchor = motion.a;

  const socialVariants = {
    closed: { y: 25, opacity: 0 },
    open: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        duration: reduceMotion ? 0 : 0.55,
        ease: panelEase,
        delay: reduceMotion ? 0 : 0.5 + i * 0.08,
      },
    }),
  };

  return (
    <div
      className={cn(
        "staggered-menu-wrapper",
        isFixed && "fixed-wrapper",
        embedded && "embedded-wrapper",
        className
      )}
      style={accentColor ? ({ ["--sm-accent" as string]: accentColor } as React.CSSProperties) : undefined}
      data-position={position}
      data-open={open || undefined}
    >
      <div className="staggered-menu-header" aria-label="Main navigation header">
        {!hideLogo && logoUrl && (
          <Link href="/" className="sm-logo mr-auto" aria-label="Home">
            <Image
              src={logoUrl}
              alt="Trikala Architects"
              width={88}
              height={32}
              className={cn("sm-logo-img", open && "invert")}
              priority
            />
          </Link>
        )}

        <motion.button
          type="button"
          className="sm-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="staggered-menu-panel"
          onClick={toggleMenu}
          animate={{ color: toggleColor }}
          transition={{ duration: 0.3, delay: open ? 0.18 : 0 }}
        >
          <svg
            className="sm-hamburger"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            {open ? (
              <>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M6 18L18 6M6 6l12 12"
                />
              </>
            ) : (
              <>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              </>
            )}
          </svg>
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <>
            {closeOnClickAway && (
              <motion.div
                className="sm-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={closeMenu}
                aria-hidden
              />
            )}

            <div className="sm-prelayers" aria-hidden="true">
              {preLayerColors.map((color, i) => (
                <motion.div
                  key={`${color}-${i}`}
                  className="sm-prelayer"
                  style={{ background: color, zIndex: preLayerColors.length - i }}
                  custom={i}
                  variants={layerVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                />
              ))}
            </div>

            <motion.aside
              id="staggered-menu-panel"
              className="staggered-menu-panel"
              aria-hidden={!open}
              variants={panelVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="sm-panel-inner">
                <ul
                  className="sm-panel-list"
                  role="list"
                  data-numbering={displayItemNumbering || undefined}
                >
                  {items.length ? (
                    items.map((item, idx) => {
                      const ItemTag = item.external ? MotionAnchor : MotionLink;
                      const itemProps = item.external
                        ? {
                            href: item.link,
                            target: "_blank",
                            rel: "noopener noreferrer",
                          }
                        : { href: item.link };

                      return (
                        <li className="sm-panel-itemWrap" key={`${item.label}-${idx}`}>
                          <motion.div
                            custom={idx}
                            variants={itemVariants}
                            initial="closed"
                            animate="open"
                          >
                            <div className="sm-panel-itemHit">
                              <AnimatePresence>
                                {tappedIndex === idx && (
                                  <motion.span
                                    className="sm-panel-itemHighlight"
                                    initial={{ opacity: 0, scaleX: 0.6 }}
                                    animate={{ opacity: 1, scaleX: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.22, ease: panelEase }}
                                    aria-hidden
                                  />
                                )}
                              </AnimatePresence>
                              <ItemTag
                                {...itemProps}
                                className={cn(
                                  "sm-panel-item",
                                  tappedIndex === idx && "is-tapped"
                                )}
                                aria-label={item.ariaLabel}
                                data-index={idx + 1}
                                onClick={() => handleItemClick(idx)}
                                whileTap={{ scale: reduceMotion ? 1 : 0.985 }}
                                animate={
                                  displayItemNumbering
                                    ? { "--sm-num-opacity": 1 }
                                    : undefined
                                }
                                initial={
                                  displayItemNumbering
                                    ? { "--sm-num-opacity": 0 }
                                    : undefined
                                }
                                transition={{
                                  duration: reduceMotion ? 0 : 0.6,
                                  delay: reduceMotion ? 0 : 0.35 + idx * 0.08,
                                }}
                              >
                                <span className="sm-panel-itemLabel">{item.label}</span>
                              </ItemTag>
                            </div>
                          </motion.div>
                        </li>
                      );
                    })
                  ) : (
                    <li className="sm-panel-itemWrap" aria-hidden="true">
                      <span className="sm-panel-item">
                        <span className="sm-panel-itemLabel">No items</span>
                      </span>
                    </li>
                  )}
                </ul>

                {displaySocials && socialItems.length > 0 && (
                  <div className="sm-socials" aria-label="Social links">
                    <motion.h3
                      className="sm-socials-title"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                    >
                      Socials
                    </motion.h3>
                    <ul className="sm-socials-list" role="list">
                      {socialItems.map((social, i) => (
                        <li key={`${social.label}-${i}`} className="sm-socials-item">
                          <motion.a
                            href={social.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="sm-socials-link"
                            custom={i}
                            variants={socialVariants}
                            initial="closed"
                            animate="open"
                          >
                            {social.label}
                          </motion.a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {cta && (
                  <motion.div
                    className="sm-panel-cta"
                    initial={{ y: 24, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      duration: reduceMotion ? 0 : 0.55,
                      ease: panelEase,
                      delay: reduceMotion ? 0 : 0.45 + items.length * 0.06,
                    }}
                  >
                    <motion.a
                      href={cta.link}
                      className="sm-panel-cta-button"
                      aria-label={cta.ariaLabel ?? cta.label}
                      target={cta.external ? "_blank" : undefined}
                      rel={cta.external ? "noopener noreferrer" : undefined}
                      onClick={closeMenu}
                      whileTap={{ scale: reduceMotion ? 1 : 0.98 }}
                    >
                      {cta.label}
                    </motion.a>
                  </motion.div>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StaggeredMenu;
