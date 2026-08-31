import Image from "next/image";

export default function AboutUs() {
  return (
    <main className="w-full min-h-screen bg-[#F8F6F0] text-[#1A1A1A] flex flex-col items-center selection:bg-[#d4af37]/30 selection:text-[#1A1A1A]">
      {/* Premium Hero Section */}
      <section className="relative w-full h-[38vh] min-h-[300px] flex items-center justify-center overflow-hidden border-b border-[#d4af37]/20 bg-[#F3F0E6]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-[#F8F6F0] to-[#EAE5D9]"></div>
        <div className="absolute inset-0 bg-[#d4af37]/5 mix-blend-multiply"></div>

        <div className="relative z-10 text-center flex flex-col items-center px-4 mt-6">
          <div className="w-[1px] h-10 bg-gradient-to-b from-transparent to-[#9c7d23] mb-4"></div>
          <span className="font-outfit font-medium text-[10.5px] tracking-[0.5em] uppercase text-[#9c7d23] mb-3" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            The Story Of
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-[5.5rem] leading-none font-normal text-[#1A1A1A] tracking-[0.08em] uppercase" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
            The Label <span className="text-[#9c7d23] italic font-normal lowercase tracking-normal">18</span>
          </h1>
        </div>
      </section>

      <div className="w-full max-w-[1400px] px-6 lg:px-16 py-16">

        {/* SECTION 1: Philosophy (Editorial Split with /aboutus.jpg) */}
        <section className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">

            {/* Left: Framed Image */}
            <div className="lg:col-span-5 relative group w-full max-w-sm mx-auto lg:max-w-none">
              <div className="absolute -inset-3 border border-[#9c7d23]/45 translate-x-3 translate-y-3 transition-transform duration-700 group-hover:translate-x-5 group-hover:translate-y-5"></div>
              <div className="relative aspect-[3/4] w-full bg-[#1A1A1A] overflow-hidden shadow-xl">
                <Image
                  src="/aboutus.jpg"
                  alt="The Label 18 Philosophy"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover opacity-95 group-hover:scale-105 transition-all duration-1000 ease-out"
                />
              </div>
            </div>

            {/* Right: Typography */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <h2 className="italic text-2xl md:text-4xl text-[#9c7d23] leading-snug mb-6" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                "Growth, positivity, abundance, confidence, and new beginnings."
              </h2>

              <div className="space-y-4 font-outfit font-light text-sm md:text-base text-[#1A1A1A]/80 leading-[1.9] tracking-wide max-w-2xl">
                <p>
                  <span className="text-[#1A1A1A] text-xl font-normal mr-2" style={{ fontFamily: '"Times New Roman", Times, serif' }}>T</span>he name 18 holds a special place at the heart of our brand. Our philosophy is rooted in the continuous journey of becoming the best version of yourself, expressed entirely through what you wear.
                </p>
                <p>
                  Our brand identity draws deep inspiration from the seven chakras, symbolising absolute balance and radiant positive energy.
                </p>
                <p>
                  The lotus represents breathtaking growth and transformation, while our signature golden aesthetic mirrors prosperity, elegance, and timeless luxury that commands the room.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* SECTION 2: Collections (Minimalist Grid) */}
        <section className="mb-20">
          <div className="border-t border-b border-[#1A1A1A]/15 py-14 bg-white/50 backdrop-blur-sm shadow-sm rounded-lg px-4 md:px-10">

            <div className="flex flex-col items-center text-center mb-10">
              <span className="font-outfit font-medium text-[11px] tracking-[0.4em] uppercase text-[#9c7d23] mb-3" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                What We Offer
              </span>
              <h2 className="text-3xl md:text-4xl font-normal text-[#1A1A1A] tracking-widest" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                OUR <span className="text-[#9c7d23] italic font-normal tracking-normal">COLLECTIONS</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x divide-[#1A1A1A]/15">
              {[
                { num: "01", title: "Clothing", desc: "A curated collection ranging from timeless traditional pieces to stylish contemporary fashion, selected for uncompromising quality and absolute elegance." },
                { num: "02", title: "Jewellery", desc: "Statement pieces designed to transform an outfit. From traditional festive sets to immaculate accessories crafted for unforgettable occasions." },
                { num: "03", title: "Accessories", desc: "The definitive finishing touches. Carefully selected elements that add profound personality, sophistication, and individuality to your style." }
              ].map((item, i) => (
                <div key={i} className="px-6 md:px-8 py-4 text-center group">
                  <span className="block font-outfit font-medium text-xs tracking-[0.3em] text-[#9c7d23] mb-3 transition-colors group-hover:scale-110 duration-300">
                    {item.num}
                  </span>
                  <h3 className="font-normal text-xl text-[#1A1A1A] mb-3 tracking-widest" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                    {item.title}
                  </h3>
                  <p className="font-outfit font-light text-xs md:text-sm text-[#1A1A1A]/70 leading-relaxed tracking-wide group-hover:text-[#1A1A1A] transition-colors duration-500">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <span className="inline-block border border-[#9c7d23]/40 bg-[#F8F6F0] px-6 py-2.5 font-outfit font-medium text-[10px] tracking-[0.4em] uppercase text-[#1A1A1A]/80 shadow-sm">
                One Destination. A Complete Look.
              </span>
            </div>

          </div>
        </section>

        {/* SECTION 3: Founders (Magazine Split Layout with /aboutusphoto.jpg) */}
        <section>
          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-20 items-start">

            {/* Left Column: Title & Founders Photo */}
            <div className="lg:w-1/3 lg:sticky lg:top-28 h-fit space-y-6">
              <div>
                <span className="font-outfit font-medium text-[11px] tracking-[0.4em] uppercase text-[#9c7d23] mb-3 block" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                  The People Behind
                </span>
                <h2 className="text-3xl md:text-4xl font-normal text-[#1A1A1A] tracking-widest leading-tight mb-4" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                  MEET THE <br />
                  <span className="text-[#9c7d23] italic font-normal tracking-normal">FOUNDERS</span>
                </h2>
                <div className="w-10 h-[1px] bg-[#9c7d23]/60 mb-4"></div>
                <p className="font-outfit font-medium text-xs tracking-[0.3em] uppercase text-[#1A1A1A]/70" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                  Priyanka &amp; Harish
                </p>
              </div>

              {/* Founders Photo */}
              <div className="relative group w-full max-w-xs">
                <div className="absolute -inset-2.5 border border-[#9c7d23]/45 translate-x-2.5 translate-y-2.5 transition-transform duration-700 group-hover:translate-x-4 group-hover:translate-y-4"></div>
                <div className="relative aspect-[4/5] w-full bg-[#1A1A1A] overflow-hidden shadow-xl">
                  <Image
                    src="/aboutusphoto.jpg"
                    alt="Priyanka & Harish - Founders of The Label 18"
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover opacity-95 group-hover:scale-105 transition-all duration-1000 ease-out"
                  />
                </div>
              </div>
            </div>

            {/* Right Column: Story */}
            <div className="lg:w-2/3">
              <div className="space-y-6 font-outfit font-light text-sm md:text-base text-[#1A1A1A]/80 leading-[1.9] tracking-wide">
                <p>
                  The Label 18 was founded by Priyanka and Harish, born from a shared vision of building a brand that goes far beyond simply selling fashion. It was designed to be an experience of elevation.
                </p>
                <p>
                  Priyanka brings her years of formidable experience in the beauty, bridal, and fashion industry. As a professional makeup artist, educator, and entrepreneur, she possesses a profound understanding of styling, colour theory, and what truly makes a woman radiate confidence. She has spent years working intimately with women, witnessing firsthand how the right styling completely transforms not just an appearance, but an aura.
                </p>

                {/* Pull Quote */}
                <blockquote className="my-8 pl-6 md:pl-8 border-l-2 border-[#9c7d23] py-2 bg-white/40 shadow-sm rounded-r-md">
                  <p className="italic text-xl md:text-2xl text-[#1A1A1A] leading-snug" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                    "When you feel good, you carry yourself differently. When you wear confidence, you shine differently."
                  </p>
                </blockquote>

                <p>
                  Her ultimate vision for The Label 18 is to curate a singular sanctuary where women don't have to endlessly search multiple boutiques to piece together the perfect look. Here, clothing, exquisite jewellery, and refined accessories are thoughtfully harmonized.
                </p>
                <p>
                  Harish anchors the foundation, bringing invaluable support and strategic involvement to building the brand's day-to-day journey and long-term trajectory. Together, Priyanka and Harish have sculpted The Label 18 into a destination built purely around style, relentless positivity, and grand aspiration.
                </p>
              </div>

              <div className="mt-12 text-center lg:text-left flex items-center gap-4 justify-center lg:justify-start">
                <span className="w-6 h-[1px] bg-[#9c7d23]"></span>
                <span className="font-outfit font-medium text-[10.5px] tracking-[0.4em] uppercase text-[#9c7d23]" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
                  The Essence of 18
                </span>
                <span className="w-6 h-[1px] bg-[#9c7d23]"></span>
              </div>
            </div>

          </div>
        </section>

      </div>
    </main>
  );
}