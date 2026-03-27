import { HybridTestCase } from "../../core/base-test";
import { LoginPage } from "../../pages/web/login.page";
import { readCSV, LoginTestData } from "../../utils/csv-reader";

const csvData: LoginTestData[] = readCSV("src/testdata/web/login.data.csv");

// ✅ filter empty rows (VERY IMPORTANT)
const validData = csvData.filter(d => d.testcaseId && d.usernameValue);

export const LoginTests: HybridTestCase[] = validData.map((data) => ({
  id: data.testcaseId,
  name: `Login Test - ${data.testcaseId}`,
  suite: "smoke",
  platform: "web",
  tags: ["login"],

  run: async (context) => {
    if (!context.page) throw new Error("Page not initialized");

    const login = new LoginPage(context.page);

    await login.navigate(context.baseUrl);
    await login.login(data.usernameValue, data.passwordValue);

    let actual = "";

    if (data.expectedResult.includes("explore")) {
      actual = await login.getDashboardMessage();
    } else {
      actual = await login.getToasterMessage();
    }

    if (!actual.includes(data.expectedResult)) {
      throw new Error(
        `[${data.testcaseId}] Expected: ${data.expectedResult}, Got: ${actual}`
      );
    }
  },
}));