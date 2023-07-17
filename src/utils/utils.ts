export const getEnv = (key: string) => {
  const value = process.env[key];
  if (value === undefined) {
    throw new Error(`Environment variable ${key} not found`);
  }
  return value;
};
