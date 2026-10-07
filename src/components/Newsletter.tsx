"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { TiltCard3D } from "./ui/tilt-card-3d";

interface PdfItem {
  id: number;
  title: string;
  file: string;
  thumbnail: string;
}

export const Newsletter: React.FC = () => {
  const [selectedPdf, setSelectedPdf] = useState<PdfItem | null>(null);

  const pdfs: PdfItem[] = [
    {
      id: 5,
      title: "The Petridish Edition:5",
      file: "/team/Ed5.pdf",
      thumbnail: "/team/Ed5_CP.jpg"
    },
    {
      id: 4,
      title: "The Petridish Edition:4",
      file: "/team/Ed4.pdf",
      thumbnail: "/team/Edition4.jpg"
    },
    {
      id: 3,
      title: "The Petridish Edition:3",
      file: "/team/Ed3.pdf",
      thumbnail: "/team/Edition3.jpg"
    },
    {
      id: 2,
      title: "The Petridish Edition:2",
      file: "/team/Ed2.pdf",
      thumbnail: "/team/Edition1.jpg"
    },
    {
      id: 1,
      title: "The Petridish Edition:1",
      file: "/team/Ed1.pdf",
      thumbnail: "/team/Edition2.jpg"
    }
  ];

  const handlePdfClick = (pdf: PdfItem): void => {
    setSelectedPdf(pdf);
  };

  return (
    <section className="py-24 px-4 bg-transparent perspective-1000" id="newsletter">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="preserve-3d"
        >
          <h2 className="mt-8 bg-gradient-to-r from-emerald-300 via-cyan-200 to-indigo-300 py-4 bg-clip-text text-center text-4xl font-extrabold tracking-tight text-transparent md:text-7xl mb-16 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]">
            Newsletter
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto preserve-3d">
            {pdfs.map((pdf) => (
              <div
                key={pdf.id}
                onClick={() => handlePdfClick(pdf)}
                className="w-full"
              >
                <TiltCard3D
                  maxTilt={14}
                  scale={1.04}
                  glareColor="rgba(6, 182, 212, 0.4)"
                  className="group cursor-pointer border border-emerald-500/30 bg-slate-950/70 p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-2xl bio-card-glow"
                >
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/5]">
                    <img
                      src={pdf.thumbnail}
                      alt={pdf.title}
                      className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                    
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <h3 className="text-xl font-extrabold mb-1 group-hover:text-cyan-300 transition-colors">{pdf.title}</h3>
                      <p className="text-xs text-emerald-400 font-mono">Click to read more</p>
                    </div>
                  </div>
                </TiltCard3D>
              </div>
            ))}
          </div>

          {selectedPdf && (
            <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl z-50 flex items-center justify-center p-4">
              <div className="relative w-full h-full max-w-6xl mx-auto p-6 bg-slate-950/90 border border-cyan-500/40 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] flex flex-col">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-white/10">
                  <h3 className="text-2xl font-bold text-white">{selectedPdf.title}</h3>
                  <div className="space-x-3">
                    <button
                      onClick={() => window.open(selectedPdf.file, '_blank')}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-xl hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all"
                    >
                      View Full Screen
                    </button>
                    <a
                      href={selectedPdf.file}
                      download
                      className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold rounded-xl hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all"
                    >
                      Download
                    </a>
                    <button
                      onClick={() => setSelectedPdf(null)}
                      className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:bg-slate-700 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
                <iframe
                  src={selectedPdf.file}
                  className="w-full flex-grow rounded-2xl border border-white/10"
                  title={selectedPdf.title}
                />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}