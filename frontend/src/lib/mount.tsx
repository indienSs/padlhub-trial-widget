import { createRoot, type Root } from 'react-dom/client';
import { StrictMode, type ReactNode } from 'react';
import { ScheduleWidget } from '../components/ScheduleWidget';

export interface MountOptions {
  /** ID целевого DOM-элемента, куда монтируется виджет. */
  targetId: string;
  /** Базовый URL API (по умолчанию — текущий origin). */
  apiBaseUrl?: string;
}

const roots = new Map<string, Root>();

function resolveApiBase(apiBaseUrl?: string): string {
  const fromGlobals =
    typeof window !== 'undefined'
      ? (window as unknown as { __PADLHUB_TRIAL_API_BASE__?: string })
          .__PADLHUB_TRIAL_API_BASE__
      : undefined;
  const base = (apiBaseUrl || fromGlobals || '').trim().replace(/\/+$/, '');
  return base;
}

/** Перехватывает fetch к /api и подставляет apiBaseUrl при standalone-вставке. */
function installApiBaseInterceptor(apiBase: string) {
  if (!apiBase) return;
  if (
    (window as unknown as { __PADLHUB_TRIAL_FETCH_PATCHED__?: boolean })
      .__PADLHUB_TRIAL_FETCH_PATCHED__
  )
    return;
  (window as unknown as { __PADLHUB_TRIAL_FETCH_PATCHED__?: boolean })
      .__PADLHUB_TRIAL_FETCH_PATCHED__ = true;
  const originalFetch = window.fetch.bind(window);
  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === 'string' && input.startsWith('/api/')) {
      input = apiBase + input;
    }
    return originalFetch(input as RequestInfo, init);
  };
}

function renderWidget(root: Root) {
  const tree: ReactNode = <ScheduleWidget />;
  root.render(<StrictMode>{tree}</StrictMode>);
}

export function mount(options: MountOptions): boolean {
  const target = document.getElementById(options.targetId);
  if (!target) return false;

  const apiBase = resolveApiBase(options.apiBaseUrl);
  installApiBaseInterceptor(apiBase);

  let root = roots.get(options.targetId);
  if (!root) {
    root = createRoot(target);
    roots.set(options.targetId, root);
  }
  renderWidget(root);
  return true;
}

export function unmount(targetId: string): boolean {
  const root = roots.get(targetId);
  if (!root) return false;
  root.unmount();
  roots.delete(targetId);
  const target = document.getElementById(targetId);
  if (target) target.innerHTML = '';
  return true;
}

const api = { mount, unmount };

export type PadlhubTrialScheduleWidget = typeof api;

export default api;
