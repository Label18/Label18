"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import CanvasSequence, { SequenceConfig } from "@/components/CanvasSequence";
import { getCategoriesTree, CategoryTree } from "@/lib/categories";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const sequences: SequenceConfig[] = [
    { path: "/sequence1/ezgif-frame-", frameCount: 207 },
    { path: "/sequence2/ezgif-frame-", frameCount: 300 },
];

const sequences2: SequenceConfig[] = [
    { path: "/sequence3/ezgif-frame-", frameCount: 240 },
    { path: "/sequence4/ezgif-frame-", frameCount: 240 },
    { path: "/sequence5/ezgif-frame-", frameCount: 240 },
];

export default function Home() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Section 1 refs
    const scrollSectionRef = useRef<HTMLDivElement>(null);
    const textRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [scrollProgress, setScrollProgress] = useState(0);

    // Section 2 refs
    const scrollSectionRef2 = useRef<HTMLDivElement>(null);
    const textRefs2 = useRef<(HTMLDivElement | null)[]>([]);
    const [scrollProgress2, setScrollProgress2] = useState(0);

    // Dynamic Categories from Admin Panel
    const [categories, setCategories] = useState<CategoryTree[]>([]);

    useEffect(() => {
        getCategoriesTree().then(setCategories).catch(console.error);
    }, []);

    const clothingCat = categories.find(c =>
        c.name.toLowerCase().includes("cloth") ||
        c.name.toLowerCase().includes("ethnic") ||
        c.name.toLowerCase().includes("wear") ||
        c.name.toLowerCase().includes("dress")
    ) || categories[0];

    const jewelleryCat = categories.find(c =>
        c.name.toLowerCase().includes("jewel") ||
        c.name.toLowerCase().includes("accessor")
    ) || categories[1];

    const fallbackClothingImages = [
        "/sequence1/ezgif-frame-050.jpg",
        "/sequence2/ezgif-frame-050.jpg",
        "/sequence1/ezgif-frame-150.jpg",
        "/sequence2/ezgif-frame-150.jpg",
    ];

    const fallbackJewelleryImages = [
        "/sequence3/ezgif-frame-050.jpg",
        "/sequence4/ezgif-frame-050.jpg",
        "/sequence5/ezgif-frame-050.jpg",
        "/sequence3/ezgif-frame-150.jpg",
    ];

    const floatClasses = ["float-v2 delay-1", "float-diag delay-2", "float-breathe delay-3", "float-drift delay-1", "float-v1 delay-2"];

    useGSAP(() => {
        // === SECTION 1 LOGIC ===
        const tlScroll = gsap.timeline({
            scrollTrigger: {
                trigger: scrollSectionRef.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                onUpdate: (self) => {
                    setScrollProgress(self.progress);
                }
            }
        });

        const textCount = textRefs.current.length;
        textRefs.current.forEach((text, i) => {
            if (!text) return;

            const isLast = i === textCount - 1;
            const startOffset = i === 0 ? 0.05 : (i / textCount) - 0.05;
            const endOffset = isLast ? 1 : (i + 1) / textCount;

            if (i === 0) {
                tlScroll.fromTo(text,
                    { opacity: 1, y: 0, scale: 1 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.05 },
                    startOffset
                ).to(text,
                    { opacity: 0, y: -20, scale: 1.02, duration: 0.05 },
                    endOffset - 0.05
                );
            } else if (isLast) {
                tlScroll.fromTo(text,
                    { opacity: 0, y: 30, scale: 0.97 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.1 },
                    startOffset
                );
            } else {
                tlScroll.fromTo(text,
                    { opacity: 0, y: 30, scale: 0.97 },
                    { opacity: 1, y: 0, scale: 1, duration: 0.05 },
                    startOffset
                )
                    .to(text,
                        { opacity: 0, y: -20, scale: 1.02, duration: 0.05 },
                        endOffset - 0.05
                    );
            }
        });

        // Pad the timeline to allow dead space at the end of the section for the last element
        tlScroll.set({}, {}, 1.05);

        // === SECTION 2 LOGIC ===
        const tlScroll2 = gsap.timeline({
            scrollTrigger: {
                trigger: scrollSectionRef2.current,
                start: "top top",
                end: "bottom bottom",
                scrub: 1,
                onUpdate: (self) => {
                    setScrollProgress2(self.progress);
                }
            }
        });

        const textCount2 = textRefs2.current.length;
        textRefs2.current.forEach((text, i) => {
            if (!text) return;

            const isLast = i === textCount2 - 1;
            const startOffset = i === 0 ? 0 : (i / textCount2) - 0.05;
            const fadeInDuration = i === 0 ? 0.001 : 0.05;
            const endOffset = isLast ? 1 : (i + 1) / textCount2;

            if (i === 0) {
                tlScroll2.fromTo(text,
                    { opacity: 1, y: 0, scale: 1 },
                    { opacity: 1, y: 0, scale: 1, duration: fadeInDuration },
                    startOffset
                ).to(text,
                    { opacity: 0, y: -20, scale: 1.02, duration: 0.05 },
                    endOffset - 0.05
                );
            } else if (isLast) {
                tlScroll2.fromTo(text,
                    { opacity: 0, y: 30, scale: 0.97 },
                    { opacity: 1, y: 0, scale: 1, duration: fadeInDuration },
                    startOffset
                );
            } else {
                tlScroll2.fromTo(text,
                    { opacity: 0, y: 30, scale: 0.97 },
                    { opacity: 1, y: 0, scale: 1, duration: fadeInDuration },
                    startOffset
                )
                    .to(text,
                        { opacity: 0, y: -20, scale: 1.02, duration: 0.05 },
                        endOffset - 0.05
                    );
            }
        });

        // Pad the timeline to allow dead space at the end of the section for the last element
        tlScroll2.set({}, {}, 1.05);

        // Intro Overlay scroll behavior
        const introOverlay = document.getElementById("intro-overlay");
        const onScroll = () => {
            if (window.scrollY > 50) {
                introOverlay?.classList.add("is-scrolled");
            } else {
                introOverlay?.classList.remove("is-scrolled");
            }
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);

    }, { scope: containerRef });

    // Calculate counters
    const getCounter1 = (progress: number) => {
        let num = 1;
        if (progress >= 0.875) num = 8;
        else if (progress >= 0.75) num = 7;
        else if (progress >= 0.625) num = 6;
        else if (progress >= 0.5) num = 5;
        else if (progress >= 0.375) num = 4;
        else if (progress >= 0.25) num = 3;
        else if (progress >= 0.125) num = 2;
        return num;
    };

    const getCounter2 = (progress: number) => {
        let num = 1;
        if (progress >= 0.9) num = 10;
        else if (progress >= 0.8) num = 9;
        else if (progress >= 0.7) num = 8;
        else if (progress >= 0.6) num = 7;
        else if (progress >= 0.5) num = 6;
        else if (progress >= 0.4) num = 5;
        else if (progress >= 0.3) num = 4;
        else if (progress >= 0.2) num = 3;
        else if (progress >= 0.1) num = 2;
        return num;
    };

    const num1 = getCounter1(scrollProgress);
    const num2 = getCounter2(scrollProgress2);

    return (
        <main ref={containerRef} className="bg-black">

            {/* ============================================================ */}
            {/* HERO SECTION 1 - ETHNIC WEAR                                 */}
            {/* ============================================================ */}
            <section id="hero" ref={scrollSectionRef} className="hero-section" style={{ height: "1200vh" }}>
                <div className="hero-sticky">
                    <CanvasSequence
                        triggerRef={scrollSectionRef}
                        sequences={sequences}
                        className="hero-canvas"
                    />

                    <div className="hero-gradient-overlay"></div>

                    <div ref={el => { textRefs.current[0] = el; }} className="hero-text-overlay text-first">
                        <div className="hero-accent-line">
                            <div className="accent-bar"></div>
                            <span className="accent-label">The Label 18</span>
                        </div>
                        <h1 className="hero-title-bold" style={{ color: "var(--color-gold)" }}>
                            A NEW<br />
                            <span className="hero-title-stroke">ERA</span>
                        </h1>
                        <p className="hero-desc" style={{ color: "#ffffff" }}>Discover an aesthetic defined by its energy and crafted with absolute precision.</p>
                    </div>

                    <div ref={el => { textRefs.current[1] = el; }} className="hero-text-overlay hero-text-right pos-top-right text-align-right">
                        <div className="hero-accent-line">
                            <div className="accent-bar"></div>
                            <span className="accent-label">Craftsmanship</span>
                        </div>
                        <h2 className="hero-title-bold hero-title-md" style={{ color: "var(--color-gold)" }}>
                            CRAFTED TO<br />
                            <span className="hero-title-stroke">PERFECTION</span>
                        </h2>
                        <p className="hero-desc" style={{ color: "#ffffff" }}>Over 40 individual pieces, meticulously assembled by master artisans.</p>
                    </div>

                    <div ref={el => { textRefs.current[2] = el; }} className="hero-text-overlay hero-text-right">
                        <div className="hero-accent-line">
                            <div className="accent-bar"></div>
                            <span className="accent-label">Essence</span>
                        </div>
                        <h2 className="hero-title-bold hero-title-md" style={{ color: "var(--color-gold)" }}>
                            EXPRESS YOUR<br />
                            <span className="hero-title-stroke">ESSENCE</span>
                        </h2>
                        <p className="hero-desc" style={{ color: "#ffffff" }}>Every detail, every stitch, designed to reflect your inner vitality.</p>
                    </div>

                    <div ref={el => { textRefs.current[3] = el; }} className="hero-text-overlay hero-text-right pos-top-right text-align-right">
                        <div className="hero-accent-line">
                            <div className="accent-bar"></div>
                            <span className="accent-label">Materials</span>
                        </div>
                        <h2 className="hero-title-bold hero-title-md" style={{ color: "var(--color-gold)" }}>
                            PREMIUM<br />
                            <span className="hero-title-stroke">TEXTURES</span>
                        </h2>
                        <p className="hero-desc" style={{ color: "#ffffff" }}>Exquisite materials engineered for absolute durability and an unforgettable touch.</p>
                    </div>

                    <div ref={el => { textRefs.current[4] = el; }} className="hero-text-overlay hero-text-right">
                        <div className="hero-accent-line">
                            <div className="accent-bar"></div>
                            <span className="accent-label">Elegance</span>
                        </div>
                        <h2 className="hero-title-bold hero-title-md" style={{ color: "var(--color-gold)" }}>
                            TIMELESS<br />
                            <span className="hero-title-stroke">ELEGANCE</span>
                        </h2>
                        <p className="hero-desc" style={{ color: "#ffffff" }}>Where modern design meets eternal grace. A perfect balance of form and function.</p>
                    </div>

                    <div ref={el => { textRefs.current[5] = el; }} className="hero-text-overlay hero-text-right pos-top-right text-align-right">
                        <div className="hero-accent-line">
                            <div className="accent-bar"></div>
                            <span className="accent-label">Silhouette</span>
                        </div>
                        <h2 className="hero-title-bold hero-title-md" style={{ color: "var(--color-gold)" }}>
                            COMPLETE<br />
                            <span className="hero-title-stroke">PROFILE</span>
                        </h2>
                        <p className="hero-desc" style={{ color: "#ffffff" }}>A stunning silhouette that commands attention from absolutely every angle.</p>
                    </div>

                    <div ref={el => { textRefs.current[6] = el; }} className="hero-text-overlay hero-text-right">
                        <div className="hero-accent-line">
                            <div className="accent-bar"></div>
                            <span className="accent-label">Luxury</span>
                        </div>
                        <h2 className="hero-title-bold hero-title-md" style={{ color: "var(--color-gold)" }}>
                            REFINED<br />
                            <span className="hero-title-stroke">LUXURY</span>
                        </h2>
                        <p className="hero-desc" style={{ color: "#ffffff" }}>Uncompromised quality that speaks volumes without saying a single word.</p>
                    </div>

                    <div ref={el => { textRefs.current[7] = el; }} className="hero-text-overlay text-last">
                        <div className="hero-accent-line">
                            <div className="accent-bar"></div>
                            <span className="accent-label">Collection</span>
                        </div>
                        <h2 className="hero-title-bold hero-title-md" style={{ color: "var(--color-gold)" }}>
                            MAKE IT<br />
                            <span className="hero-title-stroke">YOURS</span>
                        </h2>
                        <Link href={clothingCat ? `/categories/${clothingCat.id}` : "/categories"} className="hero-cta-pill">
                            Explore {clothingCat?.name || "Ethnic Wear"}
                        </Link>
                    </div>

                    <div className={`scroll-indicator ${scrollProgress > 0.02 ? 'hidden' : ''}`}>
                        <div className="scroll-line"></div>
                        <span className="scroll-text">Scroll to explore</span>
                    </div>

                    <div className="hero-counter">
                        <span className="counter-current">0{num1}</span>
                        <div className="counter-divider"></div>
                        <span className="counter-total">08</span>
                    </div>
                </div>
            </section>

            {/* ============================================================ */}
            {/* ETHNIC WEAR PRODUCTS SHOWCASE                                */}
            {/* ============================================================ */}
            <section className="bg-black relative z-10" style={{ paddingTop: "6rem", paddingBottom: "8rem" }}>
                <div className="w-full flex justify-center px-0 sm:px-6 lg:px-8">
                    <div className="w-full max-w-7xl">
                        <div className="flex flex-col items-center text-center mb-16">
                            <div className="hero-accent-line justify-center mb-4">
                                <span className="accent-label">Explore Category</span>
                            </div>
                            <h2 className="hero-title-bold" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: "var(--color-gold)", marginBottom: "1rem" }}>
                                ETHNIC WEAR<br />
                                <span className="hero-title-stroke" style={{ fontSize: 'clamp(2.8rem, 5.5vw, 4.5rem)' }}>COLLECTION</span>
                            </h2>
                        </div>

                        <div className="category-grid" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                            {(clothingCat?.sub_categories && clothingCat.sub_categories.length > 0
                                ? clothingCat.sub_categories
                                : [
                                    { id: "1", name: "Signature Saree", image_url: null },
                                    { id: "2", name: "Classic Lehenga", image_url: null },
                                    { id: "3", name: "Evening Kurti", image_url: null }
                                ]
                            ).map((sub: any, i: number) => {
                                const href = clothingCat && sub.id !== "1" && sub.id !== "2" && sub.id !== "3"
                                    ? `/categories/${clothingCat.id}/${sub.id}`
                                    : clothingCat ? `/categories/${clothingCat.id}` : "/shop";
                                const img = sub.image_url || fallbackClothingImages[i % fallbackClothingImages.length];
                                const floatClass = floatClasses[i % floatClasses.length];
                                return (
                                    <Link href={href} key={sub.id || i} className="category-card hover-float-parent">
                                        <div className="category-card-image">
                                            <img src={img} alt={sub.name} loading="lazy" className={`floating-img ${floatClass}`} />
                                            <div className="category-card-gradient"></div>
                                            <div className="category-card-label" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', width: '100%', left: 0, right: 0 }}>
                                                <h3 style={{ textAlign: 'center', margin: 0, width: '100%' }}>{sub.name}</h3>
                                                <p style={{ textAlign: 'center', width: '100%' }}>Explore Collection</p>
                                            </div>
                                        </div>
                                        <div className="category-card-bar"></div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================================ */}
            {/* HERO SECTION 2 - JEWELRY                                   */}
            {/* ============================================================ */}
            <section id="hero2" ref={scrollSectionRef2} className="hero-section" style={{ height: "1800vh" }}>
                <div className="hero-sticky">
                    <CanvasSequence
                        triggerRef={scrollSectionRef2}
                        sequences={sequences2}
                        className="hero-canvas"
                    />

                    <div className="hero-gradient-overlay"></div>

                    <div ref={el => { textRefs2.current[0] = el; }} className="hero-text-overlay text-first">
                        <div className="hero-accent-line">
                            <div className="accent-bar"></div>
                            <span className="accent-label">The Jewelry Edit</span>
                        </div>
                        <h1 className="hero-title-bold" style={{ color: "var(--color-gold)" }}>
                            A NEW<br />
                            <span className="hero-title-stroke">VISION</span>
                        </h1>
                        <p className="hero-desc" style={{ color: "#ffffff" }}>Discover brilliance captured in precious metals and flawless stones.</p>
                    </div>

                    <div ref={el => { textRefs2.current[1] = el; }} className="hero-text-overlay hero-text-right pos-top-right text-align-right">
                        <div className="hero-accent-line">
                            <div className="accent-bar"></div>
                            <span className="accent-label">Craftsmanship</span>
                        </div>
                        <h2 className="hero-title-bold hero-title-md" style={{ color: "var(--color-gold)" }}>
                            MASTER<br />
                            <span className="hero-title-stroke">FORGED</span>
                        </h2>
                        <p className="hero-desc" style={{ color: "#ffffff" }}>Every link and setting is carefully crafted by master jewelers.</p>
                    </div>

                    <div ref={el => { textRefs2.current[2] = el; }} className="hero-text-overlay hero-text-right">
                        <div className="hero-accent-line">
                            <div className="accent-bar"></div>
                            <span className="accent-label">Materials</span>
                        </div>
                        <h2 className="hero-title-bold hero-title-md" style={{ color: "var(--color-gold)" }}>
                            SOLID<br />
                            <span className="hero-title-stroke">GOLD</span>
                        </h2>
                        <p className="hero-desc" style={{ color: "#ffffff" }}>Forged from 18k solid gold that commands the room with its weight and warmth.</p>
                    </div>

                    <div ref={el => { textRefs2.current[3] = el; }} className="hero-text-overlay hero-text-right pos-top-right text-align-right">
                        <div className="hero-accent-line">
                            <div className="accent-bar"></div>
                            <span className="accent-label">Brilliance</span>
                        </div>
                        <h2 className="hero-title-bold hero-title-md" style={{ color: "var(--color-gold)" }}>
                            RADIANT<br />
                            <span className="hero-title-stroke">CUT</span>
                        </h2>
                        <p className="hero-desc" style={{ color: "#ffffff" }}>Flawless stones that capture and multiply the light around you.</p>
                    </div>

                    <div ref={el => { textRefs2.current[4] = el; }} className="hero-text-overlay hero-text-right">
                        <div className="hero-accent-line">
                            <div className="accent-bar"></div>
                            <span className="accent-label">Elegance</span>
                        </div>
                        <h2 className="hero-title-bold hero-title-md" style={{ color: "var(--color-gold)" }}>
                            ETERNAL<br />
                            <span className="hero-title-stroke">BEAUTY</span>
                        </h2>
                        <p className="hero-desc" style={{ color: "#ffffff" }}>A timeless statement that transcends generations and trends.</p>
                    </div>

                    <div ref={el => { textRefs2.current[5] = el; }} className="hero-text-overlay hero-text-right pos-top-right text-align-right">
                        <div className="hero-accent-line">
                            <div className="accent-bar"></div>
                            <span className="accent-label">Details</span>
                        </div>
                        <h2 className="hero-title-bold hero-title-md" style={{ color: "var(--color-gold)" }}>
                            INTRICATE<br />
                            <span className="hero-title-stroke">DESIGN</span>
                        </h2>
                        <p className="hero-desc" style={{ color: "#ffffff" }}>No facet is left untouched. Absolute perfection from every conceivable angle.</p>
                    </div>

                    <div ref={el => { textRefs2.current[6] = el; }} className="hero-text-overlay hero-text-right">
                        <div className="hero-accent-line">
                            <div className="accent-bar"></div>
                            <span className="accent-label">Luxury</span>
                        </div>
                        <h2 className="hero-title-bold hero-title-md" style={{ color: "var(--color-gold)" }}>
                            ULTIMATE<br />
                            <span className="hero-title-stroke">SHINE</span>
                        </h2>
                        <p className="hero-desc" style={{ color: "#ffffff" }}>Wear your brilliance on your sleeve and illuminate every room you enter.</p>
                    </div>

                    <div ref={el => { textRefs2.current[7] = el; }} className="hero-text-overlay hero-text-right pos-top-right text-align-right">
                        <div className="hero-accent-line">
                            <div className="accent-bar"></div>
                            <span className="accent-label">Excellence</span>
                        </div>
                        <h2 className="hero-title-bold hero-title-md" style={{ color: "var(--color-gold)" }}>
                            PURE<br />
                            <span className="hero-title-stroke">ELEGANCE</span>
                        </h2>
                        <p className="hero-desc" style={{ color: "#ffffff" }}>Adorn yourself in unmatched sophistication and grace.</p>
                    </div>

                    <div ref={el => { textRefs2.current[8] = el; }} className="hero-text-overlay hero-text-right">
                        <div className="hero-accent-line">
                            <div className="accent-bar"></div>
                            <span className="accent-label">The Peak</span>
                        </div>
                        <h2 className="hero-title-bold hero-title-md" style={{ color: "var(--color-gold)" }}>
                            SUPREME<br />
                            <span className="hero-title-stroke">CRAFT</span>
                        </h2>
                        <p className="hero-desc" style={{ color: "#ffffff" }}>A culmination of artistic vision and master execution.</p>
                    </div>

                    <div ref={el => { textRefs2.current[9] = el; }} className="hero-text-overlay text-last">
                        <div className="hero-accent-line">
                            <div className="accent-bar"></div>
                            <span className="accent-label">Collection</span>
                        </div>
                        <h2 className="hero-title-bold hero-title-md" style={{ color: "var(--color-gold)" }}>
                            OWN THE<br />
                            <span className="hero-title-stroke">LIGHT</span>
                        </h2>
                        <Link href={jewelleryCat ? `/categories/${jewelleryCat.id}` : "/categories"} className="hero-cta-pill">
                            Explore {jewelleryCat?.name || "Jewelry"}
                        </Link>
                    </div>

                    <div className={`scroll-indicator ${scrollProgress2 > 0.02 ? 'hidden' : ''}`}>
                        <div className="scroll-line"></div>
                        <span className="scroll-text">Scroll to explore</span>
                    </div>

                    <div className="hero-counter">
                        <span className="counter-current">{num2.toString().padStart(2, '0')}</span>
                        <div className="counter-divider"></div>
                        <span className="counter-total">10</span>
                    </div>
                </div>
            </section>

            {/* ============================================================ */}
            {/* JEWELRY PRODUCTS SHOWCASE                                    */}
            {/* ============================================================ */}
            <section className="bg-black relative z-10" style={{ paddingTop: "6rem", paddingBottom: "8rem" }}>
                <div className="w-full flex justify-center px-0 sm:px-6 lg:px-8">
                    <div className="w-full max-w-7xl">
                        <div className="flex flex-col items-center text-center mb-16">
                            <div className="hero-accent-line justify-center mb-4">
                                <span className="accent-label">Explore Category</span>
                            </div>
                            <h2 className="hero-title-bold" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', color: "var(--color-gold)", marginBottom: "1rem" }}>
                                THE JEWELRY<br />
                                <span className="hero-title-stroke" style={{ fontSize: 'clamp(2.8rem, 5.5vw, 4.5rem)' }}>EDIT</span>
                            </h2>
                        </div>

                        <div className="category-grid" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                            {(jewelleryCat?.sub_categories && jewelleryCat.sub_categories.length > 0
                                ? jewelleryCat.sub_categories
                                : [
                                    { id: "1", name: "18k Solid Link", image_url: null },
                                    { id: "2", name: "Radiant Solitaire", image_url: null },
                                    { id: "3", name: "Eternity Band", image_url: null }
                                ]
                            ).map((sub: any, i: number) => {
                                const href = jewelleryCat && sub.id !== "1" && sub.id !== "2" && sub.id !== "3"
                                    ? `/categories/${jewelleryCat.id}/${sub.id}`
                                    : jewelleryCat ? `/categories/${jewelleryCat.id}` : "/shop";
                                const img = sub.image_url || fallbackJewelleryImages[i % fallbackJewelleryImages.length];
                                const floatClass = floatClasses[i % floatClasses.length];
                                return (
                                    <Link href={href} key={sub.id || i} className="category-card hover-float-parent">
                                        <div className="category-card-image">
                                            <img src={img} alt={sub.name} loading="lazy" className={`floating-img ${floatClass}`} />
                                            <div className="category-card-gradient"></div>
                                            <div className="category-card-label" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', width: '100%', left: 0, right: 0 }}>
                                                <h3 style={{ textAlign: 'center', margin: 0, width: '100%' }}>{sub.name}</h3>
                                                <p style={{ textAlign: 'center', width: '100%' }}>Explore Collection</p>
                                            </div>
                                        </div>
                                        <div className="category-card-bar"></div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>


        </main>
    );
}