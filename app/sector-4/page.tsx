'use client';

import { motion } from 'framer-motion';
import { Resizable } from 're-resizable';
import { useState } from 'react';

export default function Sector1() {
  const [width, setWidth] = useState(900);   
  const [height, setHeight] = useState(740);

  return (
    <div className="font-sans p-8 bg-gray-50 min-h-screen text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto max-w-none"
      >
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Sector 4 Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3 w-fit">
            <Resizable
              size={{ width, height }}                         // controlled size
              onResizeStop={(e, dir, ref, d) => {
                setWidth((w) => w + (d.width || 0));
                setHeight((h) => h + (d.height || 0));         
              }}
              enable={{ right: true, bottom: true, bottomRight: true }}
              minWidth={400}
              minHeight={300}
              className="inline-block"                         // lets parent size to child
            >
              {/* Card must fill the resizable height */}
              <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col">
                {/* This wrapper takes the remaining height */}
                <div className="border-2 border-dashed border-gray-300 flex-1">
                  <iframe
                    title="Sample Report Demo"
                    src="https://playground.powerbi.com/sampleReportEmbed"
                    className="w-full h-full border-0 block"
                  />
                </div>
              </div>
            </Resizable>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
