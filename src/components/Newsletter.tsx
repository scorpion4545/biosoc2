"use client";
import { motion } from "framer-motion";
import { useState } from "react";

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
      id: 4,
      title: "The Petridish Edition:5",
      file: "/team/Ed5.pdf",
      thumbnail: "/team/Ed5_CP.jpg"
    },
    {
      id: 5,
      title: "The Petridish Edition:4",
      file: "/team/Ed4.pdf",
      thumbnail: "/team/Edition4.jpg"
    },
    {
      id: 1,
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
      id: 3,
      title: "The Petridish Edition:1",
      file: "/team/Edi1.pdf",
      thumbnail: "/team/Edition2.jpg"
    }
  ];

  const handlePdfClick = (pdf: PdfItem): void => {
    setSelectedPdf(pdf);
  };

  return (
    <section className="py-20 px-4" id="newsletter">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-4xl font-medium tracking-tight text-transparent md:text-7xl mb-16">
            Newsletter
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {pdfs.map((pdf) => (
              <motion.div
                key={pdf.id}
                onClick={() => handlePdfClick(pdf)}
                whileHover={{ scale: 1.02 }}
                className="relative group cursor-pointer w-full max-w-sm mx-auto"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img
                  src={pdf.thumbnail}
                  alt={pdf.title}
                  className="w-full aspect-[4/5] object-cover rounded-2xl shadow-xl"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <h3 className="text-lg font-bold mb-1">{pdf.title}</h3>
                  <p className="text-xs text-gray-200">Click to read more</p>
                </div>
              </motion.div>
            ))}
          </div>

          {selectedPdf && (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
              <div className="relative w-full h-full max-w-6xl mx-auto p-4">
                <div className="absolute top-4 right-4 space-x-4">
                  <button
                    onClick={() => window.open(selectedPdf.file, '_blank')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    View Full Screen
                  </button>
                  <a
                    href={selectedPdf.file}
                    download
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => setSelectedPdf(null)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Close
                  </button>
                </div>
                <iframe
                  src={selectedPdf.file}
                  className="w-full h-full mt-16 rounded-lg"
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