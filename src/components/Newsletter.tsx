"use client";
import { motion } from "framer-motion";
import { useState } from "react";

export function Newsletter() {
  const [selectedPdf, setSelectedPdf] = useState(null);

  const pdfs = [
    {
      id: 1,
      title: "BioSoc Annual Report 2023",
      file: "./team/News.pdf", // Add your PDF file path here
      thumbnail: "/pdfs/thumbnail1.jpg" // Add your thumbnail image path here
    },
    {
      id: 2,
      title: "Research Highlights 2023",
      file: "/pdfs/research2023.pdf", // Add your PDF file path here
      thumbnail: "/pdfs/thumbnail2.jpg" // Add your thumbnail image path here
    }
  ];

  const handlePdfClick = (pdf) => {
    setSelectedPdf(pdf);
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
          <p className="text-gray-300 mb-12">
            Access our latest publications and research materials.
          </p>

          <div className="space-y-6">
            {pdfs.map((pdf) => (
              <div
                key={pdf.id}
                onClick={() => handlePdfClick(pdf)}
                className="bg-white/5 border border-white/10 rounded-lg p-6 cursor-pointer hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 flex-shrink-0">
                    <svg className="w-full h-full text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                      <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                    </svg>
                  </div>
                  <div className="flex-grow text-left">
                    <h3 className="text-white text-lg font-medium">{pdf.title}</h3>
                    <p className="text-gray-400 text-sm">Click to open</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* PDF Viewer Modal */}
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