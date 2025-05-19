export default function OurCollectionSection() {
  return (
    <section className="w-full bg-[#f5f4ef] py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-8">
        <h2 className="font-mulish text-xl md:text-2xl font-light tracking-widest uppercase text-[#5a5a56] mb-12 text-center">
          Our Collection
        </h2>

        <div className="flex flex-col md:flex-row gap-12 md:gap-16">
          {/* SHIRT Section - Left column on desktop */}
          <div className="w-full md:w-1/2 space-y-6 text-center">
            <h3 className="text-[#5a5a56] font-normal text-base uppercase tracking-wider">SHIRT</h3>
            <div className="font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-sm px-0 md:px-4">
              <p>
                Our signature shirt captures the spirit of Southern Italy through thoughtful tailoring and refined
                detail. The clean, single-placket front flows into the soft roll of the paramontura collar, echoed by
                curved cuffs fastened with genuine mother-of-pearl buttons. Hand-finished edges and perfect buttonholes
                complete each piece. Woven from the finest Italian linen and tailored with precision, our shirts embody
                the effortless elegance of Mediterranean living. Each garment is meticulously crafted to provide both
                comfort and sophistication, ideal for every summer moment from yachting by day to dining by night.
              </p>
            </div>

            {/* Colorways */}
            <div className="mt-6">
              <p className="text-xs text-[#5a5a56] mb-3">Available to view in 6 colorways:</p>
              <div className="flex flex-wrap gap-4 justify-center">
                {[
                  { name: "White", color: "#f5f5f5" },
                  { name: "Black", color: "#2a2a33" },
                  { name: "Navy", color: "#2d2a3e" },
                  { name: "Sky Blue", color: "#c9d7e8" },
                  { name: "Pink", color: "#e7d0d3" },
                  { name: "Sage", color: "#9ca594" },
                ].map((swatch, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className="w-6 h-6 rounded-full border border-[#ddd]"
                      style={{ backgroundColor: swatch.color }}
                    ></div>
                    <span className="text-xs mt-1">{swatch.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TROUSER Section - Right column on desktop */}
          <div className="w-full md:w-1/2 space-y-6 text-center">
            <h3 className="text-[#5a5a56] font-normal text-base uppercase tracking-wider">TROUSER</h3>
            <div className="font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-sm px-0 md:px-4">
              <p>
                Our pleated linen trousers are a quiet study in refinement. A single forward pleat introduces movement
                through the front, while the waistband combines a clean, classic front with discrete elastic at the back
                for added comfort. A single jetted pocket and classic-finished hem maintain the streamlined silhouette.
                Woven from the finest Italian linen and tailored in Italy, they strike a balance between structure and
                ease. Every detail speaks to a man searching for the finest quality and effortless elegance. Made and
                designed with a perfect summer in mind.
              </p>
            </div>

            {/* Colorways */}
            <div className="mt-6">
              <p className="text-xs text-[#5a5a56] mb-3">Available to view in 4 colorways:</p>
              <div className="flex flex-wrap gap-4 justify-center">
                {[
                  { name: "White", color: "#f5f5f5" },
                  { name: "Black", color: "#2a2a33" },
                  { name: "Navy", color: "#2d2a3e" },
                  { name: "Natural", color: "#eae7d9" },
                ].map((swatch, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div
                      className="w-6 h-6 rounded-full border border-[#ddd]"
                      style={{ backgroundColor: swatch.color }}
                    ></div>
                    <span className="text-xs mt-1">{swatch.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
