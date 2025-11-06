// app/components/TableauEmbed.tsx
"use client";
import '@tableau/embedding-api';
import { useEffect, useRef } from 'react';
const TableauViz = "tableau-viz" as any;

export default function TableauEmbed({ src }: { src: string }) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.setAttribute("src", "https://public.tableau.com/views/RollingDatePeriods/ComparingPeriods?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link");
      ref.current.setAttribute("toolbar", "hidden");
    }
  }, [src]);

  return (
    <div className="w-full w-full mx-auto">
      <TableauViz id="tableauViz"
        src='https://public.tableau.com/views/DesignBeyondDefaults/Designbeyonddefaults?:language=en-US&:sid=&:redirect=auth&:display_count=n&:origin=viz_share_link' 
        toolbar="bottom" hide-tabs width="100%" height="1000px">
      </TableauViz>
    </div>
  );
}