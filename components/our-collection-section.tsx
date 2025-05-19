export default function OurCollectionSection() {
  return (
    <>
      {/* SHIRT Row - Lighter background spanning full width */}
      <section className="w-full bg-[#eeeeec]">
        <div className="w-full">
          <div className="flex flex-col md:flex-row gap-6 md:gap-0 min-h-[400px] md:min-h-[600px]">
            {/* Image Section - Left (taking about 50% width to match video container) */}
            <div className="w-full md:w-1/2 flex items-center py-8 md:py-16">
              <div className="w-full h-full bg-[#f5f5f3] flex items-center justify-center">
                <img
                  src="/white-linen-shirt-new.png"
                  alt="ETERNO White Linen Shirt"
                  className="w-auto h-auto max-h-[300px] sm:max-h-[400px] md:max-h-[500px] object-contain object-center"
                />
              </div>
            </div>

            {/* Text Section - Right (taking about 50% width to match video container) */}
            <div className="w-full md:w-1/2 space-y-4 md:space-y-6 px-4 sm:px-8 md:px-12 flex flex-col justify-center py-8 md:py-16">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-wider text-[#5a5a56]/70">SIGNATURE PIECE</p>
                <h3 className="text-[#5a5a56] font-normal text-sm sm:text-base uppercase tracking-wider">SHIRT</h3>
              </div>

              <div className="font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-xs sm:text-sm">
                <p>
                  Our signature shirt captures the spirit of Southern Italy through thoughtful tailoring and refined
                  detail. The clean, single-placket front flows into the soft roll of the paramontura collar, echoed by
                  curved cuffs fastened with genuine mother-of-pearl buttons. Hand-finished edges and perfect
                  buttonholes complete each piece.
                </p>
              </div>

              {/* Colorways */}
              <div className="mt-4 md:mt-6">
                <p className="text-xs text-[#5a5a56] mb-2 sm:mb-3">Available to view in 6 colorways:</p>
                <div className="flex flex-wrap gap-3 sm:gap-4">
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
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-[#ddd]"
                        style={{ backgroundColor: swatch.color }}
                      ></div>
                      <span className="text-[10px] sm:text-xs mt-1">{swatch.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TROUSER Row - Darker background spanning full width */}
      <section className="w-full bg-[#f9f8f5]">
        <div className="w-full">
          <div className="flex flex-col md:flex-row-reverse gap-6 md:gap-0 min-h-[400px] md:min-h-[600px]">
            {/* Image Section - Right (taking about 50% width to match video container) */}
            <div className="w-full md:w-1/2 flex items-center py-8 md:py-16">
              <div className="w-full h-full bg-[#f5f5f3] flex items-center justify-center">
                <img
                  src="/cream-linen-trousers-new.png"
                  alt="ETERNO Cream Linen Trousers"
                  className="w-auto h-auto max-h-[300px] sm:max-h-[400px] md:max-h-[500px] object-contain object-center"
                />
              </div>
            </div>

            {/* Text Section - Left (taking about 50% width to match video container) */}
            <div className="w-full md:w-1/2 space-y-4 md:space-y-6 px-4 sm:px-8 md:px-12 flex flex-col justify-center py-8 md:py-16">
              <div className="space-y-1 text-center md:text-left">
                <p className="text-xs uppercase tracking-wider text-[#5a5a56]/70">SIGNATURE PIECE</p>
                <h3 className="text-[#5a5a56] font-normal text-sm sm:text-base uppercase tracking-wider">TROUSER</h3>
              </div>

              <div className="font-mulish font-light text-[#5a5a56]/80 leading-relaxed text-xs sm:text-sm">
                <p>
                  Our pleated linen trousers are a quiet study in refinement. A single forward pleat introduces movement
                  through the front, while the waistband combines a clean, classic front with discrete elastic at the
                  back for added comfort. A single jetted pocket and classic-finished hem maintain the streamlined
                  silhouette. Woven from the finest Italian linen and tailored in Italy.
                </p>
              </div>

              {/* Colorways */}
              <div className="mt-4 md:mt-6">
                <p className="text-xs text-[#5a5a56] mb-2 sm:mb-3 text-center md:text-left">
                  Available to view in 4 colorways:
                </p>
                <div className="flex flex-wrap gap-3 sm:gap-4 justify-center md:justify-start">
                  {[
                    { name: "White", color: "#f5f5f5" },
                    { name: "Black", color: "#2a2a33" },
                    { name: "Navy", color: "#2d2a3e" },
                    { name: "Natural", color: "#eae7d9" },
                  ].map((swatch, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div
                        className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-[#ddd]"
                        style={{ backgroundColor: swatch.color }}
                      ></div>
                      <span className="text-[10px] sm:text-xs mt-1">{swatch.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
