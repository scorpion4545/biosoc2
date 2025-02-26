"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export function Newsletter() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your newsletter subscription logic here
    console.log("Subscribed:", email);
    setEmail("");
  };

  return (
    <section className="py-20 px-4" id="newsletter">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl mb-8">
            Newsletter
          </h2>
          <p className="text-gray-300 mb-8">
            Stay updated with our latest events, research, and biotechnology news.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 justify-center">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="px-6 py-3 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              required
            />
            <button
              type="submit"
              className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white font-medium hover:opacity-90 transition-opacity"
            >
              Subscribe
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
} 