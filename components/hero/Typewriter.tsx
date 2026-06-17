"use client";

import { useEffect, useReducer } from "react";

// Typewriter that reveals a sequence of lines. Degrades to instant full text
// under prefers-reduced-motion (DESIGN.md §9).
export function Typewriter({
  lines,
  speed = 38,
  onDone,
}: {
  lines: string[];
  speed?: number;
  onDone?: () => void;
}) {
  const [state, dispatch] = useReducer(reducer, {
    line: 0,
    char: 0,
    done: false,
  });

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      dispatch({ type: "complete", total: lines.length });
      onDone?.();
      return;
    }

    if (state.done) {
      onDone?.();
      return;
    }

    const current = lines[state.line] ?? "";
    const atLineEnd = state.char >= current.length;
    const atLastLine = state.line >= lines.length - 1;

    const delay = atLineEnd ? (atLastLine ? 0 : 420) : speed;
    const id = setTimeout(() => dispatch({ type: "tick", lines }), delay);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.line, state.char, state.done]);

  return (
    <div className="font-mono text-sm leading-relaxed text-fg sm:text-base">
      {lines.map((line, i) => {
        if (i > state.line) return null;
        const shown =
          i < state.line || state.done ? line : line.slice(0, state.char);
        const isActive = i === state.line && !state.done;
        return (
          <div key={i} className="whitespace-pre-wrap break-words">
            <span className="select-none text-green">{"> "}</span>
            <span>{shown}</span>
            {isActive ? <Caret /> : null}
          </div>
        );
      })}
    </div>
  );
}

function Caret() {
  return (
    <span
      aria-hidden="true"
      className="ml-0.5 inline-block h-[1.05em] w-[0.55ch] translate-y-[0.15em] bg-green align-baseline"
      style={{ animation: "caret-blink 1s steps(1) infinite" }}
    />
  );
}

type State = { line: number; char: number; done: boolean };
type Action =
  | { type: "tick"; lines: string[] }
  | { type: "complete"; total: number };

function reducer(state: State, action: Action): State {
  if (action.type === "complete") {
    return { line: action.total - 1, char: Infinity, done: true };
  }
  const current = action.lines[state.line] ?? "";
  if (state.char < current.length) {
    return { ...state, char: state.char + 1 };
  }
  if (state.line < action.lines.length - 1) {
    return { line: state.line + 1, char: 0, done: false };
  }
  return { ...state, done: true };
}
