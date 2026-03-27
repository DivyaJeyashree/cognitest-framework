import fs from "node:fs/promises";

export const readJsonData = async <T>(filePath: string): Promise<T> => {
  const payload = await fs.readFile(filePath, "utf8");
  return JSON.parse(payload) as T;
};
