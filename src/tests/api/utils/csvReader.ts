import fs from "fs";
import path from "path";

export const readCSV = (filePath: string) => {
  const fullPath = path.resolve(filePath);

  const file = fs.readFileSync(fullPath, "utf-8");

  const lines = file.split("\n").map(line => line.trim()).filter(Boolean);

  const headers = lines[0].split(",");

  return lines.slice(1).map(line => {
    const values = line.split(",");

    const obj: Record<string, string> = {};

    headers.forEach((header, i) => {
      obj[header] = values[i];
    });

    return obj;
  });
};