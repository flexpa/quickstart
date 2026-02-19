function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export { requiredEnv };

export const env = {
  publishableKey: requiredEnv('NEXT_PUBLIC_FLEXPA_PUBLISHABLE_KEY'),
  redirectUri: requiredEnv('NEXT_PUBLIC_REDIRECT_URI'),
};
