// Borgo Pigneto - Premium GSAP Animations
document.addEventListener("DOMContentLoaded", () => {
  // Register ScrollTrigger
  gsap.registerPlugin(ScrollTrigger);

  // 1. INTRO ANIMATION (Hero Timeline)
  function runIntroAnimation() {
    const tl = gsap.timeline();
    // Start with items invisible
    gsap.set(".frame", { opacity: 0, scale: 0.96 });
    gsap.set(".cor", { opacity: 0, scale: 0 });
    gsap.set(".logo", { opacity: 0, scale: 0.9, y: 15 });
    gsap.set([".bname", ".bsub", ".orn"], { opacity: 0, y: 15 });
    
    // Hero and first content
    const heroIll = document.querySelector(".hero-illustration");
    if(heroIll) gsap.set(heroIll, { opacity: 0, y: 20 });
    
    // First element of content
    const firstSec = document.querySelector(".sec");
    let firstSecHeader, firstSecIcon, firstSecItems, firstSecTexts;
    if(firstSec) {
      gsap.set(firstSec, { opacity: 0 }); 
      firstSecHeader = firstSec.querySelector(".sh");
      firstSecIcon = firstSec.querySelector(".deco-icon");
      firstSecItems = firstSec.querySelectorAll(".it, .sf, .wi, .cl, .bg, .ckt, .note");
      firstSecTexts = firstSec.querySelectorAll(".st, .ss");
      
      if(firstSecHeader) gsap.set(firstSecHeader, { opacity: 0, y: 30 });
      if(firstSecIcon) {
        const paths = firstSecIcon.querySelectorAll("path, line, circle, rect, polyline, polygon");
        paths.forEach(p => {
          const length = p.getTotalLength ? p.getTotalLength() : 300;
          gsap.set(p, { strokeDasharray: length, strokeDashoffset: length });
        });
      }
      if(firstSecTexts.length > 0) gsap.set(firstSecTexts, { clipPath: "inset(0% 100% 0% 0%)" });
      if(firstSecItems && firstSecItems.length > 0) gsap.set(firstSecItems, { opacity: 0, y: 25 });
    }

    // Animate frame and corners
    tl.to(".frame", { opacity: 1, scale: 1, duration: 1.4, ease: "power3.out" })
      .to(".cor", { opacity: 1, scale: 1, duration: 0.9, ease: "back.out(1.5)", stagger: 0.1 }, "-=1.0")
      // Animate logo and title
      .to(".logo", { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "power3.out" }, "-=0.8")
      .to(".bname", { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, "-=0.8")
      .to(".bsub", { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, "-=0.7")
      .to(".orn", { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, "-=0.7");
      
    if(heroIll) {
      tl.to(heroIll, { opacity: 1, y: 0, duration: 1, ease: "power3.out", onStart: () => {
         const video = heroIll.querySelector("video");
         if(video) {
            video.currentTime = 0;
            video.play();
         }
      } }, "-=0.5");
      const heroPaths = heroIll.querySelectorAll("path, line, circle, rect, polyline, polygon");
      if(heroPaths.length > 0) {
        heroPaths.forEach(p => {
          const length = p.getTotalLength && (p.nodeName.toLowerCase() === 'path' || p.nodeName.toLowerCase() === 'rect' || p.nodeName.toLowerCase() === 'circle') ? p.getTotalLength() : 1500;
          gsap.set(p, { strokeDasharray: length, strokeDashoffset: length });
        });
        tl.to(heroPaths, { strokeDashoffset: 0, duration: 3.5, ease: "power2.inOut", stagger: 0.1 }, "-=0.8");
      }
    }

    if(firstSec) {
      tl.to(firstSec, { opacity: 1, duration: 0.1 }, "-=3.2");
      if(firstSecHeader) tl.to(firstSecHeader, { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" }, "-=3.2");
      if(firstSecIcon) {
         const paths = firstSecIcon.querySelectorAll("path, line, circle, rect, polyline, polygon");
         tl.to(paths, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut", stagger: 0.2 }, "-=3.0");
      }
      if(firstSecTexts && firstSecTexts.length > 0) {
         tl.to(firstSecTexts, { clipPath: "inset(0% 0% 0% 0%)", duration: 2.4, ease: "power1.inOut", stagger: 0.3 }, "-=3.0");
      }
      if(firstSecItems && firstSecItems.length > 0) {
         tl.to(firstSecItems, { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: "power2.out" }, "-=2.4");
      }
    }
  }

  runIntroAnimation();

  // 2. SCROLL ANIMATIONS (Stagger Items and Icons)
  const sections = document.querySelectorAll(".sec");

  sections.forEach((sec, index) => {
    // Skip intro animation for the VERY FIRST section, we handled it in timeline
    if (index === 0) return; 

    const header = sec.querySelector(".sh");
    const icon = sec.querySelector(".deco-icon");
    const items = sec.querySelectorAll(".it, .sf, .wi, .cl, .bg, .ckt, .note");

    // Animate header container fading up
    if (header) {
      gsap.fromTo(header, 
        { opacity: 0, y: 30 },
        {
          scrollTrigger: {
            trigger: header,
            start: "top 85%", 
            toggleActions: "play none none reverse"
          },
          opacity: 1, y: 0, duration: 1.2, ease: "power3.out"
        }
      );

      // SVG fluid stroke animation
      if (icon) {
        const paths = icon.querySelectorAll("path, line, circle, rect, polyline, polygon");
        paths.forEach(p => {
          // Fallback if SVG doesn't support getTotalLength
          const length = p.getTotalLength ? p.getTotalLength() : 300;
          gsap.set(p, { strokeDasharray: length, strokeDashoffset: length });
        });

        gsap.to(paths, {
          scrollTrigger: {
            trigger: header,
            start: "top 85%",
            toggleActions: "play none none reverse"
          },
          strokeDashoffset: 0,
          duration: 1.8,
          ease: "power2.inOut",
          stagger: 0.2
        });
      }

      // Title Text reveal (clip-path wipe effect to simulate drawing)
      const headerTexts = sec.querySelectorAll(".st, .ss");
      if (headerTexts.length > 0) {
        gsap.fromTo(headerTexts,
          { clipPath: "inset(0% 100% 0% 0%)" },
          {
            scrollTrigger: {
              trigger: header,
              start: "top 85%",
              toggleActions: "play none none reverse"
            },
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 2.4,
            ease: "power1.inOut",
            stagger: 0.3
          }
        );
      }
    }

    // Stagger items underneath
    if (items.length > 0) {
      gsap.fromTo(items, 
        { opacity: 0, y: 25 },
        {
          scrollTrigger: {
            trigger: sec, 
            start: "top 80%",
            toggleActions: "play none none reverse"
          },
          opacity: 1, 
          y: 0, 
          duration: 0.9, 
          stagger: 0.1, 
          ease: "power2.out"
        }
      );
    }
  });

  // Extras and Footer animations
  const bottomElements = document.querySelectorAll(".ext, .ab, .md, .ftr");
  bottomElements.forEach((el) => {
    gsap.fromTo(el, 
      { opacity: 0, y: 35 },
      {
        scrollTrigger: {
          trigger: el,
          start: "top 90%",
          toggleActions: "play none none reverse"
        },
        opacity: 1, y: 0, duration: 1.2, ease: "power3.out"
      }
    );
  });
});
