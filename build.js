#!/usr/bin/env node

// Build script for injecting environment variables into static files
const fs = require('fs');
const path = require('path');

console.log('🔧 Building LeftoverChef with environment variables...');

// Read the original script.js file
const scriptPath = path.join(__dirname, 'script.js');
let scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Get environment variables (these will be set in Vercel/Netlify dashboard)
const geminiApiKey = process.env.GEMINI_API_KEY || 'your_gemini_api_key_here';
const unsplashAccessKey = process.env.UNSPLASH_ACCESS_KEY || 'your_unsplash_access_key_here';
const unsplashSecretKey = process.env.UNSPLASH_SECRET_KEY || 'your_unsplash_secret_key_here';

console.log('📝 Injecting API keys into script.js...');
console.log('🔑 Gemini API Key:', geminiApiKey.substring(0, 10) + '...');
console.log('🔑 Unsplash Access Key:', unsplashAccessKey.substring(0, 10) + '...');

// Replace placeholders with actual API keys
scriptContent = scriptContent.replace(
    /apiKey: 'your_gemini_api_key_here'/g,
    `apiKey: '${geminiApiKey}'`
);

scriptContent = scriptContent.replace(
    /accessKey: 'your_unsplash_access_key_here'/g,
    `accessKey: '${unsplashAccessKey}'`
);

scriptContent = scriptContent.replace(
    /secretKey: 'your_unsplash_secret_key_here'/g,
    `secretKey: '${unsplashSecretKey}'`
);

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
    console.log('📁 Created public directory');
}

// Copy and update files to public directory
const filesToCopy = ['index.html', 'styles.css'];

filesToCopy.forEach(file => {
    const sourcePath = path.join(__dirname, file);
    const destPath = path.join(publicDir, file);
    fs.copyFileSync(sourcePath, destPath);
    console.log(`📋 Copied ${file} to public/`);
});

// Write the updated script.js to public directory
const publicScriptPath = path.join(publicDir, 'script.js');
fs.writeFileSync(publicScriptPath, scriptContent);
console.log('✅ Updated script.js written to public/script.js');

console.log('🎉 Build completed successfully!');
console.log('📂 Files ready in public/ directory for deployment');
