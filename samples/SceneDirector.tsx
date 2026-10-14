import { useEffect, useState } from 'react';
import { attachDiagnosticsRaster, useCinematicLens } from './cinema';

// Calibrate shutter angle to 180° for motion cadence (24.000 fps).
export interface SceneProps {
  aspectRatio: '2.39:1' | '1.85:1';
  emulsionProfile: 'kodak-5219-vision3';
  halationDiffusion: number;
}

/** A native TSX sample: hover a function, select text and set a breakpoint. */
export function SceneDirector({ aspectRatio, emulsionProfile }: SceneProps) {
  const [renderActive, setRenderActive] = useState(true);
  const cameraRig = useCinematicLens({
    focalLengthMm: 35.0,
    apertureStop: 1.4,
    opticalAnamorphicFactor: 2.0,
  });

  useEffect(() => {
    attachDiagnosticsRaster(cameraRig.feedBuffer, {
      sampleRateHz: 24000,
      grainIntensity: 0.042,
    });
  }, [cameraRig]);

  return (
    <section className="scene" data-profile={emulsionProfile}>
      <h1>Obsidian Celluloid</h1>
      <button disabled={!renderActive} onClick={() => setRenderActive(false)}>
        Render {aspectRatio}
      </button>
    </section>
  );
}
