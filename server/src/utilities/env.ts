export const getEnv = (env: string): string | null => {
  if (!process.env[env]) {
    console.error(`${env} is not set`);
  }

  return process.env[env] || null;
};

export type Envs<T extends readonly string[]> = {
  [K in T[number]]: string;
};

export const getEnvs = <T extends readonly string[]>(
  envs: T,
): Envs<T> | null => {
  const envsValue = {} as Envs<T>;

  for (const env of envs) {
    const envKey = env as keyof Envs<T>;
    const envValue = getEnv(env);

    if (!envValue) {
      return null;
    }

    envsValue[envKey] = envValue;
  }

  return envsValue;
};
