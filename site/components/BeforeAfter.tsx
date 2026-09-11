'use client';

import Image from 'next/image';
import { useCallback, useEffect, useId, useRef, useState } from 'react';

type Frame = {
  src: string;
  alt: string;
  /**
   * object-position for this image inside the 3:4 crop. These are real phone
   * photos taken months apart, not a locked-off tripod pair, so the two halves
   * need to be nudged independently to make the same surface line up across
   * the wet edge.
   */
  focus?: string;
};

type Props = {
  before: Frame;
  after: Frame;
  /** Fallback focus when a frame does not set its own. */
  focus?: string;
  /** Render the after image at high priority (hero only). */
  priority?: boolean;
  label?: string;
  /** Corner tags, localized by the caller. */
  beforeLabel?: string;
  afterLabel?: string;
};

/**
 * "The wet edge" — the site's signature interaction.
 *
 * A wet edge is the live boundary a painter keeps moving so a coat dries
 * without lap marks: the exact line where old becomes new. Here it is the
 * interface.
 *
 * Accessibility and resilience:
 *  - The handle is a real <input type="range">, so it is keyboard operable,
 *    announced by screen readers, and works under touch without custom
 *    pointer maths.
 *  - Dragging anywhere on the image also moves it (pointer events on the
 *    frame), because that is what people try first.
 *  - With JS off, CSS leaves the clip at 50% and both images are still in the
 *    DOM with full alt text, so the proof survives.
 */
export default function BeforeAfter({
  before,
  after,
  focus = 'center 50%',
  priority = false,
  label = 'Reveal the finished work',
  beforeLabel = 'Before',
  afterLabel = 'After',
}: Props) {
  const [pct, setPct] = useState(50);
  const [dragging, setDragging] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const id = useId();

  const setFromClientX = useCallback((clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width === 0) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPct(Math.min(100, Math.max(0, next)));
  }, []);

  // Pointer drag on the frame itself. Listeners live on window while dragging
  // so the gesture survives the cursor leaving the element.
  useEffect(() => {
    if (!dragging) return;
    const move = (e: PointerEvent) => {
      e.preventDefault();
      setFromClientX(e.clientX);
    };
    const up = () => setDragging(false);
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
    };
  }, [dragging, setFromClientX]);

  return (
    <figure className="ba" style={{ ['--pct' as string]: `${pct}%` }}>
      <div
        ref={frameRef}
        className={`ba-frame${dragging ? ' is-dragging' : ''}`}
        onPointerDown={(e) => {
          // Let the range input handle its own drags.
          if ((e.target as HTMLElement).closest('.ba-range')) return;
          setDragging(true);
          setFromClientX(e.clientX);
        }}
      >
        {/* AFTER sits underneath, full-bleed. */}
        <Image
          src={after.src}
          alt={after.alt}
          fill
          priority={priority}
          sizes="(max-width: 760px) 94vw, (max-width: 1200px) 60vw, 640px"
          style={{ objectFit: 'cover', objectPosition: after.focus ?? focus }}
        />

        {/* BEFORE is clipped from the left edge to the wet edge. */}
        <div className="ba-clip" aria-hidden="true">
          <Image
            src={before.src}
            alt=""
            fill
            priority={priority}
            sizes="(max-width: 760px) 94vw, (max-width: 1200px) 60vw, 640px"
            style={{ objectFit: 'cover', objectPosition: before.focus ?? focus }}
          />
        </div>

        {/*
          The before image is in the DOM once more, visually hidden, so its
          alt text reaches assistive tech — the clipped copy above is
          aria-hidden and Image requires a non-decorative twin somewhere.
        */}
        <span className="ba-sr">{before.alt}</span>

        <span className="ba-tag ba-tag-before" aria-hidden="true">
          {beforeLabel}
        </span>
        <span className="ba-tag ba-tag-after" aria-hidden="true">
          {afterLabel}
        </span>

        <div className="ba-edge" aria-hidden="true">
          <span className="ba-knob">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M8 4 3.5 10 8 16M12 4l4.5 6L12 16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        <label className="ba-sr" htmlFor={id}>
          {label}
        </label>
        <input
          id={id}
          className="ba-range"
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={pct}
          onChange={(e) => setPct(Number(e.target.value))}
          aria-label={label}
          aria-valuetext={`${Math.round(pct)}% revealed`}
        />
      </div>

      <style jsx>{`
        .ba {
          margin: 0;
          width: 100%;
        }

        .ba-frame {
          position: relative;
          aspect-ratio: 3 / 4;
          overflow: hidden;
          background: var(--ink-soft);
          border-radius: var(--radius);
          touch-action: pan-y;
          cursor: ew-resize;
          user-select: none;
        }

        .ba-clip {
          position: absolute;
          inset: 0;
          /* The wet edge. */
          clip-path: inset(0 calc(100% - var(--pct, 50%)) 0 0);
        }

        .ba-edge {
          position: absolute;
          top: 0;
          bottom: 0;
          left: var(--pct, 50%);
          width: 3px;
          margin-left: -1.5px;
          background: #fff;
          box-shadow: 0 0 0 1px rgb(10 11 16 / 25%);
          pointer-events: none;
          display: grid;
          place-items: center;
        }

        .ba-knob {
          display: grid;
          place-items: center;
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: #fff;
          color: var(--blue-deep);
          box-shadow:
            0 2px 10px rgb(10 11 16 / 30%),
            0 0 0 3px var(--blue);
        }

        .is-dragging .ba-knob {
          transform: scale(0.94);
        }

        .ba-tag {
          position: absolute;
          top: 14px;
          z-index: 2;
          padding: 0.3rem 0.7rem;
          border-radius: var(--radius);
          background: rgb(10 11 16 / 72%);
          color: #fff;
          font-family: var(--font-display), system-ui, sans-serif;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          backdrop-filter: blur(4px);
        }

        .ba-tag-before {
          left: 14px;
          opacity: calc((var(--pct, 50%) / 100%) * 1.6);
        }

        .ba-tag-after {
          right: 14px;
          background: var(--blue);
          opacity: calc((1 - var(--pct, 50%) / 100%) * 1.6);
        }

        /* The range is the real control: invisible, full-bleed, focusable. */
        .ba-range {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          margin: 0;
          opacity: 0;
          cursor: ew-resize;
          -webkit-appearance: none;
          appearance: none;
          background: transparent;
        }

        .ba-range::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 46px;
          height: 100%;
        }

        .ba-range::-moz-range-thumb {
          width: 46px;
          height: 100%;
          border: 0;
          background: transparent;
        }

        /* Focus lands on the invisible range, so show the ring on the frame. */
        .ba-range:focus-visible {
          outline: none;
        }

        .ba-frame:has(.ba-range:focus-visible) {
          outline: 3px solid var(--blue);
          outline-offset: 3px;
        }

        .ba-sr {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0 0 0 0);
          white-space: nowrap;
          border: 0;
        }
      `}</style>
    </figure>
  );
}
