'use client';

import React from 'react';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';

export function PostEffects() {
  return (
    <EffectComposer multisampling={4}>
      {/* Sci-Fi Neon Bloom */}
      <Bloom
        luminanceThreshold={0.25}
        luminanceSmoothing={0.9}
        intensity={1.4}
        mipmapBlur
      />
      {/* Cinematic Vignette */}
      <Vignette eskil={false} offset={0.1} darkness={0.8} />
    </EffectComposer>
  );
}
