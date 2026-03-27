export interface GeneratedDataset {
  datasetName: string;
  rows: Record<string, string | number | boolean>[];
}

export interface TestdataGeneratorAgent {
  generate(seed?: string): Promise<GeneratedDataset>;
}
