'use client';

import { useEffect, useRef } from 'react';

export default function DashboardEmbed({
  url,
  title = 'Tableau Dashboard',
}: {
  url?: string;
  title?: string;
}) {
  const ref = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const container = ref.current?.parentElement;
    if (!container || !url) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && ref.current && !ref.current.src) {
        ref.current.src = url; // lazy-load Tableau only when visible
      }
    });
    io.observe(container);
    return () => io.disconnect();
  }, [url]);

  return (
    <>
      {/* Helps the browser connect faster to Tableau host */}
      {/* <link rel="preconnect" href="https://public.tableau.com" /> */}
      <div className="aspect-[16/9] rounded-xl border bg-gray-100 flex items-center justify-center">
        {url ? (
          <iframe
            ref={ref}
            title={title}
            src={url.includes(':embed=') ? url : url + (url.includes('?') ? '&' : '?') + ':embed=y&:toolbar=no&:display_count=yes'}
            className="w-full h-full border-0 block"
            loading="lazy"
            allowFullScreen={true}
          />
        ) : (
          <span className="text-sm text-gray-500">
            Tableau dashboard link coming soon
          </span>
        )}
      </div>
    </>
  );
}