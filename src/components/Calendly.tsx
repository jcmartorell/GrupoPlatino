import { useEffect, useRef, useState } from 'react';
import { calendlyUrl } from '../content';

const WIDGET_SRC = 'https://assets.calendly.com/assets/external/widget.js';
const LOAD_TIMEOUT_MS = 12_000;

interface CalendlyGlobal {
  initInlineWidget: (opts: { url: string; parentElement: HTMLElement }) => void;
}
declare global {
  interface Window {
    Calendly?: CalendlyGlobal;
  }
}

function loadWidgetScript(): Promise<CalendlyGlobal> {
  return new Promise((resolve, reject) => {
    if (window.Calendly) return resolve(window.Calendly);
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${WIDGET_SRC}"]`);
    const script = existing ?? document.createElement('script');
    script.addEventListener('load', () => (window.Calendly ? resolve(window.Calendly) : reject(new Error('sin Calendly'))));
    script.addEventListener('error', () => reject(new Error('error de red')));
    if (!existing) {
      script.src = WIDGET_SRC;
      script.async = true;
      document.head.appendChild(script);
    }
  });
}

export default function CalendlyEmbed() {
  const container = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading');

  useEffect(() => {
    let cancelled = false;
    let loaded = false;

    const onMessage = (e: MessageEvent) => {
      if (e.origin !== 'https://calendly.com') return;
      const event = (e.data as { event?: string } | null)?.event;
      if (typeof event === 'string' && event.startsWith('calendly.')) {
        loaded = true;
        if (!cancelled) setStatus('ready');
      }
    };
    window.addEventListener('message', onMessage);

    const timer = window.setTimeout(() => {
      if (!loaded && !cancelled) setStatus('failed');
    }, LOAD_TIMEOUT_MS);

    loadWidgetScript()
      .then((calendly) => {
        if (cancelled || !container.current) return;
        container.current.replaceChildren();
        calendly.initInlineWidget({ url: calendlyUrl, parentElement: container.current });
      })
      .catch(() => !cancelled && setStatus('failed'));

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      window.removeEventListener('message', onMessage);
    };
  }, []);

  if (status === 'failed') {
    return (
      <div className="flex min-h-[18rem] flex-col items-center justify-center gap-5 border border-navy-100 bg-white p-8 text-center" role="status">
        <p className="max-w-sm text-navy-800/80">No pudimos cargar el calendario en esta página. Puedes agendar tu llamada directamente en Calendly.</p>
        <a href={calendlyUrl} target="_blank" rel="noopener noreferrer" className="btn bg-navy-800 text-white hover:bg-navy-700">
          Agendar llamada
          <span className="sr-only"> (se abre en una pestaña nueva)</span>
        </a>
      </div>
    );
  }

  return (
    <div className="relative border border-navy-100 bg-white">
      {status === 'loading' && (
        <p className="absolute inset-0 flex items-center justify-center text-sm text-navy-700" role="status">
          Cargando calendario…
        </p>
      )}
      <div ref={container} className="h-[700px] w-full min-w-[280px]" />
    </div>
  );
}
