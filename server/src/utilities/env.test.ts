import { getEnv, getEnvs } from "./env";

describe("getEnv", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("should return the value of the environment variable", () => {
    vi.stubEnv("MY_ENV_VAR", "value");

    expect(getEnv("MY_ENV_VAR")).toBe("value");
  });

  it("should return null if the environment variable is not set", () => {
    expect(getEnv("MY_ENV_VAR")).toBeNull();
  });

  it("should return null if the environment variable is empty", () => {
    vi.stubEnv("MY_ENV_VAR", "");

    expect(getEnv("MY_ENV_VAR")).toBeNull();
  });
});

describe("getEnvs", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("should return the values of the environment variables", () => {
    vi.stubEnv("MY_ENV_VAR_1", "value1");
    vi.stubEnv("MY_ENV_VAR_2", "value2");

    expect(getEnvs(["MY_ENV_VAR_1", "MY_ENV_VAR_2"])).toEqual({
      MY_ENV_VAR_1: "value1",
      MY_ENV_VAR_2: "value2",
    });
  });

  it("should return null if an environment variable is not set", () => {
    vi.stubEnv("MY_ENV_VAR_1", "value1");

    expect(getEnvs(["MY_ENV_VAR_1", "MY_ENV_VAR_2"])).toBeNull();
  });

  it("should return null if an environment variable is empty", () => {
    vi.stubEnv("MY_ENV_VAR_1", "value1");
    vi.stubEnv("MY_ENV_VAR_2", "");

    expect(getEnvs(["MY_ENV_VAR_1", "MY_ENV_VAR_2"])).toBeNull();
  });
});
