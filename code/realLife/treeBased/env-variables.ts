export const env_variables = {
    ENVIRONMENT: process.env.VITE_ENVIRONMENT,
    API_CONFIG: process.env.VITE_API_CONFIG,
    LLP_API_URL: process.env.LLP_API_URL,
    LLP_API_STATIC_TOKEN: process.env.LLP_API_STATIC_TOKEN || 'NO_TOKEN',
    LLP_STAGING_DYNAMIC_USER_ID: process.env.LLP_STAGING_DYNAMIC_USER_ID,
}
