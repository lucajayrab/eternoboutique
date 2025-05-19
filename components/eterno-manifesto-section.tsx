export default function EternoManifestoSection() {
  return (
    <section className="w-full bg-[#5a5a56] text-white py-20 md:py-28">
      <div className="container mx-auto px-6 md:px-8 max-w-4xl">
        <h2 className="font-mulish text-xl md:text-2xl font-light tracking-widest uppercase text-center mb-16">
          The ETERNO Manifesto
        </h2>

        <div className="space-y-12">
          <div className="text-center">
            <p className="font-mulish text-xl md:text-2xl font-light italic leading-relaxed">
              "We believe in the quiet confidence that comes from wearing garments crafted with intention, designed to
              endure, and made to be lived in fully."
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="space-y-4">
              <h3 className="font-mulish text-base uppercase tracking-wider font-light">Timeless Over Trendy</h3>
              <p className="font-mulish font-light text-white/80 leading-relaxed text-sm">
                We create pieces that transcend seasons and fleeting fashions, focusing instead on enduring style that
                remains relevant year after year.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-mulish text-base uppercase tracking-wider font-light">Quality Over Quantity</h3>
              <p className="font-mulish font-light text-white/80 leading-relaxed text-sm">
                Each ETERNO garment represents our commitment to exceptional craftsmanship, using only the finest
                materials and time-honored techniques.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-mulish text-base uppercase tracking-wider font-light">Presence Over Performance</h3>
              <p className="font-mulish font-light text-white/80 leading-relaxed text-sm">
                Our clothing isn't designed to make a statement, but rather to enhance the natural presence of the
                individual who wears it with confidence and ease.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
