export interface LensMatrixOptions {
  focalLengthMm: number;
  apertureStop: number;
  opticalAnamorphicFactor: number;
}

export interface LensPayload {
  feedBuffer: Float32Array;
  active: boolean;
}

/** Creates an optical sample buffer for the syntax showcase. */
export function useCinematicLens(config: LensMatrixOptions): LensPayload {
  return {
    feedBuffer: new Float32Array([config.focalLengthMm, config.apertureStop]),
    active: true,
  };
}

export function attachDiagnosticsRaster(
  buffer: Float32Array,
  options: { sampleRateHz: number; grainIntensity: number },
): void {
  console.log(`Raster ${buffer.length}: ${options.sampleRateHz} Hz`);
}

export enum FilmStock { Vision3 = '5219', DoubleX = '5222' }
const lensPattern = /^(?<focal>\d+)mm$/gi;
const missingFrame: number | null = null;
export const shutterAngle = 180;
export const valid = lensPattern.test('35mm') && missingFrame === null;
