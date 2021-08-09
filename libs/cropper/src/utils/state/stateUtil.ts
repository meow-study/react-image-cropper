/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/ban-types */
import { produce } from "immer";
import type { DependencyList } from "react";
import { useEffect, useState } from "react";

// * ================================================================================

type Listener = () => void;
type Unsubscriber = () => void;

// * ================================================================================ store

export class Store<T> {
  private static depsRecorder: Set<Store<any>> | null = null;
  private static batchListeners: Set<Function> | null = null;
  private static batchNestedCount = 0;

  public static create<T>(initialState: T, name?: string) {
    return new Store(initialState, name);
  }

  // * ---------------- get mode

  public static openRecorder() {
    Store.depsRecorder = new Set();
    return Store.depsRecorder;
  }
  public static closeRecorder() {
    Store.depsRecorder = null;
  }

  // * ---------------- set mode

  public static prepareBatchQueue() {
    if (Store.batchNestedCount === 0) {
      Store.batchListeners = new Set();
    }

    Store.batchNestedCount += 1;
  }
  public static runBatchQueue() {
    Store.batchNestedCount -= 1;

    if (Store.batchNestedCount === 0) {
      runQueue(Store.batchListeners);
      Store.batchListeners = null;
    }
  }

  // * ------------------------------------------------

  private state: T;
  private listeners = new Set<Listener>();
  private readonly name?: string;
  private readonly initialState: T;

  // * ---------------- lifecycle

  public constructor(initialState: T, name?: string) {
    this.state = this.initialState = initialState;
    name && (this.name = name);
  }
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public destroy() {}
  public reset() {
    this.set(this.initialState);
  }

  // * ---------------- get set subscribe

  public get() {
    Store.depsRecorder?.add(this);
    return this.state;
  }

  public set(ValueOrSetter: T | ((draftState: T) => void) | ((draftState: T) => T)) {
    // TODO: remove any // XuYuCheng 2021/08/6
    this.state = typeof ValueOrSetter === "function" ? produce(this.state, ValueOrSetter as any) : ValueOrSetter;

    // * emit
    new Set(this.listeners).forEach((fn) => {
      Store.batchListeners ? Store.batchListeners.add(fn) : fn();
    });
  }

  public subscribe(listener: Listener): Unsubscriber {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
      Store.batchListeners?.delete(listener);
    };
  }
}

export const store = Store.create;

// * ================================================================================ API

type RevokerMap = Map<Store<any>, Unsubscriber>;

// * ---------------------------------------------------------------- autorun

// eslint-disable-next-line @typescript-eslint/ban-types
export const autorun = (listener: Function) => {
  const revokers: RevokerMap = new Map();

  const runner = () => runAndAutoSubscribe(listener, runner, revokers);
  runner();

  return () => runQueue(revokers);
};

// * ---------------------------------------------------------------- useValue

export const useValue = <T>(getter: () => T, otherDeps?: DependencyList) => {
  const [result, setResult] = useState(getter());

  useEffect(() => {
    const revokers: RevokerMap = new Map();

    const runner = () => {
      const nextResult = runAndAutoSubscribe(getter, runner, revokers);
      if (nextResult !== result) setResult(nextResult);
    };
    runner();

    return () => runQueue(revokers);
  }, otherDeps);

  return result;
};

// * ---------------------------------------------------------------- batch rafBatch

// eslint-disable-next-line @typescript-eslint/ban-types
export const batch = (setter: Function): void => {
  Store.prepareBatchQueue();
  setter();
  Store.runBatchQueue();
};

const rafDebounce = <T extends unknown[]>(fn: (...args: T) => void) => {
  let tick = -Infinity;
  return (...args: T) => {
    cancelAnimationFrame(tick);
    tick = requestAnimationFrame(() => fn(...args));
  };
};

export const rafBatch = (() => {
  const setterQueue: Function[] = [];
  const resolveQueue: Function[] = [];

  const runQueue = () => {
    batch(() => {
      setterQueue.forEach((setter) => setter());
    });
    resolveQueue.forEach((res) => res());

    setterQueue.length = 0;
    resolveQueue.length = 0;
  };

  const delayRunQueue = rafDebounce(runQueue);

  // eslint-disable-next-line @typescript-eslint/ban-types
  return (setter: Function): Promise<void> => {
    setterQueue.push(setter);
    return new Promise((res) => {
      resolveQueue.push(res);
      delayRunQueue();
    });
  };
})();

// * ================================================================================ utils

// eslint-disable-next-line @typescript-eslint/ban-types
const runAndAutoSubscribe = (userListener: Function, wrappedListener: Listener, revokers: RevokerMap) => {
  const latestDeps = Store.openRecorder();
  const nextResult = userListener();
  Store.closeRecorder();

  // * keep revokers up to date
  revokers.forEach((revoker, store) => {
    if (latestDeps.has(store)) {
      latestDeps.delete(store);
    } else {
      revokers.delete(store);
      revoker();
    }
  });
  latestDeps.forEach((store) => {
    revokers.set(store, store.subscribe(wrappedListener));
  });

  return nextResult;
};

const runQueue = (fnCollection: Map<any, Function> | Set<Function> | null) => {
  fnCollection?.forEach((fn: Function) => fn());
  fnCollection?.clear();
};
