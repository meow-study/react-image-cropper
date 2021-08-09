/* eslint-disable max-lines */
import React, { HTMLAttributes, useMemo, useRef } from "react";
import { on, off } from "./util";

// * --------------------------------------------------------------------------- types

// eslint-disable-next-line
type TODO = any;

export type PointerType = "mouse" | "pen" | "touch" | "keyboard" | "virtual";

interface BaseMoveEvent {
  pointerType: PointerType;
}

export interface MoveStartEvent extends BaseMoveEvent {
  type: "moveStart";
}

export interface MoveMoveEvent extends BaseMoveEvent {
  type: "move";
  deltaX: number;
  deltaY: number;
}

export interface MoveEndEvent extends BaseMoveEvent {
  type: "moveEnd";
}

interface MoveEvents {
  onMoveStart?: (params: MoveStartEvent, event?: MouseEvent) => void;
  onMove?: (params: MoveMoveEvent, event?: MouseEvent) => void;
  onMoveEnd?: (params: MoveEndEvent, event?: MouseEvent) => void;
}

interface MoveResult {
  moveProps: HTMLAttributes<HTMLElement>;
}

// * --------------------------------------------------------------------------- hook

// eslint-disable-next-line max-lines-per-function
export const useMove = (props: MoveEvents): MoveResult => {
  const { onMoveStart, onMove, onMoveEnd } = props;

  const state = useRef<{
    didMove: boolean;
    lastPosition: { pageX: number; pageY: number } | null;
    id: number | null;
  }>({ didMove: false, lastPosition: null, id: null });

  // eslint-disable-next-line max-lines-per-function
  const moveProps = useMemo(() => {
    const moveProps: TODO = {};

    const start = () => {
      state.current.didMove = false;
    };
    // eslint-disable-next-line max-params
    const move = (pointerType: PointerType, deltaX: number, deltaY: number, e?: MouseEvent) => {
      if (deltaX === 0 && deltaY === 0) {
        return;
      }

      if (!state.current.didMove) {
        state.current.didMove = true;
        onMoveStart?.(
          {
            type: "moveStart",
            pointerType,
          },
          e,
        );
      }

      onMove?.(
        {
          type: "move",
          pointerType,
          deltaX: deltaX,
          deltaY: deltaY,
        },
        e,
      );
    };
    const end = (pointerType: PointerType, e?: MouseEvent) => {
      if (state.current.didMove) {
        onMoveEnd?.(
          {
            type: "moveEnd",
            pointerType,
          },
          e,
        );
      }
    };

    if (typeof PointerEvent === "undefined") {
      const onMouseMove = (e: MouseEvent) => {
        if (e.button === 0) {
          if (state.current.lastPosition?.pageX && state.current.lastPosition?.pageY) {
            move("mouse", e.pageX - state.current.lastPosition.pageX, e.pageY - state.current.lastPosition.pageY, e);
          }
          state.current.lastPosition = { pageX: e.pageX, pageY: e.pageY };
        }
      };
      const onMouseUp = (e: MouseEvent) => {
        if (e.button === 0) {
          end("mouse", e);
          off(window, "mousemove", onMouseMove, false);
          off(window, "mouseup", onMouseUp, false);
        }
      };

      moveProps.onMouseDown = (e: React.MouseEvent) => {
        if (e.button === 0) {
          start();
          e.stopPropagation();
          e.preventDefault();
          state.current.lastPosition = { pageX: e.pageX, pageY: e.pageY };
          on(window, "mousemove", onMouseMove, false);
          on(window, "mouseup", onMouseUp, false);
        }
      };
    } else {
      const onPointerMove = (e: PointerEvent) => {
        if (e.pointerId === state.current.id) {
          const pointerType: PointerType = (e.pointerType as PointerType) || "mouse";
          if (state.current.lastPosition?.pageX && state.current.lastPosition?.pageY) {
            move(
              pointerType,
              e.pageX - state.current.lastPosition.pageX,
              e.pageY - state.current.lastPosition.pageY,
              e,
            );
          }
          state.current.lastPosition = { pageX: e.pageX, pageY: e.pageY };
        }
      };

      const onPointerUp = (e: PointerEvent) => {
        if (e.pointerId === state.current.id) {
          const pointerType: PointerType = (e.pointerType as PointerType) || "mouse";
          end(pointerType, e);
          state.current.id = null;
          off(window, "pointermove", onPointerMove, false);
          off(window, "pointerup", onPointerUp, false);
          off(window, "pointercancel", onPointerUp, false);
        }
      };

      moveProps.onPointerDown = (e: React.PointerEvent) => {
        if (e.button === 0 && state.current.id === null) {
          start();
          e.stopPropagation();
          e.preventDefault();
          state.current.lastPosition = { pageX: e.pageX, pageY: e.pageY };
          state.current.id = e.pointerId;
          on(window, "pointermove", onPointerMove, false);
          on(window, "pointerup", onPointerUp, false);
          on(window, "pointercancel", onPointerUp, false);
        }
      };
    }

    const triggerKeyboardMove = (deltaX: number, deltaY: number) => {
      start();
      move("keyboard", deltaX, deltaY);
      end("keyboard");
    };

    moveProps.onKeyDown = (e: TODO) => {
      switch (e.key) {
        case "Left":
        case "ArrowLeft":
          e.preventDefault();
          e.stopPropagation();
          triggerKeyboardMove(-1, 0);
          break;
        case "Right":
        case "ArrowRight":
          e.preventDefault();
          e.stopPropagation();
          triggerKeyboardMove(1, 0);
          break;
        case "Up":
        case "ArrowUp":
          e.preventDefault();
          e.stopPropagation();
          triggerKeyboardMove(0, -1);
          break;
        case "Down":
        case "ArrowDown":
          e.preventDefault();
          e.stopPropagation();
          triggerKeyboardMove(0, 1);
          break;
      }
    };

    return moveProps;
  }, [onMove, onMoveEnd, onMoveStart]);

  return { moveProps };
};
