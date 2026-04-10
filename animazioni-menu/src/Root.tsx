import { Composition } from "remotion";
import { PizzeriaMagic } from "./PizzeriaMagic";
import { CucinaTradition } from "./CucinaTradition";
import { BeverageCheers } from "./BeverageCheers";
import { HeroManiInPasta } from "./HeroManiInPasta";
import { HeroPalaNelForno } from "./HeroPalaNelForno";
import { HeroMixologyVintage } from "./HeroMixologyVintage";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/*
       * ═══════════════════════════════════════════════
       * BORGO PIGNETO — Menu Overlay Animations
       * ═══════════════════════════════════════════════
       * Export transparent WebM:
       *   npx remotion render <Id> out.webm --codec=vp8
       * ═══════════════════════════════════════════════
       */}

      {/* ─── MICRO-ANIMATIONS (Small overlays) ─── */}
      <Composition
        id="PizzeriaMagic"
        component={PizzeriaMagic}
        durationInFrames={150}
        fps={30}
        width={440}
        height={320}
      />
      <Composition
        id="CucinaTradition"
        component={CucinaTradition}
        durationInFrames={150}
        fps={30}
        width={400}
        height={320}
      />
      <Composition
        id="BeverageCheers"
        component={BeverageCheers}
        durationInFrames={150}
        fps={30}
        width={440}
        height={320}
      />

      {/* ─── HERO ILLUSTRATIONS (Large headers, 6s) ─── */}
      <Composition
        id="HeroManiInPasta"
        component={HeroManiInPasta}
        durationInFrames={180}
        fps={30}
        width={800}
        height={400}
      />
      <Composition
        id="HeroPalaNelForno"
        component={HeroPalaNelForno}
        durationInFrames={180}
        fps={30}
        width={800}
        height={460}
      />
      <Composition
        id="HeroMixologyVintage"
        component={HeroMixologyVintage}
        durationInFrames={180}
        fps={30}
        width={800}
        height={400}
      />
    </>
  );
};
