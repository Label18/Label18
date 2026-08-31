import Link from "next/link";
import Image from "next/image";

export default function Categories() {
  return (
    <main className="w-full min-h-screen bg-[#050505] selection:bg-[#d4af37]/30 selection:text-white">

      {/* Premium Hero Section */}
      <section className="relative w-full h-[50vh] min-h-[400px] flex items-center justify-center overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neutral-900 via-[#030303] to-black"></div>
        <div className="absolute inset-0 bg-[#d4af37]/5 mix-blend-overlay"></div>

        <div className="relative z-10 text-center flex flex-col items-center px-4 mt-16">
          <div className="w-[1px] h-16 bg-gradient-to-b from-transparent to-[#d4af37]/50 mb-8"></div>
          <span className="font-outfit font-light text-[10px] tracking-[0.5em] uppercase text-[#d4af37] mb-6">
            The Collections
          </span>
          <h1 className="font-cinzel text-5xl md:text-7xl lg:text-[6rem] leading-none font-light text-white/95 tracking-[0.1em] uppercase">
            Curated <span className="text-[#d4af37] italic font-cormorant tracking-normal lowercase">Elegance</span>
          </h1>
          <p className="font-cormorant font-light text-lg md:text-xl text-white/50 max-w-2xl mx-auto tracking-wide leading-relaxed mt-8">
            Discover our meticulously selected outfits, statement jewellery, and accessories designed to elevate your everyday aura.
          </p>
        </div>
      </section>

      {/* Categories Showcase */}
      <section className="w-full flex justify-center py-32 px-6 lg:px-16">
        <div className="w-full max-w-[1400px] flex flex-col gap-32">

          {/* Category 1: Ethnic Wear (Left Aligned Image) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center group" id="ethnic">
            <div className="lg:col-span-7 relative overflow-hidden aspect-[4/5] lg:aspect-[16/10] bg-[#0a0a0a]">
              <div className="absolute inset-0 border border-white/10 m-4 z-20 pointer-events-none transition-transform duration-700 group-hover:scale-[0.98] group-hover:border-[#d4af37]/30"></div>
              <Image
                src="/sequence1/ezgif-frame-050.jpg"
                alt="Ethnic Wear Collection"
                fill
                className="object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
              />
            </div>
            <div className="lg:col-span-5 flex flex-col justify-center">
              <span className="font-outfit font-light text-[10px] tracking-[0.4em] uppercase text-[#d4af37]/60 mb-4 block">
                01 — Collection
              </span>
              <h2 className="font-cinzel text-4xl md:text-5xl font-light text-white/90 tracking-widest mb-6 uppercase">
                Ethnic Wear
              </h2>
              <p className="font-outfit font-light text-sm text-white/50 leading-[2.2] tracking-wide mb-10 max-w-md">
                Rooted in tradition but designed for the contemporary woman. Explore our stunning selection of ethnic wear that promises uncompromising quality, intricate detailing, and timeless silhouettes.
              </p>
              <Link href="#" className="inline-flex items-center gap-4 group/btn">
                <span className="font-outfit font-light text-[10px] tracking-[0.3em] uppercase text-[#d4af37]">Explore</span>
                <span className="w-12 h-[1px] bg-[#d4af37]/50 transition-all duration-300 group-hover/btn:w-20 group-hover/btn:bg-[#d4af37]"></span>
              </Link>
            </div>
          </div>

          {/* Category 2: Jewellery (Right Aligned Image) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center group" id="jewelry">
            <div className="lg:col-span-7 lg:order-last relative overflow-hidden aspect-[4/5] lg:aspect-[16/10] bg-[#0a0a0a]">
              <div className="absolute inset-0 border border-white/10 m-4 z-20 pointer-events-none transition-transform duration-700 group-hover:scale-[0.98] group-hover:border-[#d4af37]/30"></div>
              <Image
                src="/sequence3/ezgif-frame-050.jpg"
                alt="Jewellery Collection"
                fill
                className="object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
              />
            </div>
            <div className="lg:col-span-5 flex flex-col justify-center lg:items-end lg:text-right">
              <span className="font-outfit font-light text-[10px] tracking-[0.4em] uppercase text-[#d4af37]/60 mb-4 block">
                02 — Collection
              </span>
              <h2 className="font-cinzel text-4xl md:text-5xl font-light text-white/90 tracking-widest mb-6 uppercase">
                Jewellery
              </h2>
              <p className="font-outfit font-light text-sm text-white/50 leading-[2.2] tracking-wide mb-10 max-w-md">
                Statement pieces designed to completely transform an outfit. From traditional festive sets to immaculate contemporary accessories crafted for unforgettable occasions.
              </p>
              <Link href="#" className="inline-flex items-center lg:flex-row-reverse gap-4 group/btn">
                <span className="font-outfit font-light text-[10px] tracking-[0.3em] uppercase text-[#d4af37]">Explore</span>
                <span className="w-12 h-[1px] bg-[#d4af37]/50 transition-all duration-300 group-hover/btn:w-20 group-hover/btn:bg-[#d4af37]"></span>
              </Link>
            </div>
          </div>

          {/* Category 3: Accessories (Left Aligned Image) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center group" id="accessories">
            <div className="lg:col-span-7 relative overflow-hidden aspect-[4/5] lg:aspect-[16/10] bg-[#0a0a0a]">
              <div className="absolute inset-0 border border-white/10 m-4 z-20 pointer-events-none transition-transform duration-700 group-hover:scale-[0.98] group-hover:border-[#d4af37]/30"></div>
              <Image
                src="/sequence4/ezgif-frame-050.jpg"
                alt="Accessories Collection"
                fill
                className="object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000 ease-out"
              />
            </div>
            <div className="lg:col-span-5 flex flex-col justify-center">
              <span className="font-outfit font-light text-[10px] tracking-[0.4em] uppercase text-[#d4af37]/60 mb-4 block">
                03 — Collection
              </span>
              <h2 className="font-cinzel text-4xl md:text-5xl font-light text-white/90 tracking-widest mb-6 uppercase">
                Accessories
              </h2>
              <p className="font-outfit font-light text-sm text-white/50 leading-[2.2] tracking-wide mb-10 max-w-md">
                The definitive finishing touches. Carefully selected elements that add profound personality, sophistication, and individuality to your signature style.
              </p>
              <Link href="#" className="inline-flex items-center gap-4 group/btn">
                <span className="font-outfit font-light text-[10px] tracking-[0.3em] uppercase text-[#d4af37]">Explore</span>
                <span className="w-12 h-[1px] bg-[#d4af37]/50 transition-all duration-300 group-hover/btn:w-20 group-hover/btn:bg-[#d4af37]"></span>
              </Link>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}
