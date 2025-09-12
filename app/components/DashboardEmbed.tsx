'use client';

import { useEffect, useRef } from 'react';

export default function DashboardEmbed({ url, title = 'Dashboard' }: { url?: string; title?: string }) {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const container = ref.current?.parentElement;
    if (!container || !url) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && ref.current && !ref.current.src) {
        ref.current.src = url; // lazy set when visible -> faster initial paint
      }
    });
    io.observe(container);
    return () => io.disconnect();
  }, [url]);

  return (
    <>
      {/* Helps the browser connect faster to BI hosts */}
      <link rel="preconnect" href="https://app.powerbi.com" />
      <link rel="preconnect" href="https://public.tableau.com" />
      <div className="aspect-[16/9] rounded-xl border bg-gray-100 flex items-center justify-center">
        {url ? (
          <iframe ref={ref} title={title} className="w-full h-full border-0 block" loading="lazy" />
        ) : (
          <span className="text-sm text-gray-500">Dashboard link coming soon</span>
        )}
      </div>
    </>
  );
}
