"use client";

import { useEffect, useRef, useState } from "react";

// Minimal Cloudflare Turnstile integration (DESIGN.md §6.5). Renders a managed
// widget when NEXT_PUBLIC_TURNSTILE_SITE_KEY is set; otherwise it's a no-op and
// getToken() returns undefined (the server skips verification in that case).

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

type TurnstileApi = {
  render: (
    el: HTMLElement,
    opts: {
      sitekey: string;
      callback: (token: string) => void;
      "error-callback"?: () => void;
      "expired-callback"?: () => void;
      appearance?: "always" | "execute" | "interaction-only";
      size?: "normal" | "flexible" | "compact";
    },
  ) => string;
  reset: (id?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function useTurnstile() {
  const enabled = Boolean(SITE_KEY);
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const tokenRef = useRef<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    const SCRIPT_SRC =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current || widgetId.current) return;
      widgetId.current = window.turnstile.render(containerRef.current, {
        sitekey: SITE_KEY as string,
        appearance: "interaction-only",
        size: "flexible",
        callback: (token) => {
          tokenRef.current = token;
        },
        "expired-callback": () => {
          tokenRef.current = null;
        },
        "error-callback": () => {
          tokenRef.current = null;
        },
      });
      setReady(true);
    };

    if (window.turnstile) {
      renderWidget();
      return;
    }

    let script = document.querySelector<HTMLScriptElement>(
      `script[src="${SCRIPT_SRC}"]`,
    );
    if (!script) {
      script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    script.addEventListener("load", renderWidget);
    return () => script?.removeEventListener("load", renderWidget);
  }, [enabled]);

  // Returns the current token (single-use) and resets the widget for the next.
  const getToken = (): string | undefined => {
    const token = tokenRef.current ?? undefined;
    if (token && window.turnstile && widgetId.current) {
      tokenRef.current = null;
      window.turnstile.reset(widgetId.current);
    }
    return token;
  };

  return { enabled, ready, containerRef, getToken };
}
