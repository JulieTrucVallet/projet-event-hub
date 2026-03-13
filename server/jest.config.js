export default {
  collectCoverage: false,
  preset: "ts-jest",
  testEnvironment: "node",
  testRegex: "\\.spec\\.ts$",
  coverageDirectory: "../coverage",
  coverageProvider: "v8",
  moduleFileExtensions: ["js", "json", "ts", "tsx"],
};