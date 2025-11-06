"use client";
import Text from "./components/Text";
import Image from "next/image";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const sectors = [
  {
    title: "Health care Sector",
    description: "Explore the data for Sector 1.",
    image: "",
    link: "/sector-1",
  },
  {
    title: "Food Security",
    description: "Explore the data for Sector 2.",
    image: "",
    link: "/sector-2",
  },
  {
    title: "Education Sector",
    description: "Explore the data for Sector 3.",
    image: "",
    link: "/sector-3",
  },
  {
    title: "Sector 4",
    description: "Explore the data for Sector 4.",
    image: "",
    link: "/sector-4",
  },
];  

export default function HomePage() {
  return (
    <div>
      <div className="font-sans min-h-screen">
        <main className="w-full bg-white">
          <div className="px-[var(--Utilities-Spacing-20,80px)] py-[var(--Utilities-Spacing-32,128px)] bg-[#EFF6FF]">
            <Text
              heading="Welcome to the Heartland Community Network Data Library"
              content="A collection of information from 11 Indiana counties"
              headingClassName="text-4xl font-bold text-blue-600"
              contentClassName="text-lg max-w-3xl mx-auto"
              wrapperClassName="text-center gap-[12px] flex flex-col items-center"
            />
          </div>

          <div>
            <Text
              heading="Sectors"
              content="Explore datasets across various sectors that impact our community."
              headingClassName="text-[#1F2937] font-inter text-2xl font-bold leading-normal tracking-[0.12px]"
              contentClassName="text-[var(--Text-Secondary-Text-Color,#6B7280)] font-inter text-xl font-medium leading-normal tracking-[0.1px]"
              wrapperClassName="w-full relative flex flex-col justify-start px-[var(--Utilities-Spacing-20,80px)] py-[var(--Utilities-Spacing-15,60px)] gap-[4px)] text-left font-inter bg-white"
            />
          </div>
          <div className="px-[40]">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 place-items-center gap-[var(--Utilities-Spacing-10,40px)] pb-[40px] px-[40px] border-b border-gray-200">        
      {sectors.map((sector, index) => (
              <a
                key={index}
                className="w-[600px] flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl hover:shadow-lg focus:outline-hidden focus:shadow-lg transition"
                href={sector.link}
              >
                {sector.image.length > 0 ? (
                  <Image
                    width={600}
                    height={200}
                    src={sector.image}
                    alt="Card Image"
                    className="bg-blue-50"
                  />
                ) : (
                  <div className="w-full h-[200px] bg-blue-50" />
                )}
                <div className="p-4 md:p-5">
                  <h3 className="text-lg font-bold text-gray-800">
                    {sector.title}
                  </h3>
                  <p>{sector.description}</p>
                </div>
              </a>
            ))}
          </div>
          </div>

        </main>
      </div>
    </div>
  );
}
