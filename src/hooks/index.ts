import { useCallback, useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/*  useCountdown — menuju tanggal mint                                 */
/* ------------------------------------------------------------------ */
export type Countdown = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
  past: boolean;
};

function diff(target: number): Countdown {
  const total = target - Date.now();
  const abs = Math.max(0, total);
  return {
    days: Math.floor(abs / 86_400_000),
    hours: Math.floor((abs / 3_600_000) % 24),
    minutes: Math.floor((abs / 60_000) % 60),
    seconds: Math.floor((abs / 1000) % 60),
    total,
    past: total <= 0,
  };
}

export function useCountdown(iso: string): Countdown {
  const target = new Date(iso).getTime();
  const [state, setState] = useState<Countdown>(() => diff(target));
  useEffect(() => {
    const id = window.setInterval(() => setState(diff(target)), 1000);
    return () => window.clearInterval(id);
  }, [target]);
  return state;
}

/* ------------------------------------------------------------------ */
/*  useCountUp — angka yang naik saat terlihat                         */
/* ------------------------------------------------------------------ */
export function useCountUp(end: number, duration = 1600, start = false) {
  const [value, setValue] = useState(start ? end : 0);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (!start) return;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(end * eased));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [end, duration, start]);

  return value;
}

/* ------------------------------------------------------------------ */
/*  useInView — sekali terlihat, tetap terlihat                        */
/* ------------------------------------------------------------------ */
export function useInView<T extends HTMLElement>(threshold = 0.22) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.unobserve(e.target);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}

/* ------------------------------------------------------------------ */
/*  useActiveSection — untuk rail navigasi                             */
/* ------------------------------------------------------------------ */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((e): e is HTMLElement => !!e);
    if (!els.length || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { threshold: [0.15, 0.4, 0.7], rootMargin: "-12% 0px -45% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [ids]);

  return active;
}

/* ------------------------------------------------------------------ */
/*  useScrollProgress — 0..1                                           */
/* ------------------------------------------------------------------ */
export function useScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        setP(h > 0 ? Math.min(1, window.scrollY / h) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
  return p;
}

/* ------------------------------------------------------------------ */
/*  useLocalState — persisten di localStorage                          */
/* ------------------------------------------------------------------ */
export function useLocalState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  const set = useCallback(
    (next: T) => {
      setValue(next);
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* private mode — abaikan */
      }
    },
    [key],
  );

  return [value, set] as const;
}

/* ------------------------------------------------------------------ */
/*  useTickerClock — jam UTC yang berdetak (untuk log terminal)        */
/* ------------------------------------------------------------------ */
export function useTickerClock(intervalMs = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);
  return now;
}
