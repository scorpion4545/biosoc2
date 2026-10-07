import React, { useState, useRef } from 'react';
import { ArrowUpRight, Instagram, Linkedin, Mail, MapPin } from 'lucide-react';
import { IconBrandGmail } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { TiltCard3D } from './ui/tilt-card-3d';

const API_URL = 'http://localhost:3001/api';

interface SocialLink {
  icon: React.ReactNode;
  href: string;
  bgClass: string;
  shadowClass: string;
}

const Footer: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState<string>('');
  const form = useRef<HTMLFormElement>(null);

  const socialLinks: SocialLink[] = [
    {
      icon: <Instagram className="w-6 h-6" />,
      href: "https://www.instagram.com/biosocdtu/",
      bgClass: "from-purple-500 to-pink-500",
      shadowClass: "shadow-purple-500/25"
    },
    {
      icon: <Linkedin className="w-6 h-6" />,
      href: "https://www.linkedin.com/company/biosoc-dtu/",
      bgClass: "from-blue-500 to-blue-600",
      shadowClass: "shadow-blue-500/25"
    },
    {
      icon: <IconBrandGmail className="w-6 h-6" />,
      href: "mailto:biosoc@dtu.ac.in",
      bgClass: "from-red-500 to-red-600",
      shadowClass: "shadow-red-500/25"
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setStatus('');

    try {
      await axios.post(`${API_URL}/enquiries`, {
        name: formData.name,
        email: formData.email,
        message: formData.message
      });
      
      setStatus('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      setStatus('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const navigation = [
    { label: 'Home', to: '/' },
    { label: 'About us', to: '/about' },
    { label: 'Our team', to: '/team' },
    { label: 'Events', to: '/events' },
    { label: 'Resources', to: '/resources' },
  ];

  return (
    <footer className="border-t border-emerald-500/20 bg-slate-950/80 text-white relative z-10 backdrop-blur-2xl perspective-1000">
      <div className="mx-auto max-w-7xl px-6 py-14 sm:px-10 lg:px-12 lg:py-20 preserve-3d">
        <div className="grid gap-12 lg:grid-cols-[1fr_0.7fr_1.25fr] lg:gap-16">
          <section className="preserve-3d">
            <div className="mb-6 flex items-center gap-3">
              <img src="/team/Logo.svg" alt="BioSoc-DTU" className="h-14 w-14 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
              <div>
                <h2 className="text-2xl font-extrabold text-white">BioSoc-DTU</h2>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-cyan-400/90 font-mono">Official society of the department of biotechnology</p>
              </div>
            </div>
            <p className="max-w-xs text-sm leading-7 text-slate-300">A student community for curious minds exploring biotechnology, research, and everything in between.</p>
            <div className="mt-7 space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" /><span>Delhi Technological University<br />Delhi - 110042</span></div>
              <a href="mailto:biosoc@dtu.ac.in" className="flex items-center gap-3 transition-colors hover:text-cyan-300"><Mail className="h-4 w-4 text-emerald-400" />biosoc@dtu.ac.in</a>
            </div>
          </section>

          <nav aria-label="Footer navigation">
            <p className="mb-5 text-xs font-bold uppercase tracking-[0.22em] text-emerald-400 font-mono">Explore</p>
            <div className="grid gap-3">
              {navigation.map((item) => (
                <Link key={item.to} to={item.to} className="group flex w-fit items-center gap-2 text-sm text-slate-300 transition-colors hover:text-cyan-300">
                  <span>{item.label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-cyan-400 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                </Link>
              ))}
            </div>
            <p className="mb-4 mt-10 text-xs font-bold uppercase tracking-[0.22em] text-emerald-400 font-mono">Follow us</p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a key={index} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={`BioSoc-DTU ${index === 0 ? 'Instagram' : index === 1 ? 'LinkedIn' : 'Email'}`} className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/60 text-slate-300 transition-all hover:-translate-y-1 hover:border-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 shadow-md">
                  {social.icon}
                </a>
              ))}
            </div>
          </nav>

          <TiltCard3D maxTilt={6} scale={1.01} className="p-0 border border-emerald-500/30 bg-slate-950/80 rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] bio-card-glow">
            <section className="p-8 lg:p-10 relative">
              {/* Header */}
              <div className="mb-8">
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
                  </span>
                  <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-400 font-mono">Get in touch</p>
                </div>
                <h3 className="text-3xl font-extrabold tracking-tight text-white">Have a question?</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">
                  Send us a note and we'll get back to you within 24-48 hours.
                </p>
              </div>

              {/* Form */}
              <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="user_name" className="block text-sm font-medium text-slate-300">
                      Name
                    </label>
                    <input
                      id="user_name"
                      type="text"
                      name="user_name"
                      placeholder="John Doe"
                      aria-label="Name"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-emerald-400 focus:bg-slate-900/90 focus:ring-4 focus:ring-emerald-400/20"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="user_email" className="block text-sm font-medium text-slate-300">
                      Email
                    </label>
                    <input
                      id="user_email"
                      type="email"
                      name="user_email"
                      placeholder="john@example.com"
                      aria-label="Email"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-emerald-400 focus:bg-slate-900/90 focus:ring-4 focus:ring-emerald-400/20"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-slate-300">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell us about your inquiry..."
                    aria-label="Your message"
                    rows={4}
                    className="w-full resize-none rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition-all duration-200 focus:border-emerald-400 focus:bg-slate-900/90 focus:ring-4 focus:ring-emerald-400/20"
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                  />
                </div>

                <div className="flex flex-col gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Mail className="h-4 w-4 text-emerald-400" />
                    <span>We respect your privacy and never share your information.</span>
                  </div>
                  <button
                    type="submit"
                    disabled={sending}
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/40 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto cursor-pointer"
                  >
                    <span>{sending ? 'Sending...' : 'Send Message'}</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </button>
                </div>

                {status && (
                  <div
                    className={`rounded-xl border px-4 py-3.5 text-sm font-medium ${
                      status.includes('success')
                        ? 'border-emerald-500/40 bg-emerald-500/20 text-emerald-300'
                        : 'border-rose-500/40 bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {status}
                  </div>
                )}
              </form>
            </section>
          </TiltCard3D>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-slate-800 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} BioSoc-DTU. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;