import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  supabase: {
    url: process.env.SUPABASE_URL || '',
    anonKey: process.env.SUPABASE_ANON_KEY || '',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    bucketName: process.env.SUPABASE_BUCKET_NAME || '',
  },
  
  stt: {
    provider: process.env.STT_PROVIDER || 'assemblyai', // 'assemblyai' or 'google-cloud'
    assemblyai: {
      apiKey: process.env.ASSEMBLYAI_API_KEY || '',
    },
    googleCloud: {
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || '',
      keyFilename: process.env.GOOGLE_CLOUD_KEY_FILENAME || '',
    },
  },
  
  openai: {
    apiKey: process.env.OPENAI_API_KEY || '',
  },
  
  api: {
    keySecret: process.env.OTO_API_KEY_SECRET || 'default-secret',
  },
};

// Validate required environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
  'ASSEMBLYAI_API_KEY',
  'OPENAI_API_KEY',
  'SUPABASE_BUCKET_NAME',
];

export function validateConfig(): void {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
