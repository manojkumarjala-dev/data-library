'use client';

import { useEffect, useState } from 'react';

type Props = {
  sector: string; // you will pass "sector-1", "sector-2", etc. for now
};

export default function LastUpdated({ sector }: Props) {
  const [date, setDate] = useState('TBD');

  useEffect(() => {
    fetch('/status.json') // reads from public/status.json
      .then((res) => res.json())
      .then((data) => {
        // if sector key exists, use it; otherwise fallback to TBD
        if (data[sector]) {
          setDate(data[sector]);
        } else {
          setDate('TBD');
        }
      })
      .catch(() => setDate('TBD'));
  }, [sector]);

  return (
    <span className="text-sm text-gray-500">
      Last updated: {date}
    </span>
  );
}
