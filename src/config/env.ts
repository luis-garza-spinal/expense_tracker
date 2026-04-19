export interface EnvConfig {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
}

const REQUIRED_VARS = [
  { envKey: 'EXPO_PUBLIC_SUPABASE_URL', configKey: 'SUPABASE_URL' },
  { envKey: 'EXPO_PUBLIC_SUPABASE_ANON_KEY', configKey: 'SUPABASE_ANON_KEY' },
] as const;

export function getEnvConfig(): EnvConfig {
  const config: Record<string, string> = {};
  const missing: string[] = [];

  for (const { envKey, configKey } of REQUIRED_VARS) {
    const value = process.env[envKey];
    if (!value || typeof value !== 'string' || value.trim() === '') {
      missing.push(envKey);
    } else {
      config[configKey] = value;
    }
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
      'Check your .env file and ensure variables are prefixed with EXPO_PUBLIC_.'
    );
  }

  return config as unknown as EnvConfig;
}
