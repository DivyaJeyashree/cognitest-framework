import fs from "node:fs/promises";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

export interface VisualDiffResult {
  mismatchPixels: number;
  diffPath: string;
}

export const compareScreenshots = async (
  baselinePath: string,
  actualPath: string,
  diffPath: string
): Promise<VisualDiffResult> => {
  const [baselinePng, actualPng] = await Promise.all([
    fs.readFile(baselinePath),
    fs.readFile(actualPath)
  ]);

  const baseline = PNG.sync.read(baselinePng);
  const actual = PNG.sync.read(actualPng);
  const diff = new PNG({ width: baseline.width, height: baseline.height });

  const mismatchPixels = pixelmatch(
    baseline.data,
    actual.data,
    diff.data,
    baseline.width,
    baseline.height,
    { threshold: 0.1 }
  );

  await fs.writeFile(diffPath, PNG.sync.write(diff));
  return { mismatchPixels, diffPath };
};
