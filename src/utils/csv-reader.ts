import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";

// ✅ Define type for your CSV structure
export interface LoginTestData {
  expectedResult: string;
  testcaseId: string;
  usernameValue: string;
  passwordValue: string;
  currencyName?: string;
  currencyValue?: string;
}

export function readCSV(filePath: string): LoginTestData[] {
  const fullPath = path.resolve(filePath);
  const fileContent = fs.readFileSync(fullPath, "utf-8");

  const records = parse(fileContent, {
  columns: true,
  skip_empty_lines: true,
  relax_column_count: true, // 🔥 FIX
  trim: true,
});

  return records as LoginTestData[]; // ✅ FIX
}