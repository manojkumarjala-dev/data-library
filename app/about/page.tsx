import Text from "@/app/components/Text";
import PersonCard from "@/app/components/PersonCard";
export default function About() {
    const teamData = [
        { name: "Alice Johnson", role: "CEO", imageUrl: "/images/alice.jpg" },
        { name: "Bob Smith", role: "CTO", imageUrl: "/images/bob.jpg" },
        { name: "Clara Lee", role: "COO", imageUrl: "/images/clara.jpg" },
        { name: "David Kim", role: "Software Engineer", imageUrl: "/images/david.jpg" },
        { name: "Ella Brown", role: "Designer", imageUrl: "/images/ella.jpg" },
        { name: "Frank White", role: "Marketing Lead", imageUrl: "/images/frank.jpg" },
        { name: "Grace Miller", role: "Data Scientist", imageUrl: "/images/grace.jpg" },
        { name: "Henry Wilson", role: "DevOps Engineer", imageUrl: "/images/henry.jpg" },
        { name: "Ivy Green", role: "HR Manager", imageUrl: "/images/ivy.jpg" },
      ];
      

    return (
    <div  className="bg-white flex-col justify-center">
    <div className="w-full h-full px-20 py-32 bg-blue-50 flex flex-col items-center gap-2"> </div>

<Text
  heading="Who We Are"
  content="Heartland Community Network (HCN) is a non-profit empowering small businesses in Southern Central Indiana through digital growth. We offer services in website and app development, UI/UX design, marketing, financial modeling, cybersecurity, and tech training on AI and SEO. "
  wrapperClassName="w-full relative flex justify-start px-15 py-5 text-left font-inter bg-white"

/>

<Text
  heading="Our Mission"
  content={
    <>
      <p>
      Our core values center on empowerment and community growth. We equip small businesses with essential digital tools, believing their success strengthens the whole community. Through innovation, we offer the latest tech solutions, from AI to cybersecurity, to keep businesses competitive.      </p>
      <p>
      Guided by integrity and collaboration, we prioritize transparency and quality in our services. Partnering with local organizations and professionals, we support sustainable growth and economic strength in Southern Central Indiana.      </p>
      <p>
      We’re hands-on in our approach, meeting with businesses, understanding their unique needs, and crafting tailored solutions that drive real impact. Our flexibility allows us to adapt to each business. At HCN, we’re not just service providers—we’re partners on the ground, committed to supporting every step of the journey toward growth and innovation.      </p>
    </>
  }
  contentClassName="text-base leading-6 text-gray-800 space-y-4"
  wrapperClassName="w-full relative flex justify-start px-15 py-5 text-left font-inter bg-white"

/>
<Text
  heading="Meet the Team"
  content=""
  wrapperClassName="w-full relative flex justify-start px-15 py-5 text-left font-inter bg-white"
/>
<div className="flex flex-wrap justify-center gap-10 px-15 w-full mb-10">
  {teamData.map((member, idx) => (
    <PersonCard
      key={idx}
      name={member.name}
      role={member.role}
      imageUrl={member.imageUrl}
    />
  ))}
</div>
<div className="w-full sm:px-30 md:px-45 lg:px-60 flex flex-col gap-2">
  <div className="w-full h-px bg-gray-200"></div>
</div>




    </div>);
}