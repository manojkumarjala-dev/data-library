"use client";
import { useState } from "react";
import Text from "@/app/components/Text";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      if (res.ok) {
        alert("✅ Thanks for reaching out! We’ll get back to you soon.");
        setFormData({ name: "", email: "", message: "" });
      } else {
        alert("❌ Something went wrong. Please try again later.");
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Could not send message. Check console for details.");
    }
  };
  

  return (
    <div className="w-full flex flex-col items-center">
      {/* Heading */}

        <Text
          heading="Reach Out To Us"
          content="For more information on any topic, please send a message and we'll get back to you promptly."
          headingClassName="text-3xl font-bold text-blue-600 "
          contentClassName="text-gray-700 text-base mb-10"

        />


      {/* Contact Form */}
      <div className="w-full bg-blue-50 py-16 flex justify-center">
        <div className="bg-white shadow rounded-lg p-8 w-full max-w-md">
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div>
              <label className="block text-md font-bold text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@email.com"
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                placeholder="Hi, can I get resources of the food security dashboards?"
                className="w-full rounded-md border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
