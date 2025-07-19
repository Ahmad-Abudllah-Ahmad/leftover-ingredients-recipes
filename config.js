// API Configuration - Runtime
// This file handles API keys for both development and production

// For development: Set your API keys here
// For production: Use environment variables in Vercel/Netlify dashboard

const API_CONFIG = {
    // Gemini API Configuration
    GEMINI: {
        apiKey: process.env.GEMINI_API_KEY || window.GEMINI_API_KEY || 'your_gemini_api_key_here',
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
        enabled: true
    },
    
    // Unsplash API Configuration
    UNSPLASH: {
        accessKey: process.env.UNSPLASH_ACCESS_KEY || window.UNSPLASH_ACCESS_KEY || 'your_unsplash_access_key_here',
        secretKey: process.env.UNSPLASH_SECRET_KEY || window.UNSPLASH_SECRET_KEY || 'your_unsplash_secret_key_here',
        apiUrl: 'https://api.unsplash.com/search/photos',
        enabled: true
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
} else {
    window.API_CONFIG = API_CONFIG;
}
