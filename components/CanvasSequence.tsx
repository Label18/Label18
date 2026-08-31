"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export interface SequenceConfig {
  path: string; // e.g., "/sequence1/ezgif-frame-"
  frameCount: number; // e.g., 240
}

interface CanvasSequenceProps {
  sequences: SequenceConfig[];
  className?: string;
  triggerRef: React.RefObject<HTMLElement | null>;
}

export default function CanvasSequence({
  sequences,
  className = "",
  triggerRef,
}: CanvasSequenceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const frameRef = useRef({ frame: 0 });

  const totalFrames = sequences.reduce((acc, seq) => acc + seq.frameCount, 0);

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;
    let globalFrameIndex = 0;

    sequences.forEach((seq) => {
      for (let i = 1; i <= seq.frameCount; i++) {
        const img = new Image();
        const paddedIndex = i.toString().padStart(3, "0");
        img.src = `${seq.path}${paddedIndex}.jpg`;

        const currentGlobalIndex = globalFrameIndex++;

        img.onload = () => {
          loadedCount++;
          if (currentGlobalIndex === 0 && canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if (ctx) renderImage(img, ctx, canvasRef.current);
          }
        };
        loadedImages.push(img);
      }
    });

    setImages(loadedImages);
  }, [sequences]);

  const drawImageOnly = (
    img: HTMLImageElement,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    if (!img.width || !img.height) return;

    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;

    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    );
  };

  const renderImage = (
    img: HTMLImageElement,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) => {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.globalAlpha = 1;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawImageOnly(img, ctx, canvas);
  };

  useGSAP(
    () => {
      if (!triggerRef.current || images.length === 0 || !canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const handleResize = () => {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        if (images[Math.round(frameRef.current.frame)]) {
          renderImage(images[Math.round(frameRef.current.frame)], ctx, canvas);
        }
      };

      handleResize();
      window.addEventListener("resize", handleResize);

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        },
      });

      timeline.to(frameRef.current, {
        frame: totalFrames - 1,
        snap: "frame",
        ease: "none",
        onUpdate: () => {
          const currentFrame = Math.round(frameRef.current.frame);
          if (images[currentFrame]) {
            renderImage(images[currentFrame], ctx, canvas);
          }
        },
      });

      return () => {
        window.removeEventListener("resize", handleResize);
        timeline.kill();
      };
    },
    { dependencies: [images, triggerRef], scope: triggerRef }
  );

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full object-cover ${className}`}
    />
  );
}
