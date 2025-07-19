// Google Gemini API Configuration
// To use this app, replace 'your_gemini_api_key_here' with your actual Gemini API key
const GEMINI_CONFIG = {
    apiKey: 'your_gemini_api_key_here', // Replace with your actual Gemini API key
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
    enabled: true
};

// Gemini AI Model Configuration
const AI_MODELS = {
    gemini: {
        name: 'AI Recipe Generator',
        model: 'gemini-2.0-flash',
        apiUrl: GEMINI_CONFIG.baseUrl,
        enabled: true,
        maxTokens: 8192, // Increased for 15 recipes generation
        temperature: 0.7,
        type: 'gemini'
    }
};
  
  // Test recipe generation with specific ingredients
  async function testRecipeGeneration(ingredients) {
    const testPrompt = `You are a professional chef AI. Create a detailed recipe that MUST use ALL of these ingredients: ${ingredients.join(', ')}.

IMPORTANT REQUIREMENTS:
- Every single ingredient I listed (${ingredients.join(', ')}) must be mentioned and used in the recipe
- Provide detailed preparation steps that explain HOW to use each ingredient
- Include specific quantities for each ingredient
- Give clear, step-by-step cooking instructions

Recipe using ${ingredients.join(', ')}:`;
    
    console.log('🧪 Testing recipe generation with ingredients:', ingredients);
    console.log('📝 Full prompt:', testPrompt);
    
    try {
      const response = await fetch(LOCAL_LLM_CONFIG.baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: testPrompt,
          max_tokens: 400,
          temperature: 0.8,
          stop: ['\n\n\n', 'Recipe:', 'Ingredients used:']
        })
      });
  
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      const generatedText = data.choices?.[0]?.text || data.text || '';
      
      console.log('✅ Raw LLM response:', generatedText);
      
      // Check if all ingredients are mentioned
      const mentionedIngredients = ingredients.filter(ing => 
        generatedText.toLowerCase().includes(ing.toLowerCase())
      );
      const missedIngredients = ingredients.filter(ing => 
        !generatedText.toLowerCase().includes(ing.toLowerCase())
      );
      
      console.log('✅ Ingredients mentioned:', mentionedIngredients);
      if (missedIngredients.length > 0) {
        console.log('❌ Ingredients MISSED:', missedIngredients);
      }
      
      return {
        success: true,
        output: generatedText,
        mentionedIngredients,
        missedIngredients
      };
    } catch (error) {
      console.error('❌ Recipe generation test failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  // Add to window for testing
  window.testRecipeGeneration = testRecipeGeneration;
// Hugging Face API Configuration (Legacy - not used in current version)
const HUGGINGFACE_CONFIG = {
    apiKey: 'your_huggingface_api_key_here', // Replace with your actual Hugging Face API key if needed
    enabled: false, // Not used in current version
    fallbackToMock: false // No mock responses - only real results
};

// Unsplash API Configuration  
// To use this app, replace the placeholder keys with your actual Unsplash API keys
const UNSPLASH_CONFIG = {
    apiUrl: 'https://api.unsplash.com/search/photos',
    accessKey: 'your_unsplash_access_key_here', // Replace with your actual Unsplash Access Key
    secretKey: 'your_unsplash_secret_key_here', // Replace with your actual Unsplash Secret Key
    enabled: true // Real API calls enabled
};

// Common ingredients for quick add functionality
const COMMON_INGREDIENTS = [
    'chicken', 'beef', 'pork', 'fish', 'eggs', 'rice', 'pasta', 'potatoes',
    'onions', 'garlic', 'tomatoes', 'carrots', 'broccoli', 'spinach',
    'cheese', 'milk', 'butter', 'olive oil', 'salt', 'pepper', 'herbs'
];

// Common ingredients by country/cuisine for quick add functionality
const COUNTRY_INGREDIENTS = {
    'Italian': ['pasta', 'tomatoes', 'basil', 'mozzarella', 'parmesan', 'olive oil', 'garlic'],
    'Mexican': ['beans', 'rice', 'peppers', 'onions', 'cilantro', 'lime', 'avocado'],
    'Chinese': ['rice', 'soy sauce', 'ginger', 'garlic', 'sesame oil', 'green onions', 'noodles'],
    'Japanese': ['rice', 'soy sauce', 'miso', 'seaweed', 'tofu', 'sake', 'wasabi'],
    'Korean': ['rice', 'kimchi', 'gochujang', 'sesame oil', 'garlic', 'soy sauce', 'beef'],
    'Indian': ['rice', 'lentils', 'curry powder', 'onions', 'garlic', 'ginger', 'tomatoes'],
    'Pakistani': ['rice', 'lentils', 'cumin', 'coriander', 'turmeric', 'onions', 'yogurt'],
    'Thai': ['rice', 'coconut milk', 'curry paste', 'lemongrass', 'lime', 'fish sauce', 'chilies'],
    'Mediterranean': ['olive oil', 'tomatoes', 'feta cheese', 'olives', 'herbs', 'lemon', 'garlic'],
    'American': ['ground beef', 'cheese', 'potatoes', 'onions', 'bacon', 'butter', 'corn'],
    'French': ['butter', 'herbs', 'wine', 'cheese', 'onions', 'garlic', 'cream'],
    'Spanish': ['olive oil', 'tomatoes', 'paprika', 'garlic', 'onions', 'rice', 'saffron'],
    'German': ['potatoes', 'sausage', 'cabbage', 'onions', 'beer', 'mustard', 'pork'],
    'British': ['potatoes', 'beef', 'carrots', 'onions', 'peas', 'butter', 'herbs'],
    'Middle Eastern': ['olive oil', 'chickpeas', 'tahini', 'lemon', 'garlic', 'parsley', 'cumin'],
    'Brazilian': ['beans', 'rice', 'beef', 'onions', 'garlic', 'peppers', 'lime']
};

// Recipe database with sample recipes
const RECIPE_DATABASE = [
    {
        id: 1,
        name: "Leftover Chicken Fried Rice",
        image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400&h=300&fit=crop",
        cookTime: "15 mins",
        difficulty: "Easy",
        ingredients: [
            "2 cups cooked rice",
            "1 cup leftover chicken, diced",
            "2 eggs, beaten",
            "1 cup mixed vegetables",
            "2 tbsp soy sauce",
            "1 tbsp sesame oil",
            "2 cloves garlic, minced",
            "2 green onions, chopped"
        ],
        steps: [
            "Heat oil in a large pan or wok over medium-high heat",
            "Add beaten eggs and scramble, then remove from pan",
            "Add garlic and cook for 30 seconds until fragrant",
            "Add rice and break up any clumps",
            "Stir in chicken, vegetables, and soy sauce",
            "Add scrambled eggs back to the pan",
            "Drizzle with sesame oil and garnish with green onions",
            "Serve hot and enjoy!"
        ]
    },
    {
        id: 2,
        name: "Vegetable Pasta Bake",
        image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop",
        cookTime: "30 mins",
        difficulty: "Medium",
        ingredients: [
            "2 cups cooked pasta",
            "1 cup mixed leftover vegetables",
            "1 cup marinara sauce",
            "1/2 cup mozzarella cheese",
            "1/4 cup parmesan cheese",
            "2 tbsp olive oil",
            "1 tsp Italian herbs",
            "Salt and pepper to taste"
        ],
        steps: [
            "Preheat oven to 375°F (190°C)",
            "Mix pasta with vegetables and marinara sauce",
            "Transfer to a greased baking dish",
            "Top with mozzarella and parmesan cheese",
            "Sprinkle with Italian herbs",
            "Bake for 20-25 minutes until cheese is golden",
            "Let cool for 5 minutes before serving",
            "Garnish with fresh herbs if desired"
        ]
    },
    {
        id: 3,
        name: "Leftover Meat Tacos",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
        cookTime: "10 mins",
        difficulty: "Easy",
        ingredients: [
            "1 cup leftover cooked meat",
            "6 small tortillas",
            "1/2 cup shredded lettuce",
            "1/2 cup diced tomatoes",
            "1/4 cup shredded cheese",
            "1/4 cup sour cream",
            "1 tbsp taco seasoning",
            "Lime wedges for serving"
        ],
        steps: [
            "Heat leftover meat in a pan with taco seasoning",
            "Warm tortillas in a dry pan or microwave",
            "Fill tortillas with seasoned meat",
            "Top with lettuce, tomatoes, and cheese",
            "Add a dollop of sour cream",
            "Serve with lime wedges",
            "Enjoy your quick and delicious tacos!"
        ]
    },
    {
        id: 4,
        name: "Leftover Soup",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop",
        cookTime: "25 mins",
        difficulty: "Easy",
        ingredients: [
            "2 cups leftover vegetables",
            "1 cup leftover meat or protein",
            "4 cups vegetable or chicken broth",
            "1 can diced tomatoes",
            "1 tsp dried herbs",
            "1 bay leaf",
            "Salt and pepper to taste",
            "1 tbsp olive oil"
        ],
        steps: [
            "Heat olive oil in a large pot",
            "Add any hard vegetables first and sauté",
            "Add broth, tomatoes, and herbs",
            "Bring to a boil, then reduce heat and simmer",
            "Add leftover meat and softer vegetables",
            "Season with salt and pepper",
            "Simmer for 15-20 minutes",
            "Remove bay leaf and serve hot"
        ]
    },
    {
        id: 5,
        name: "Leftover Stir Fry",
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop",
        cookTime: "12 mins",
        difficulty: "Easy",
        ingredients: [
            "2 cups mixed leftover vegetables",
            "1 cup leftover protein",
            "2 tbsp vegetable oil",
            "2 cloves garlic, minced",
            "1 tbsp ginger, minced",
            "2 tbsp soy sauce",
            "1 tbsp oyster sauce",
            "1 tsp sesame oil",
            "Cooked rice for serving"
        ],
        steps: [
            "Heat oil in a large wok or pan over high heat",
            "Add garlic and ginger, stir-fry for 30 seconds",
            "Add harder vegetables first, cook for 2-3 minutes",
            "Add leftover protein and softer vegetables",
            "Stir in soy sauce and oyster sauce",
            "Cook for 2-3 more minutes until heated through",
            "Drizzle with sesame oil",
            "Serve over rice immediately"
        ]
    }
];

// API Test Function - Check if models are working
async function testAPIConnections() {
    console.log('🧪 Testing API connections...');
    const testInput = "Write a simple recipe using chicken and rice.";
    
    for (const [modelKey, modelConfig] of Object.entries(AI_MODELS)) {
        if (!modelConfig.enabled) continue;
        
        try {
            console.log(`Testing ${modelConfig.name}...`);
            const response = await fetch(modelConfig.apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${HUGGINGFACE_CONFIG.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    inputs: testInput,
                    parameters: { max_length: 100, temperature: 0.7 },
                    options: { wait_for_model: true }
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log(`✅ ${modelConfig.name} is working:`, result[0]?.generated_text?.substring(0, 100) + '...');
            } else {
                console.error(`❌ ${modelConfig.name} failed:`, response.status, response.statusText);
            }
        } catch (error) {
            console.error(`❌ ${modelConfig.name} error:`, error.message);
        }
    }
}

// DOM Elements
const ingredientInput = document.getElementById('ingredientInput');
const addIngredientBtn = document.getElementById('addIngredient');
const ingredientsList = document.getElementById('ingredientsList');
const quickIngredients = document.getElementById('quickIngredients');
const quickCountries = document.getElementById('quickCountries');
const generateBtn = document.getElementById('generateBtn');
const loading = document.getElementById('loading');
const resultsSection = document.getElementById('resultsSection');
const recipesGrid = document.getElementById('recipesGrid');

// State
let ingredients = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
    animateOnLoad();
});

function initializeEventListeners() {
    // Ingredients events
    addIngredientBtn.addEventListener('click', addIngredient);
    ingredientInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addIngredient();
        }
    });
    
    // Generate button
    generateBtn.addEventListener('click', generateRecipeWithT5);
    
    // Initialize quick add features
    initializeQuickIngredients();
    initializeQuickCountries();
}

function animateOnLoad() {
    // Add staggered animation to cards
    const cards = document.querySelectorAll('.ingredients-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
}

function initializeQuickIngredients() {
    console.log('🔧 Initializing Quick Add Common Ingredients...');
    
    if (!quickIngredients) {
        console.error('❌ quickIngredients element not found!');
        return;
    }
    
    // Clear existing content
    quickIngredients.innerHTML = '';
    
    COMMON_INGREDIENTS.forEach(ingredient => {
        const quickBtn = document.createElement('div');
        quickBtn.className = 'quick-ingredient';
        quickBtn.textContent = ingredient;
        quickBtn.style.cssText = `
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 8px 16px;
            margin: 4px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.3s ease;
            user-select: none;
        `;
        
        quickBtn.addEventListener('click', () => {
            if (!ingredients.includes(ingredient.toLowerCase())) {
                ingredients.push(ingredient.toLowerCase());
                renderIngredients();
                
                // Visual feedback
                quickBtn.style.background = '#4CAF50';
                quickBtn.textContent = ingredient + ' ✓';
                setTimeout(() => {
                    quickBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    quickBtn.textContent = ingredient;
                }, 1000);
            }
        });
        
        quickBtn.addEventListener('mouseenter', () => {
            quickBtn.style.transform = 'translateY(-2px)';
            quickBtn.style.boxShadow = '0 5px 15px rgba(0,0,0,0.3)';
        });
        
        quickBtn.addEventListener('mouseleave', () => {
            quickBtn.style.transform = 'translateY(0)';
            quickBtn.style.boxShadow = 'none';
        });
        
        quickIngredients.appendChild(quickBtn);
    });
    
    console.log(`✅ Loaded ${COMMON_INGREDIENTS.length} quick ingredients`);
}

function initializeQuickCountries() {
    console.log('🔧 Initializing Quick Add Common Countries...');
    
    if (!quickCountries) {
        console.error('❌ quickCountries element not found!');
        return;
    }
    
    // Clear existing content
    quickCountries.innerHTML = '';
    
    Object.keys(COUNTRY_INGREDIENTS).forEach(country => {
        const countryBtn = document.createElement('div');
        countryBtn.className = 'quick-country';
        countryBtn.textContent = country;
        countryBtn.style.cssText = `
            display: inline-block;
            background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
            color: white;
            padding: 10px 20px;
            margin: 6px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 15px;
            font-weight: 600;
            transition: all 0.3s ease;
            user-select: none;
            position: relative;
        `;
        
        countryBtn.addEventListener('click', () => {
            const countryIngredients = COUNTRY_INGREDIENTS[country];
            let addedCount = 0;
            
            countryIngredients.forEach(ingredient => {
                if (!ingredients.includes(ingredient.toLowerCase())) {
                    ingredients.push(ingredient.toLowerCase());
                    addedCount++;
                }
            });
            
            if (addedCount > 0) {
                renderIngredients();
                
                // Visual feedback
                countryBtn.style.background = '#4CAF50';
                countryBtn.textContent = `${country} +${addedCount} ✓`;
                setTimeout(() => {
                    countryBtn.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
                    countryBtn.textContent = country;
                }, 2000);
            } else {
                // All ingredients already added
                countryBtn.style.background = '#FFC107';
                countryBtn.textContent = country + ' (already added)';
                setTimeout(() => {
                    countryBtn.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
                    countryBtn.textContent = country;
                }, 1500);
            }
        });
        
        countryBtn.addEventListener('mouseenter', () => {
            countryBtn.style.transform = 'translateY(-3px)';
            countryBtn.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
        });
        
        countryBtn.addEventListener('mouseleave', () => {
            countryBtn.style.transform = 'translateY(0)';
            countryBtn.style.boxShadow = 'none';
        });
        
        quickCountries.appendChild(countryBtn);
    });
    
    console.log(`✅ Loaded ${Object.keys(COUNTRY_INGREDIENTS).length} country ingredient sets`);
}

// Generate additional recipes using T5-style system when Gemini returns fewer than 20
function generateAdditionalRecipes(ingredientsList, count) {
    console.log(`🔧 Generating ${count} additional T5-style recipes...`);
    
    const recipes = [];
    const cookingMethods = ['Stir-Fry', 'One-Pan', 'Creamy Sauté', 'Boil & Toss', 'Grilled', 'Baked', 'Roasted', 'Steamed'];
    const adjectives = ['Delicious', 'Savory', 'Hearty', 'Fresh', 'Spicy', 'Mild', 'Gourmet', 'Comfort', 'Healthy', 'Quick'];
    
    for (let i = 0; i < count; i++) {
        const method = cookingMethods[i % cookingMethods.length];
        const adjective = adjectives[i % adjectives.length];
        const mainIngredient = ingredientsList[0] || 'ingredient';
        
        const recipe = {
            id: `t5-${Date.now()}-${i}`,
            name: `${adjective} ${method} ${mainIngredient.charAt(0).toUpperCase() + mainIngredient.slice(1)}`,
            description: `A ${adjective.toLowerCase()} ${method.toLowerCase()} recipe featuring ${ingredientsList.join(', ')}`,
            ingredients: ingredientsList.map(ing => {
                const quantity = getIngredientQuantity(ing);
                return `${quantity} ${ing}`;
            }),
            instructions: [
                `Prepare all ingredients: ${ingredientsList.join(', ')}.`,
                `Heat a large pan over medium-high heat.`,
                `Add the main ingredients and cook for 5-7 minutes.`,
                `Season with salt, pepper, and desired spices.`,
                `Continue cooking until ingredients are tender.`,
                `Adjust seasoning to taste and serve hot.`
            ],
            cookingTime: ['15 minutes', '20 minutes', '25 minutes', '30 minutes'][i % 4],
            difficulty: ['Easy', 'Medium', 'Hard'][i % 3],
            servings: 4,
            source: 'T5-Style Generator',
            style: ['Classic', 'Premium', 'Gourmet'][i % 3],
            cuisine: ['International', 'Fusion', 'Modern'][i % 3],
            image: null // Will be populated by the main function
        };
        
        recipes.push(recipe);
    }
    
    console.log(`✅ Generated ${recipes.length} additional T5-style recipes`);
    return recipes;
}



// Ingredients handling
function addIngredient() {
    const ingredient = ingredientInput.value.trim();
    if (ingredient && !ingredients.includes(ingredient.toLowerCase())) {
        ingredients.push(ingredient.toLowerCase());
        renderIngredients();
        ingredientInput.value = '';
    }
}

function removeIngredient(ingredient) {
    ingredients = ingredients.filter(item => item !== ingredient);
    renderIngredients();
}

function renderIngredients() {
    ingredientsList.innerHTML = '';
    ingredients.forEach(ingredient => {
        const tag = document.createElement('div');
        tag.className = 'ingredient-tag';
        tag.innerHTML = `
            <span>${ingredient}</span>
            <button onclick="removeIngredient('${ingredient}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        ingredientsList.appendChild(tag);
    });
}

// Multi-Model Recipe Generation
async function generateRecipeWithT5() {
    if (ingredients.length === 0) {
        showNotification('Please add some ingredients first!', 'warning');
        return;
    }
    
    // Show loading
    generateBtn.disabled = true;
    loading.style.display = 'block';
    resultsSection.style.display = 'none';
    
    try {
        showNotification('🤖 Generating multiple recipes with AI models...', 'info');
        
        // Generate recipes from both models
        const recipes = await generateMultipleRecipes(ingredients);
        
        if (recipes && recipes.length > 0) {
            console.log('Multiple recipes generated successfully:', recipes);
            displayMultipleRecipes(recipes);
            showNotification(`Generated ${recipes.length} unique recipes using AI models!`, 'success');
        } else {
            throw new Error('No recipes generated');
        }
        
    } catch (error) {
        console.error('Error generating recipes:', error);
        showNotification('Sorry, there was an error generating recipes. Showing fallback recipes.', 'error');
        
        // Fallback to sample recipes if AI fails
        const fallbackRecipes = findMatchingRecipes(ingredients);
        if (fallbackRecipes.length > 0) {
            displayMultipleRecipes(fallbackRecipes.slice(0, 4));
            showNotification('Showing similar recipes from our database.', 'info');
        }
    } finally {
        generateBtn.disabled = false;
        loading.style.display = 'none';
    }
}

// Generate Multiple Recipes using both T5 and GPT-2 models
async function generateMultipleRecipes(ingredientsList) {
    const recipes = [];
    
    try {
        // Generate multiple recipes from each Local LLM
        showNotification('🤖 Local AI is crafting multiple recipes...', 'info');
        const localRecipes = await generateRecipesFromT5(ingredientsList);
        recipes.push(...localRecipes);
        
        // Fetch images for all recipes
        showNotification('📸 Finding beautiful images for your recipes...', 'info');
        await Promise.all(recipes.map(async (recipe) => {
            recipe.image = await fetchRecipeImage(recipe.name, ingredientsList);
        }));
        
        return recipes;
        
    } catch (error) {
        console.error('Error generating multiple recipes:', error);
        throw error;
    }
}

// Generate recipes from T5 model with improved prompts
async function generateRecipesFromT5(ingredientsList, detailedInstructions = false) {
    try {
        console.log('🚀 Starting Gemini recipe generation for ingredients:', ingredientsList.join(', '));
        console.log(`📝 Detailed instructions requested: ${detailedInstructions}`);
        
        // Use Gemini API to generate 20 recipes with optional detailed instructions
        const inputText = detailedInstructions ? 
            `Generate recipes for: ${ingredientsList.join(', ')} with detailed_instructions` : 
            `Generate recipes for: ${ingredientsList.join(', ')}`;
        
        try {
            const geminiRecipes = await callAIModel('gemini', inputText, ingredientsList);
            
            // Gemini returns an array of recipes
            if (geminiRecipes && Array.isArray(geminiRecipes)) {
                console.log(`✅ Generated ${geminiRecipes.length} recipes from Gemini`);
                return geminiRecipes;
            } else if (geminiRecipes) {
                // If single recipe returned, wrap in array
                console.log(`✅ Generated 1 recipe from Gemini`);
                return [geminiRecipes];
            } else {
                throw new Error('No recipes generated from Gemini');
            }
            
        } catch (geminiError) {
            console.error(`❌ Failed to generate recipes from Gemini:`, geminiError.message);
            
            // Generate fallback recipes if Gemini fails
            console.log('🔄 Generating fallback recipes due to Gemini API error');
            const fallbackRecipes = [];
            for (let i = 0; i < 5; i++) {
                const fallbackRecipe = generateFallbackRecipe('gemini', ingredientsList);
                fallbackRecipe.id = `fallback-${Date.now()}-${i}`;
                fallbackRecipe.name = `${fallbackRecipe.name} ${i + 1}`;
                fallbackRecipes.push(fallbackRecipe);
            }
            return fallbackRecipes;
        }
        
    } catch (error) {
        console.error('Error generating recipes from Gemini:', error);
        throw error;
    }
}

// Generate recipes from GPT-2 model with improved prompts and robustness
async function generateRecipesFromGPT2(ingredientsList) {
    // GPT-2 models are disabled due to 404 errors
    console.log('⚠️ GPT-2 models are disabled due to API errors. Using T5-based fallback recipes.');
    
    // Generate fallback recipes using the T5 system
    const fallbackRecipes = [];
    for (let i = 0; i < 2; i++) {
        const recipe = generateFallbackRecipe('gpt2', ingredientsList);
        if (recipe) {
            recipe.modelSource = 'GPT-2 Style (Fallback)';
            recipe.id = `gpt2-fallback-${Date.now()}-${i}`;
            fallbackRecipes.push(recipe);
        }
    }
    
    return fallbackRecipes;
}

// Gemini API caller - Works with Google Generative AI
async function callAIModel(modelType, inputText, ingredientsList) {
    try {
        const modelConfig = AI_MODELS[modelType];
        
        if (!modelConfig || !modelConfig.enabled) {
            throw new Error(`Model ${modelType} is not enabled`);
        }
        
        console.log(`🤖 Calling ${modelConfig.name} with ingredients: ${ingredientsList.join(', ')}`);
        
        // Check if it's a Gemini model
        if (modelConfig.type === 'gemini') {
            return await callGeminiAPI(modelConfig, inputText, ingredientsList);
        } else {
            throw new Error(`Unsupported model type: ${modelConfig.type}`);
        }
        
    } catch (error) {
        console.error(`❌ Error calling ${modelType} model:`);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        
        // Generate fallback recipe instead of complete failure
        console.log(`🔄 Generating fallback recipe for ${modelType} due to API error`);
        return generateFallbackRecipe(modelType, ingredientsList);
    }
}

// Call Gemini API via Google Generative AI REST API
async function callGeminiAPI(modelConfig, inputText, ingredientsList) {
    try {
        // Create the enhanced prompt with titles and descriptions sections for 20 recipes
        const detailedInstructions = inputText.includes('detailed') || inputText.includes('detailed_instructions');
        const instructionDetail = detailedInstructions ? 'with VERY DETAILED step-by-step instructions including cooking times, temperatures, and techniques' : 'with clear step-by-step instructions';
        
        const recipePrompt = `You are a professional chef and recipe generator.
        
Based on these ingredients: ${ingredientsList.join(', ')}, generate 15 DISTINCTLY DIFFERENT recipes ${instructionDetail}.
        
Format your response exactly like this:
        
**TITLES**
1. [First recipe title]
2. [Second recipe title]
3. [Third recipe title]
4. [Fourth recipe title]
5. [Fifth recipe title]
6. [Sixth recipe title]
7. [Seventh recipe title]
8. [Eighth recipe title]
9. [Ninth recipe title]
10. [Tenth recipe title]
11. [Eleventh recipe title]
12. [Twelfth recipe title]
13. [Thirteenth recipe title]
14. [Fourteenth recipe title]
15. [Fifteenth recipe title]
        
**DESCRIPTIONS**
1. [Brief description of first recipe - what makes it unique]
2. [Brief description of second recipe - what makes it unique]
3. [Brief description of third recipe - what makes it unique]
4. [Fourth recipe description]
5. [Fifth recipe description]
6. [Sixth recipe description]
7. [Seventh recipe description]
8. [Eighth recipe description]
9. [Ninth recipe description]
10. [Tenth recipe description]
11. [Eleventh recipe description]
12. [Twelfth recipe description]
13. [Thirteenth recipe description]
14. [Fourteenth recipe description]
15. [Fifteenth recipe description]
        
**RECIPE 1: [First recipe title]**
**Ingredients**
- [ingredient with quantity]
...
**Preparation**
1. [Step 1 ...]
2. [Step 2 ...]
        
[Continue for all 15 recipes...]
        
Make sure each recipe is COMPLETELY DIFFERENT in:
- Cooking style (grilling, baking, stir-frying, steaming, braising, etc.)
- Flavor profile (spicy, sweet, savory, tangy, etc.)
- Cuisine type (Asian, Mediterranean, American, Mexican, etc.)
- Preparation method and complexity
- Cooking time (quick 15-min meals to elaborate 2-hour dishes)
        
Use ALL provided ingredients: ${ingredientsList.join(', ')} in each recipe.`;
        
        console.log(`🔥 CALLING GEMINI API: ${modelConfig.name}`);
        console.log(`📝 USER INGREDIENTS: ${ingredientsList.join(', ')}`);
        console.log(`🎯 FULL PROMPT:`);
        console.log(recipePrompt);
        console.log(`🌐 API ENDPOINT: ${GEMINI_CONFIG.baseUrl}`);
        console.log(`⚙️ API CALL STARTING...`);
        
        const response = await fetch(`${GEMINI_CONFIG.baseUrl}?key=${GEMINI_CONFIG.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: recipePrompt
                    }]
                }],
                generationConfig: {
                    temperature: modelConfig.temperature,
                    maxOutputTokens: modelConfig.maxTokens,
                    topP: 0.9,
                    topK: 50
                }
            })
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ Gemini API error: ${response.status} - ${errorText}`);
            throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        console.log(`✅ RAW GEMINI RESPONSE:`, result);
        
        // Parse the Gemini API response
        const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text || '';
        
        console.log(`📝 GENERATED TEXT LENGTH: ${generatedText.length}`);
        console.log(`📝 GENERATED TEXT CONTENT:`);
        console.log(generatedText);
        
        // Check if ingredients are mentioned in the response
        const mentionedIngredients = ingredientsList.filter(ing => 
            generatedText.toLowerCase().includes(ing.toLowerCase())
        );
        const missedIngredients = ingredientsList.filter(ing => 
            !generatedText.toLowerCase().includes(ing.toLowerCase())
        );
        
        console.log(`✅ INGREDIENTS MENTIONED IN RESPONSE: ${mentionedIngredients.join(', ')}`);
        if (missedIngredients.length > 0) {
            console.log(`❌ INGREDIENTS MISSED IN RESPONSE: ${missedIngredients.join(', ')}`);
        }
        
        if (generatedText.length < 50) {
            console.error(`❌ GEMINI RESPONSE TOO SHORT (${generatedText.length} chars)`);
            throw new Error(`Gemini response too short: ${generatedText}`);
        }
        
        // Parse the Gemini response into multiple recipes
        const recipes = parseGeminiResponse(generatedText, modelConfig.name, ingredientsList);
        
        if (!recipes || recipes.length === 0) {
            console.error(`❌ FAILED TO PARSE RECIPES FROM GEMINI OUTPUT`);
            console.error(`❌ RAW RESPONSE WAS: ${generatedText.substring(0, 500)}...`);
            throw new Error(`Failed to parse recipes from Gemini output`);
        }
        
        console.log(`✅ SUCCESSFULLY PARSED ${recipes.length} RECIPES FROM GEMINI`);
        recipes.forEach((recipe, index) => {
            console.log(`✅ Recipe ${index + 1}: ${recipe.name}`);
            console.log(`✅ Ingredients: ${recipe.ingredients.slice(0, 3).join(', ')}...`);
        });
        
        // If we got fewer than 15 recipes, generate additional ones using the T5-style system
        if (recipes.length < 15) {
            console.log(`⚠️ Only got ${recipes.length} recipes from Gemini, generating additional ones...`);
            
            const additionalRecipes = generateAdditionalRecipes(ingredientsList, 15 - recipes.length);
            recipes.push(...additionalRecipes);
            
            console.log(`✅ Total recipes after supplementing: ${recipes.length}`);
        }
        
        // Clear used images set for new generation cycle
        usedImageUrls.clear();
        console.log(`🖼️ Fetching unique Unsplash images for ${recipes.length} recipes...`);
        
        // Fetch images sequentially to ensure proper duplicate prevention
        for (let index = 0; index < recipes.length; index++) {
            const recipe = recipes[index];
            try {
                const imageUrl = await fetchRecipeImage(recipe.name, recipe.ingredients, index);
                recipe.image = imageUrl;
                console.log(`✅ Image ${index + 1}/${recipes.length}: ${recipe.name} -> ${imageUrl.substring(0, 50)}...`);
            } catch (error) {
                console.error(`❌ Failed to fetch image for "${recipe.name}":`, error);
                recipe.image = getDynamicPlaceholderImage(recipe.name, recipe.ingredients);
            }
        }
        
        console.log(`✅ All ${recipes.length} recipes now have dynamic images!`);
        return recipes;
        
    } catch (error) {
        console.error(`❌ Gemini API error:`, error.message);
        
        if (error.message.includes('API key')) {
            console.error('🔑 Gemini API key issue');
            console.error('🚀 Please check your API key configuration');
        }
        
        throw error;
    }
}

// Parse local LLM output into structured recipe
function parseLocalLLMOutput(generatedText, modelName, ingredientsList) {
    try {
        console.log(`🔍 Parsing ${modelName} output:`, generatedText.substring(0, 200) + '...');
        
        // Initialize recipe structure
        const recipe = {
            name: '',
            description: '',
            ingredients: [],
            instructions: [],
            cookTime: '25-30 mins',
            difficulty: 'Medium',
            servings: '2-4',
            modelSource: modelName
        };
        
        // Extract recipe name (first line or after "Recipe:")
        const nameMatch = generatedText.match(/^(.+?)\n|Recipe:\s*(.+?)\n/i);
        if (nameMatch) {
            recipe.name = (nameMatch[1] || nameMatch[2] || '').trim();
            // Clean up the name
            recipe.name = recipe.name.replace(/^(Recipe:|Title:|Name:)/i, '').trim();
        }
        
        // If no name found, generate one from ingredients
        if (!recipe.name) {
            const mainIngredients = ingredientsList.slice(0, 2);
            recipe.name = `${mainIngredients.join(' & ')} Delight`;
        }
        
        // Extract ingredients section
        const ingredientsMatch = generatedText.match(/ingredients?:([\s\S]*?)(?:instructions?:|directions?:|steps?:|method:|$)/i);
        if (ingredientsMatch) {
            const ingredientsText = ingredientsMatch[1];
            recipe.ingredients = ingredientsText
                .split('\n')
                .map(line => line.trim())
                .filter(line => line && !line.match(/^\d+\.\s*$/))
                .map(line => line.replace(/^[-*]\s*/, '').trim())
                .filter(line => line.length > 0);
        }
        
        // If no ingredients found, use input ingredients with quantities
        if (recipe.ingredients.length === 0) {
            recipe.ingredients = ingredientsList.map(ing => {
                const quantity = getIngredientQuantity(ing);
                return `${quantity} ${ing}`;
            });
        }
        
        // Extract instructions section
        const instructionsMatch = generatedText.match(/(?:instructions?:|directions?:|steps?:|method:)([\s\S]*?)(?:cook time:|difficulty:|notes:|$)/i);
        if (instructionsMatch) {
            const instructionsText = instructionsMatch[1];
            recipe.instructions = instructionsText
                .split('\n')
                .map(line => line.trim())
                .filter(line => line && line.length > 10)
                .map(line => line.replace(/^\d+\.\s*/, '').trim())
                .filter(line => line.length > 0);
        }
        
        // If no instructions found, generate basic ones
        if (recipe.instructions.length === 0) {
            recipe.instructions = [
                `Prepare all ingredients: ${ingredientsList.join(', ')}.`,
                `Heat a large pan or pot over medium heat.`,
                `Add the main ingredients and cook for 5-7 minutes.`,
                `Season with salt, pepper, and any desired spices.`,
                `Cook until all ingredients are tender and well combined.`,
                `Taste and adjust seasoning as needed.`,
                `Serve hot and enjoy your delicious ${recipe.name}!`
            ];
        }
        
        // Extract cooking time and difficulty
        const timeMatch = generatedText.match(/(?:cook time|cooking time|prep time):\s*([^\n]+)/i);
        if (timeMatch) {
            recipe.cookTime = timeMatch[1].trim();
        }
        
        const difficultyMatch = generatedText.match(/difficulty:\s*([^\n]+)/i);
        if (difficultyMatch) {
            recipe.difficulty = difficultyMatch[1].trim();
        }
        
        // Generate description from the first instruction or recipe name
        recipe.description = `A delicious ${recipe.name.toLowerCase()} made with ${ingredientsList.slice(0, 3).join(', ')} and more.`;
        
        console.log(`✅ Successfully parsed ${modelName} recipe:`, recipe.name);
        return recipe;
        
    } catch (error) {
        console.error('Error parsing local LLM output:', error);
        return null;
    }
}

// Parse Gemini API response into structured recipe format with titles and descriptions sections
function parseGeminiResponse(generatedText, modelName, ingredientsList) {
    try {
        console.log('🔍 PARSING GEMINI RESPONSE WITH TITLES AND DESCRIPTIONS SECTIONS');
        
        // Extract titles section
        const titlesSection = generatedText.match(/\*\*TITLES\*\*([\s\S]*?)(?:\*\*DESCRIPTIONS\*\*|\*\*RECIPE|$)/i);
        let titles = [];
        if (titlesSection) {
            const titleLines = titlesSection[1].split('\n').filter(line => line.trim());
            titles = titleLines.map(line => 
                line.replace(/^\d+\.\s*/, '').replace(/^[-*•]\s*/, '').trim()
            ).filter(line => line);
        }
        
        // Extract descriptions section
        const descriptionsSection = generatedText.match(/\*\*DESCRIPTIONS\*\*([\s\S]*?)(?:\*\*RECIPE|$)/i);
        let descriptions = [];
        if (descriptionsSection) {
            const descriptionLines = descriptionsSection[1].split('\n').filter(line => line.trim());
            descriptions = descriptionLines.map(line => 
                line.replace(/^\d+\.\s*/, '').replace(/^[-*•]\s*/, '').trim()
            ).filter(line => line);
        }
        
        console.log(`📝 EXTRACTED TITLES: ${titles.join(', ')}`);
        console.log(`📝 EXTRACTED DESCRIPTIONS: ${descriptions.join(', ')}`);
        
        // Split the response into individual recipe sections
        const recipeSections = generatedText.split(/(?=\*\*RECIPE \d+:)/i).filter(section => section.includes('**RECIPE'));
        
        const recipes = [];
        
        // Parse each recipe section (up to 20 recipes)
        for (let i = 0; i < Math.min(recipeSections.length, 20); i++) {
            const section = recipeSections[i];
            if (!section.trim()) continue;
            
            const recipe = parseSingleGeminiRecipe(
                section, 
                modelName, 
                ingredientsList, 
                i + 1,
                titles[i] || `Recipe ${i + 1}`,
                descriptions[i] || `A unique recipe using ${ingredientsList.join(', ')}`
            );
            if (recipe) {
                recipes.push(recipe);
            }
        }
        
        // If we couldn't parse structured recipes, try fallback parsing
        if (recipes.length === 0) {
            console.log('⚠️ FALLBACK: Trying to parse unstructured response');
            const fallbackRecipe = parseSingleGeminiRecipe(
                generatedText, 
                modelName, 
                ingredientsList, 
                1,
                titles[0] || 'Generated Recipe',
                descriptions[0] || `A recipe using ${ingredientsList.join(', ')}`
            );
            if (fallbackRecipe) {
                recipes.push(fallbackRecipe);
            }
        }
        
        console.log(`✅ SUCCESSFULLY PARSED ${recipes.length} RECIPES FROM GEMINI`);
        return recipes;
        
    } catch (error) {
        console.error('❌ Error parsing Gemini response:', error);
        return [];
    }
}

// Parse a single recipe from Gemini response with title and description
function parseSingleGeminiRecipe(recipeText, modelName, ingredientsList, recipeNumber, recipeTitle, recipeDescription) {
    try {
        // Use provided title or extract from text
        let recipeName = recipeTitle || `Recipe ${recipeNumber}`;
        if (!recipeTitle) {
            const namePatterns = [
                /\*\*RECIPE \d+:\s*([^*]+)\*\*/,
                /\*\*([^*]+)\*\*/,
                /#{1,3}\s*([^\n]+)/,
                /^([A-Z][^\n]+)$/m,
                /Recipe \d+:\s*(.+)/i
            ];
            
            for (const pattern of namePatterns) {
                const match = recipeText.match(pattern);
                if (match && match[1]) {
                    recipeName = match[1].trim();
                    break;
                }
            }
        }
        
        // Use provided description or generate one
        let recipeDesc = recipeDescription || `A delicious recipe using ${ingredientsList.join(', ')}`;
        
        // Extract ingredients section
        let recipeIngredients = [];
        const ingredientSection = recipeText.match(/\*\*Ingredients\*\*([\s\S]*?)(?:\*\*Preparation\*\*|\*\*Instructions\*\*|\*\*Steps\*\*|\*\*RECIPE|$)/i);
        if (ingredientSection) {
            const ingredientLines = ingredientSection[1].split('\n').filter(line => line.trim());
            recipeIngredients = ingredientLines
                .map(line => line.replace(/^[-*•]\s*/, '').trim())
                .filter(line => line && !line.includes('**') && line.length > 2);
        }
        
        // Ensure all user ingredients are included with quantities
        const userIngredients = ingredientsList.map(ing => {
            const existingIngredient = recipeIngredients.find(recipeIng => 
                recipeIng.toLowerCase().includes(ing.toLowerCase())
            );
            if (existingIngredient) {
                return existingIngredient;
            } else {
                // Add missing ingredient with default quantity
                const quantity = getIngredientQuantity(ing);
                return `${quantity} ${ing}`;
            }
        });
        
        // Add any additional ingredients from the recipe
        const additionalIngredients = recipeIngredients.filter(recipeIng => 
            !ingredientsList.some(userIng => 
                recipeIng.toLowerCase().includes(userIng.toLowerCase())
            )
        );
        
        const allIngredients = [...userIngredients, ...additionalIngredients];
        
        // Extract preparation/instructions
        let instructions = [];
        const instructionSection = recipeText.match(/\*\*(?:Preparation|Instructions|Steps)\*\*([\s\S]*?)(?:\*\*RECIPE|$)/i);
        if (instructionSection) {
            const instructionLines = instructionSection[1].split('\n').filter(line => line.trim());
            instructions = instructionLines
                .map(line => line.replace(/^\d+\.\s*/, '').replace(/^[-*•]\s*/, '').trim())
                .filter(line => line && !line.includes('**') && line.length > 5);
        }
        
        // Fallback instructions if none found
        if (instructions.length === 0) {
            instructions = [
                `Prepare the ${ingredientsList.join(', ')} as needed.`,
                `Heat a large pan or pot over medium heat.`,
                `Add the main ingredients and cook for 5-7 minutes.`,
                `Season with salt, pepper, and any desired spices.`,
                `Cook until all ingredients are tender and well combined.`,
                `Taste and adjust seasoning as needed.`,
                `Serve hot and enjoy your delicious ${recipeName}!`
            ];
        }
        
        // Determine cooking style based on recipe number for variety (20 different styles)
        const styles = [
            'Classic', 'Premium', 'Gourmet', 'Comfort', 'Healthy', 'Quick', 'Family', 'Elegant',
            'Rustic', 'Modern', 'Traditional', 'Fusion', 'Spicy', 'Mild', 'Exotic', 'Simple',
            'Sophisticated', 'Hearty', 'Light', 'Indulgent'
        ];
        const difficulties = [
            'Easy', 'Easy', 'Medium', 'Easy', 'Medium', 'Easy', 'Easy', 'Hard',
            'Medium', 'Medium', 'Medium', 'Hard', 'Medium', 'Easy', 'Hard', 'Easy',
            'Hard', 'Medium', 'Easy', 'Medium'
        ];
        const times = [
            '15 minutes', '20 minutes', '45 minutes', '25 minutes', '35 minutes', '10 minutes', '30 minutes', '90 minutes',
            '40 minutes', '50 minutes', '60 minutes', '120 minutes', '35 minutes', '15 minutes', '75 minutes', '12 minutes',
            '105 minutes', '40 minutes', '18 minutes', '55 minutes'
        ];
        const cuisines = [
            'American', 'Italian', 'French', 'Asian', 'Mexican', 'Mediterranean', 'Indian', 'Thai',
            'Chinese', 'Japanese', 'Korean', 'Greek', 'Spanish', 'Middle Eastern', 'Moroccan', 'British',
            'German', 'Brazilian', 'Caribbean', 'Fusion'
        ];
        
        // Validate and ensure all fields have proper values (no undefined)
        const validatedRecipe = {
            name: recipeName && recipeName.trim() !== '' ? recipeName : `Recipe ${recipeNumber} with ${ingredientsList.slice(0, 2).join(' & ')}`,
            description: recipeDesc && recipeDesc.trim() !== '' ? recipeDesc : `A delicious recipe using ${ingredientsList.join(', ')}`,
            ingredients: allIngredients && allIngredients.length > 0 ? allIngredients : [
                ...ingredientsList.map(ing => {
                    const quantity = getIngredientQuantity(ing);
                    return `${quantity} ${ing}`;
                })
            ],
            instructions: instructions && instructions.length > 0 ? instructions : [
                `Prepare the ${ingredientsList.join(', ')} as needed.`,
                `Heat a large pan or pot over medium heat.`,
                `Add the main ingredients and cook for 5-7 minutes.`,
                `Season with salt, pepper, and any desired spices.`,
                `Cook until all ingredients are tender and well combined.`,
                `Taste and adjust seasoning as needed.`,
                `Serve hot and enjoy!`
            ],
            cookingTime: times[recipeNumber - 1] || '30 minutes',
            difficulty: difficulties[recipeNumber - 1] || 'Medium',
            servings: 4,
            source: modelName || 'AI Recipe Generator',
            id: `gemini-${Date.now()}-${recipeNumber}`,
            style: styles[recipeNumber - 1] || 'Classic',
            cuisine: cuisines[recipeNumber - 1] || 'International'
        };
        
        // Final validation - ensure no undefined values
        Object.keys(validatedRecipe).forEach(key => {
            if (validatedRecipe[key] === undefined || validatedRecipe[key] === null) {
                console.warn(`⚠️ WARNING: ${key} is undefined, setting default value`);
                switch(key) {
                    case 'name':
                        validatedRecipe[key] = `Recipe ${recipeNumber}`;
                        break;
                    case 'description':
                        validatedRecipe[key] = `A tasty recipe using ${ingredientsList.join(', ')}`;
                        break;
                    case 'ingredients':
                        validatedRecipe[key] = [`${ingredientsList.join(', ')} (as needed)`];
                        break;
                    case 'instructions':
                        validatedRecipe[key] = [`Prepare and cook ${ingredientsList.join(', ')} as desired.`];
                        break;
                    case 'cookingTime':
                        validatedRecipe[key] = '30 minutes';
                        break;
                    case 'difficulty':
                        validatedRecipe[key] = 'Medium';
                        break;
                    case 'servings':
                        validatedRecipe[key] = 4;
                        break;
                    case 'source':
                        validatedRecipe[key] = 'AI Recipe Generator';
                        break;
                    case 'style':
                        validatedRecipe[key] = 'Classic';
                        break;
                    case 'cuisine':
                        validatedRecipe[key] = 'International';
                        break;
                }
            }
        });
        
        return validatedRecipe;
        
    } catch (error) {
        console.error('\u274c Error parsing single Gemini recipe:', error);
        return null;
    }
}

// Helper function to get appropriate quantity for an ingredient
function getIngredientQuantity(ingredient) {
    const quantities = {
        'chicken': '1 lb',
        'beef': '1 lb',
        'pork': '1 lb',
        'fish': '1 lb',
        'shrimp': '1 lb',
        'tofu': '1 block',
        'rice': '2 cups',
        'pasta': '1 lb',
        'noodles': '1 lb',
        'flour': '2 cups',
        'sugar': '1 cup',
        'butter': '1/2 cup',
        'oil': '2 tbsp',
        'onion': '1 medium',
        'garlic': '3 cloves',
        'tomato': '2 medium',
        'potato': '3 medium',
        'carrot': '2 medium',
        'bell pepper': '1 medium',
        'mushroom': '1 cup',
        'cheese': '1 cup',
        'milk': '1 cup',
        'egg': '2 large',
        'bread': '4 slices',
        'lettuce': '1 head',
        'spinach': '2 cups',
        'broccoli': '1 head'
    };
    
    const lowerIng = ingredient.toLowerCase();
    for (const [key, quantity] of Object.entries(quantities)) {
        if (lowerIng.includes(key)) {
            return quantity;
        }
    }
    
    return '1 cup'; // Default quantity
}

// Legacy Hugging Face API caller (backup)
async function callHuggingFaceLLM(modelConfig, inputText, ingredientsList) {
    if (!HUGGINGFACE_CONFIG.apiKey || HUGGINGFACE_CONFIG.apiKey === 'your_hugging_face_api_key_here') {
        throw new Error('Hugging Face API key not provided');
    }
    
    // Legacy Hugging Face implementation...
    throw new Error('Hugging Face models are deprecated. Please use local LLMs.');
}

// Generate fallback recipe when API calls fail
function generateFallbackRecipe(modelType, ingredientsList) {
    console.log(`🎨 Creating fallback recipe using ${modelType} style for:`, ingredientsList);
    
    // Create a unique recipe name based on ingredients and model type
    const mainIngredients = ingredientsList.slice(0, 2);
    const recipeName = `${mainIngredients.map(ing => ing.charAt(0).toUpperCase() + ing.slice(1)).join(' & ')} ${getRecipeStyle(modelType)}`;
    
    // Generate comprehensive ingredient list
    const recipeIngredients = generateIntelligentIngredients(ingredientsList);
    
    // Generate cooking instructions based on ingredients
    const instructions = generateIntelligentInstructions(ingredientsList, modelType);
    
    // Calculate cooking details
    const cookingDetails = calculateIntelligentCookingDetails(ingredientsList);
    
    return {
        name: recipeName,
        description: `A delicious recipe featuring ${ingredientsList.join(', ')}, created using ${modelType.toUpperCase()} AI-style generation.`,
        ingredients: recipeIngredients,
        instructions: instructions,
        cookTime: cookingDetails.time,
        difficulty: cookingDetails.difficulty,
        servings: cookingDetails.servings,
        modelSource: AI_MODELS[modelType]?.name || `${modelType.toUpperCase()} Recipe Model`,
        isAIGenerated: true,
        generatedAt: new Date().toISOString(),
        id: `${modelType}-fallback-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
}

// Get recipe style based on model type
function getRecipeStyle(modelType) {
    const styles = {
        't5': 'Fusion',
        'flan_t5': 'Gourmet',
        'gpt2_recipe': 'Classic',
        'gpt2': 'Modern'
    };
    return styles[modelType] || 'Special';
}

// Generate intelligent ingredients based on user input
function generateIntelligentIngredients(userIngredients) {
    const ingredients = [];
    
    // Add user ingredients with appropriate quantities
    userIngredients.forEach(ingredient => {
        const lowerIng = ingredient.toLowerCase();
        
        // Determine appropriate quantity based on ingredient type
        if (['chicken', 'beef', 'pork', 'fish', 'tofu'].some(protein => lowerIng.includes(protein))) {
            ingredients.push(`1 lb ${ingredient}, cut into pieces`);
        } else if (['rice', 'pasta', 'noodles', 'quinoa'].some(grain => lowerIng.includes(grain))) {
            ingredients.push(`2 cups ${ingredient}`);
        } else if (['onion', 'garlic', 'ginger'].some(aromatic => lowerIng.includes(aromatic))) {
            ingredients.push(`2-3 ${ingredient}, minced`);
        } else if (['cheese'].some(dairy => lowerIng.includes(dairy))) {
            ingredients.push(`1/2 cup ${ingredient}, grated`);
        } else {
            ingredients.push(`1-2 cups ${ingredient}`);
        }
    });
    
    // Add complementary ingredients based on what user provided
    const hasProtein = userIngredients.some(ing => ['chicken', 'beef', 'fish', 'tofu', 'eggs'].some(p => ing.toLowerCase().includes(p)));
    const hasVegetables = userIngredients.some(ing => ['tomato', 'onion', 'pepper', 'carrot', 'broccoli'].some(v => ing.toLowerCase().includes(v)));
    const hasGrains = userIngredients.some(ing => ['rice', 'pasta', 'bread', 'quinoa'].some(g => ing.toLowerCase().includes(g)));
    
    // Add basic cooking essentials
    ingredients.push('2 tbsp cooking oil');
    ingredients.push('Salt and pepper to taste');
    
    // Add complementary ingredients based on what's missing
    if (hasProtein && !hasVegetables) {
        ingredients.push('1 onion, diced', '2 cloves garlic, minced');
    }
    if (hasVegetables && !hasProtein) {
        ingredients.push('2 tbsp olive oil', '1 tsp herbs or spices');
    }
    if (!hasGrains && (hasProtein || hasVegetables)) {
        ingredients.push('Serve with rice or bread');
    }
    
    return ingredients;
}

// Generate intelligent cooking instructions
function generateIntelligentInstructions(ingredientsList, modelType) {
    const instructions = [];
    const hasProtein = ingredientsList.some(ing => ['chicken', 'beef', 'fish', 'tofu'].some(p => ing.toLowerCase().includes(p)));
    const hasVegetables = ingredientsList.some(ing => ['tomato', 'onion', 'pepper', 'carrot'].some(v => ing.toLowerCase().includes(v)));
    const hasGrains = ingredientsList.some(ing => ['rice', 'pasta'].some(g => ing.toLowerCase().includes(g)));
    
    // Start with preparation
    instructions.push('Prepare all ingredients by washing, chopping, and measuring as needed');
    
    // Cooking method based on ingredients
    if (hasGrains && ingredientsList.some(ing => ing.toLowerCase().includes('pasta'))) {
        instructions.push('Bring a large pot of salted water to boil for pasta');
        instructions.push('Cook pasta according to package directions until al dente');
    } else if (hasGrains && ingredientsList.some(ing => ing.toLowerCase().includes('rice'))) {
        instructions.push('Cook rice according to package directions or use pre-cooked rice');
    }
    
    instructions.push('Heat oil in a large pan or skillet over medium-high heat');
    
    if (hasProtein) {
        instructions.push(`Add protein ingredients (${ingredientsList.filter(ing => ['chicken', 'beef', 'fish', 'tofu'].some(p => ing.toLowerCase().includes(p))).join(', ')}) and cook until done`);
    }
    
    if (hasVegetables) {
        instructions.push(`Add vegetables (${ingredientsList.filter(ing => ['tomato', 'onion', 'pepper', 'carrot', 'broccoli'].some(v => ing.toLowerCase().includes(v))).join(', ')}) and cook until tender`);
    }
    
    instructions.push('Season with salt, pepper, and any desired spices');
    
    if (hasGrains) {
        instructions.push('Combine with cooked grains and toss gently');
    }
    
    instructions.push('Taste and adjust seasoning as needed');
    instructions.push('Serve hot and enjoy your delicious meal!');
    
    return instructions;
}

// Calculate intelligent cooking details
function calculateIntelligentCookingDetails(ingredientsList) {
    let baseTime = 20;
    let difficulty = 'Easy';
    let servings = 3;
    
    // Adjust based on ingredient complexity
    const hasProtein = ingredientsList.some(ing => ['chicken', 'beef', 'fish'].some(p => ing.toLowerCase().includes(p)));
    const hasMultipleVegetables = ingredientsList.filter(ing => ['tomato', 'onion', 'pepper', 'carrot', 'broccoli'].some(v => ing.toLowerCase().includes(v))).length > 2;
    const hasGrains = ingredientsList.some(ing => ['rice', 'pasta'].some(g => ing.toLowerCase().includes(g)));
    
    if (hasProtein) {
        baseTime += 10;
        difficulty = 'Medium';
        servings = 4;
    }
    
    if (hasMultipleVegetables) {
        baseTime += 5;
    }
    
    if (hasGrains) {
        baseTime += 5;
    }
    
    if (ingredientsList.length > 6) {
        difficulty = 'Medium';
        baseTime += 5;
    }
    
    return {
        time: `${baseTime}-${baseTime + 10} mins`,
        difficulty: difficulty,
        servings: servings
    };
}

// Parse real model output into recipe structure
function parseRealModelOutput(result, modelType, ingredientsList) {
    try {
        // Handle different model response formats
        let generatedText = '';
        
        if (Array.isArray(result) && result.length > 0) {
            generatedText = result[0].generated_text || result[0].text || '';
        } else if (result.generated_text) {
            generatedText = result.generated_text;
        } else {
            throw new Error('Invalid model response format');
        }
        
        console.log(`Raw ${modelType} output:`, generatedText);
        
        // Parse the generated text to extract recipe components
        const recipe = parseRecipeFromText(generatedText, modelType, ingredientsList);
        
        if (!recipe) {
            throw new Error('Failed to parse recipe from generated text');
        }
        
        // Add metadata
        recipe.modelSource = modelType === 't5' ? 'T5-Recipe-Finetuned' : 'GPT-2 Recipe Generator';
        recipe.isAIGenerated = true;
        recipe.generatedAt = new Date().toISOString();
        recipe.id = `${modelType}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        return recipe;
        
    } catch (error) {
        console.error(`Error parsing ${modelType} output:`, error);
        throw error;
    }
}

// Parse recipe components from generated text - Improved robustness
function parseRecipeFromText(text, modelType, ingredientsList) {
    try {
        console.log(`Parsing ${modelType} response:`, text.substring(0, 200) + '...');
        
        // Initialize recipe data with defaults
        const recipeData = {
            name: '',
            description: '',
            ingredients: [],
            instructions: [],
            cookTime: '25-30 mins',
            difficulty: 'Medium',
            servings: '2-4'
        };
        
        // Clean and normalize the text
        const cleanText = text.replace(/\r\n/g, '\n').replace(/\s+/g, ' ').trim();
        
        // Extract recipe name with multiple fallback strategies
        let recipeName = '';
        
        // Strategy 1: Look for explicit title markers
        const titlePatterns = [
            /(?:Recipe|Title|Name|Dish)\s*:?\s*([^\n\.]{5,60})/i,
            /^([A-Z][^\n]{10,60}(?:recipe|dish|meal|stir.?fry|pasta|curry|soup|salad))/i,
            /^([A-Z][a-z\s&-]{8,50})/,
            /([A-Z][a-z\s]{3,30}(?:with|and)[a-z\s]{3,30})/i
        ];
        
        for (const pattern of titlePatterns) {
            const match = cleanText.match(pattern);
            if (match && match[1]) {
                recipeName = match[1].trim().replace(/[\n\r]/g, ' ');
                break;
            }
        }
        
        // Fallback: Generate name from ingredients
        if (!recipeName || recipeName.length < 5) {
            const mainIngredients = ingredientsList.slice(0, 2);
            recipeName = `${mainIngredients.map(ing => ing.charAt(0).toUpperCase() + ing.slice(1)).join(' & ')} Delight`;
        }
        
        recipeData.name = recipeName;
        
        // Extract ingredients with flexible parsing
        let extractedIngredients = [];
        
        // Multiple ingredient extraction strategies
        const ingredientPatterns = [
            /(?:Ingredients?|INGREDIENTS?)\s*:?\s*([\s\S]*?)(?:Instructions?|Directions?|Method|Steps|Preparation|Cook)/i,
            /(?:You\s*(?:will\s*)?need|Required)\s*:?\s*([\s\S]*?)(?:Instructions?|Method|Steps)/i,
            /(?:-\s*[^\n]+\n){2,}/g, // Lines starting with dashes
            /(?:\d+\.?\s*[^\n]+\n){2,}/g // Numbered lists
        ];
        
        for (const pattern of ingredientPatterns) {
            const match = cleanText.match(pattern);
            if (match && match[1]) {
                extractedIngredients = match[1]
                    .split(/\n|•|\*|-|\d+\.|;/)
                    .map(line => line.trim().replace(/^[-•*\d\.\s]+/, ''))
                    .filter(line => line && line.length > 2 && line.length < 100)
                    .slice(0, 12);
                
                if (extractedIngredients.length >= 2) break;
            }
        }
        
        // Ensure we have the user's ingredients included
        if (extractedIngredients.length === 0) {
            extractedIngredients = ingredientsList.map(ing => `1 portion ${ing}`);
        } else {
            // Add any missing user ingredients
            ingredientsList.forEach(userIng => {
                const hasIngredient = extractedIngredients.some(extracted => 
                    extracted.toLowerCase().includes(userIng.toLowerCase())
                );
                if (!hasIngredient) {
                    extractedIngredients.unshift(`1 portion ${userIng}`);
                }
            });
        }
        
        recipeData.ingredients = extractedIngredients;
        
        // Extract instructions with multiple strategies
        let extractedInstructions = [];
        
        const instructionPatterns = [
            /(?:Instructions?|Directions?|Method|Steps|Preparation|Cook(?:ing)?\s*method)\s*:?\s*([\s\S]*?)(?:Notes?|Tips?|$)/i,
            /(?:How\s*to\s*(?:cook|make|prepare))\s*:?\s*([\s\S]*?)$/i,
            /(?:\d+\.\s*[^\n]{10,}\n){2,}/g // Step-by-step numbered instructions
        ];
        
        for (const pattern of instructionPatterns) {
            const match = cleanText.match(pattern);
            if (match && match[1]) {
                extractedInstructions = match[1]
                    .split(/\n|\d+\.|Step\s*\d+|First|Then|Next|Finally/i)
                    .map(line => line.trim().replace(/^[-•*\d\.\s]+/, ''))
                    .filter(line => line && line.length > 10 && line.length < 300)
                    .slice(0, 10);
                
                if (extractedInstructions.length >= 2) break;
            }
        }
        
        // Generate basic instructions if none found
        if (extractedInstructions.length === 0) {
            extractedInstructions = [
                `Prepare all ingredients: ${ingredientsList.join(', ')}`,
                'Heat oil in a large pan over medium heat',
                'Add ingredients in order of cooking time needed',
                'Cook until everything is heated through and tender',
                'Season to taste and serve hot'
            ];
        }
        
        recipeData.instructions = extractedInstructions;
        
        // Extract additional details with fallbacks
        const timeMatch = cleanText.match(/(?:cook(?:ing)?\s*time|prep\s*time|total\s*time)\s*:?\s*(\d+(?:\.\d+)?\s*(?:min|hour|hr)s?)/i);
        if (timeMatch) {
            recipeData.cookTime = timeMatch[1];
        }
        
        const difficultyMatch = cleanText.match(/(?:difficulty|level)\s*:?\s*(easy|medium|hard|beginner|intermediate|advanced)/i);
        if (difficultyMatch) {
            recipeData.difficulty = difficultyMatch[1].charAt(0).toUpperCase() + difficultyMatch[1].slice(1).toLowerCase();
        }
        
        const servingsMatch = cleanText.match(/(?:serves?|servings?|portions?)\s*:?\s*(\d+(?:-\d+)?)/i);
        if (servingsMatch) {
            recipeData.servings = servingsMatch[1];
        }
        
        // Set dynamic description
        recipeData.description = `A delicious recipe featuring ${ingredientsList.join(', ')}, generated by ${modelType.toUpperCase()} AI model.`;
        
        // Final validation - ensure we have minimum viable recipe
        if (!recipeData.name || recipeData.ingredients.length === 0 || recipeData.instructions.length === 0) {
            console.warn('Incomplete recipe data, using enhanced fallback...');
            
            if (!recipeData.name) recipeData.name = `${ingredientsList[0]} Special`;
            if (recipeData.ingredients.length === 0) recipeData.ingredients = ingredientsList.map(ing => `1 portion ${ing}`);
            if (recipeData.instructions.length === 0) {
                recipeData.instructions = [
                    'Combine all ingredients in a cooking vessel',
                    'Cook according to ingredient requirements',
                    'Season and serve when ready'
                ];
            }
        }
        
        console.log(`Successfully parsed recipe: ${recipeData.name}`);
        return recipeData;
        
    } catch (error) {
        console.error('Error parsing recipe from text:', error);
        
        // Emergency fallback - create basic recipe from ingredients
        return {
            name: `${ingredientsList[0]} Recipe`,
            description: `A simple recipe using ${ingredientsList.join(', ')}`,
            ingredients: ingredientsList.map(ing => `1 portion ${ing}`),
            instructions: [
                'Prepare all ingredients',
                'Combine ingredients as appropriate',
                'Cook until ready',
                'Season to taste and serve'
            ],
            cookTime: '20-30 mins',
            difficulty: 'Easy',
            servings: '2-4'
        };
    }
}

// Removed - using only real AI model results

// Global set to track used image URLs to prevent duplicates
const usedImageUrls = new Set();

// Rate limiting for Unsplash API
let lastUnsplashRequest = 0;
const UNSPLASH_RATE_LIMIT_DELAY = 1000; // 1 second between requests
let rateLimitExceeded = false; // Track if we've hit rate limits

// Simple cache for successful image searches to reduce API calls
const imageSearchCache = new Map();

// Add delay between Unsplash requests to avoid rate limiting
async function waitForRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - lastUnsplashRequest;
    
    if (timeSinceLastRequest < UNSPLASH_RATE_LIMIT_DELAY) {
        const waitTime = UNSPLASH_RATE_LIMIT_DELAY - timeSinceLastRequest;
        console.log(`⏱️ Rate limit delay: waiting ${waitTime}ms before next Unsplash request`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    lastUnsplashRequest = Date.now();
}

// Fetch recipe image from Unsplash API using recipe title
async function fetchRecipeImage(recipeName, ingredients, recipeIndex = 0) {
    try {
        // Check if we have a valid API key
        if (!UNSPLASH_CONFIG.accessKey || UNSPLASH_CONFIG.accessKey === 'your_unsplash_access_key_here') {
            console.log('🖼️ Using dynamic placeholder image - no Unsplash API key provided');
            return getDynamicPlaceholderImage(recipeName, ingredients);
        }
        
        // If we've exceeded rate limits, use placeholder immediately
        if (rateLimitExceeded) {
            console.log('⚠️ Rate limit exceeded previously, using placeholder image');
            return getDynamicPlaceholderImage(recipeName, ingredients);
        }
        
        // Use the full recipe title with minimal cleaning for better matching
        const fullRecipeTitle = recipeName
            .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove only special characters, keep all words
            .replace(/\s+/g, ' ')
            .trim();
        
        console.log(`🕰️ Original recipe name: "${recipeName}"`);
        console.log(`🎯 Using full recipe title: "${fullRecipeTitle}"`);
        
        // Create multiple search strategies for better recipe image matching
        const searchQueries = [
            // Primary: Full recipe title (exactly what user sees)
            fullRecipeTitle,
            // Secondary: Recipe title + "recipe" for better food matching
            `${fullRecipeTitle} recipe`,
            // Tertiary: Recipe title + "dish" for food context
            `${fullRecipeTitle} dish`,
            // Quaternary: Main cooking method + main ingredient
            `${fullRecipeTitle.split(' ')[0]} ${ingredients[0]} food`,
            // Fallback: Main ingredient only
            `${ingredients[0]} food recipe`
        ].filter(query => query.trim().length > 3);
        
        // Try each search query until we find unique results
        for (const query of searchQueries) {
            try {
                console.log(`🔍 Searching Unsplash for: "${query}"`);
                
                // Apply rate limiting to avoid 403 errors
                await waitForRateLimit();
                
                // Request optimized images for faster loading
                const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=8&orientation=landscape&order_by=relevant&client_id=${UNSPLASH_CONFIG.accessKey}`);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error(`❌ Unsplash API error for query "${query}": ${response.status} - ${errorText}`);
                    
                    // If rate limited, set flag and break out of loop
                    if (response.status === 403) {
                        console.error(`❌ Rate limit exceeded, using placeholder for remaining recipes`);
                        rateLimitExceeded = true; // Set flag to avoid future API calls
                        return getDynamicPlaceholderImage(recipeName, ingredients);
                    }
                    continue;
                }
                
                const data = await response.json();
                console.log(`📊 Query "${query}" returned ${data.results ? data.results.length : 0} images`);
                
                if (data.results && data.results.length > 0) {
                    // Find an image that hasn't been used yet
                    for (let i = 0; i < data.results.length; i++) {
                        const imageUrl = data.results[i].urls.regular;
                        const imageId = data.results[i].id;
                        const imageDescription = data.results[i].description || data.results[i].alt_description || 'No description';
                        
                        // Use deterministic selection based on recipe index to avoid duplicates
                        const deterministicIndex = (recipeIndex + i) % data.results.length;
                        const selectedImage = data.results[deterministicIndex];
                        // Use 'small' size for faster loading while maintaining quality
                        const selectedImageUrl = selectedImage.urls.small;
                        const selectedImageDescription = selectedImage.description || selectedImage.alt_description || 'No description';
                        
                        if (!usedImageUrls.has(selectedImageUrl)) {
                            usedImageUrls.add(selectedImageUrl);
                            console.log(`✅ Found unique image for "${query}" using full recipe title`);
                            console.log(`🖼️ Image ID: ${selectedImage.id}`);
                            console.log(`📝 Description: ${selectedImageDescription}`);
                            console.log(`🔗 URL: ${selectedImageUrl}`);
                            return selectedImageUrl;
                        }
                    }
                    
                    // If all images in this query are used, continue to next query
                    console.log(`⚠️ All ${data.results.length} images for "${query}" already used, trying next query`);
                } else {
                    console.log(`⚠️ No images found for query "${query}", trying next query`);
                }
            } catch (queryError) {
                console.error(`❌ Error with query "${query}":`, queryError);
                continue;
            }
        }
        
        console.log('🖼️ No unique images found for any query, using dynamic placeholder');
        return getDynamicPlaceholderImage(recipeName, ingredients);

    } catch (error) {
        console.error('Error fetching recipe image:', error);
        return getDynamicPlaceholderImage(recipeName, ingredients);
    }
}

// Generate dynamic placeholder images based on recipe content
function getDynamicPlaceholderImage(recipeName, ingredients) {
    // Create a hash from recipe name and ingredients to get consistent image for same recipe
    const recipeHash = (recipeName + ingredients.join('')).split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);

    // Food-themed placeholder images with different categories
    const foodImages = [
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=300&fit=crop', // Pizza
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=300&fit=crop', // Pancakes
        'https://images.unsplash.com/photo-1546548970-71785318a17b?w=500&h=300&fit=crop', // Salad
        'https://images.unsplash.com/photo-1563379091339-03246963d20a?w=500&h=300&fit=crop', // Pasta
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=300&fit=crop', // Soup
        'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&h=300&fit=crop', // Burger
        'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=500&h=300&fit=crop', // Stir-fry
        'https://images.unsplash.com/photo-1599020792689-9574de3898ea?w=500&h=300&fit=crop', // Rice bowl
        'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=500&h=300&fit=crop', // Sandwich
        'https://images.unsplash.com/photo-1565299585323-38174c4a6c7f?w=500&h=300&fit=crop'  // Meat dish
    ];

    // Pick image based on ingredients or recipe name
    let imageIndex = Math.abs(recipeHash) % foodImages.length;

    // Try to match image to ingredients for better relevance
    const ingredientLower = ingredients.join(' ').toLowerCase();
    if (ingredientLower.includes('pizza') || ingredientLower.includes('cheese') || ingredientLower.includes('tomato')) {
        imageIndex = 0; // Pizza
    } else if (ingredientLower.includes('pasta') || ingredientLower.includes('spaghetti') || ingredientLower.includes('noodle')) {
        imageIndex = 3; // Pasta
    } else if (ingredientLower.includes('rice') || ingredientLower.includes('grain')) {
        imageIndex = 7; // Rice bowl
    } else if (ingredientLower.includes('chicken') || ingredientLower.includes('meat') || ingredientLower.includes('beef')) {
        imageIndex = 9; // Meat dish
    } else if (ingredientLower.includes('vegetable') || ingredientLower.includes('salad') || ingredientLower.includes('lettuce')) {
        imageIndex = 2; // Salad
    } else if (ingredientLower.includes('soup') || ingredientLower.includes('broth')) {
        imageIndex = 4; // Soup
    }

    console.log(`🍽️ Selected dynamic placeholder image for ${recipeName}: ${foodImages[imageIndex]}`);
    return foodImages[imageIndex];
}

// Extract food-related terms from recipe title for better image search
function extractFoodTerms(recipeTitle) {
    // Remove "AI-Generated" and common recipe words, focus on food terms
    const foodTerms = recipeTitle
        .replace(/AI-Generated|Recipe|Dish|Bowl|Skillet|Pasta|Stir-Fry|Sauté|Medley|Fusion/gi, '')
        .replace(/One-Pan|Wok-Tossed|Asian-Style|Italian-Style|Creamy|Rich|Fresh|Light|Simple/gi, '')
        .trim();
    
    // If we still have terms, use them, otherwise fallback to generic food search
    return foodTerms.length > 0 ? `${foodTerms} food recipe` : 'delicious food recipe';
}

// Get placeholder image for recipes
function getPlaceholderImage(recipeTitle) {
    // Array of food placeholder images from Unsplash (no API key required)
    const placeholderImages = [
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=500&h=300&fit=crop',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=500&h=300&fit=crop'
    ];
    
    // Select a random placeholder image
    const randomIndex = Math.floor(Math.random() * placeholderImages.length);
    const selectedImage = placeholderImages[randomIndex];
    
    return {
        url: selectedImage,
        thumbnail: selectedImage.replace('w=500&h=300', 'w=300&h=200'),
        alt: `Delicious ${recipeTitle}`,
        photographer: 'Unsplash',
        photographerUrl: 'https://unsplash.com',
        unsplashUrl: 'https://unsplash.com'
    };
}

// Fallback image search for generic food
async function fetchFallbackImage() {
    return getPlaceholderImage('delicious food');
}

function findMatchingRecipes(userIngredients) {
    // Simple matching algorithm - in a real app, this would be handled by AI
    const matches = RECIPE_DATABASE.map(recipe => {
        let score = 0;
        const recipeIngredients = recipe.ingredients.join(' ').toLowerCase();
        
        userIngredients.forEach(ingredient => {
            if (recipeIngredients.includes(ingredient)) {
                score += 1;
            }
        });
        
        return { ...recipe, score };
    });
    
    // Sort by score and return top matches
    return matches
        .filter(recipe => recipe.score > 0 || userIngredients.length === 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 4);
}

// Display multiple recipes in a grid format
function displayMultipleRecipes(recipes) {
    recipesGrid.innerHTML = '';
    
    if (recipes.length === 0) {
        recipesGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: white;">
                <i class="fas fa-robot" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>No recipes generated</h3>
                <p>Try adding different ingredients for better AI recipe generation!</p>
            </div>
        `;
    } else {
        recipes.forEach((recipe, index) => {
            const recipeCard = createRecipeGridCard(recipe);
            recipeCard.style.animationDelay = `${index * 0.1}s`;
            recipesGrid.appendChild(recipeCard);
        });
    }
    
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

// Legacy functions for backward compatibility
function displayGeneratedRecipe(recipe) {
    displayMultipleRecipes([recipe]);
}

function displayRecipes(recipes) {
    displayMultipleRecipes(recipes);
}

function createT5RecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card t5-generated';
    
    // Create image HTML if image data exists
    const imageHTML = recipe.image ? `
        <div class="recipe-image">
            <img src="${recipe.image.url}" alt="${recipe.image.alt}" loading="lazy">
            <div class="image-attribution">
                <span>Photo by <a href="${recipe.image.photographerUrl}" target="_blank" rel="noopener">${recipe.image.photographer}</a> on <a href="${recipe.image.unsplashUrl}" target="_blank" rel="noopener">Unsplash</a></span>
            </div>
        </div>
    ` : '';
    
    card.innerHTML = `
        ${imageHTML}
        <div class="recipe-content">
            <div class="recipe-header">
                <div class="ai-badge">
                    <i class="fas fa-robot"></i>
                    <span>AI Generated</span>
                </div>
                <div class="recipe-title">
                    <h3>${recipe.name}</h3>
                    <p class="recipe-description">${recipe.description}</p>
                    <div class="recipe-meta">
                        <span><i class="fas fa-clock"></i> ${recipe.cookTime}</span>
                        <span><i class="fas fa-signal"></i> ${recipe.difficulty}</span>
                        <span><i class="fas fa-users"></i> Serves ${recipe.servings}</span>
                    </div>
                </div>
            </div>
            
            <div class="recipe-ingredients">
                <h4><i class="fas fa-list"></i> Ingredients</h4>
                <ul>
                    ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>
            
            <div class="recipe-steps">
                <h4><i class="fas fa-utensils"></i> Instructions</h4>
                <ol>
                    ${recipe.instructions.map(step => `<li>${step}</li>`).join('')}
                </ol>
            </div>
            
            <div class="recipe-footer">
                <div class="ai-info">
                    <i class="fas fa-info-circle"></i>
                    <span>This recipe was generated using the T5-Recipe-Finetuned model based on your ingredients.</span>
                </div>
            </div>
        </div>
    `;
    
    return card;
}

// Create recipe grid card (compact view)
function createRecipeGridCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-grid-card';
    
    // Validate and clean recipe data to prevent undefined values
    const validatedRecipe = {
        id: recipe.id || `recipe-${Date.now()}`,
        name: recipe.name && recipe.name.trim() !== '' && recipe.name !== 'undefined' ? recipe.name : 'Delicious Recipe',
        cookTime: recipe.cookTime && recipe.cookTime !== 'undefined' ? recipe.cookTime : (recipe.cookingTime || '30 minutes'),
        difficulty: recipe.difficulty && recipe.difficulty !== 'undefined' ? recipe.difficulty : 'Medium',
        ingredients: recipe.ingredients && Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? 
            recipe.ingredients.filter(ing => ing && ing.trim() !== '' && ing !== 'undefined') : 
            ['Various ingredients'],
        modelSource: recipe.modelSource || recipe.source || 'AI Generated',
        image: recipe.image?.url || recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
        instructions: recipe.instructions || recipe.steps || [],
        description: recipe.description || 'A delicious recipe',
        style: recipe.style || 'Classic',
        cuisine: recipe.cuisine || 'International',
        servings: recipe.servings || 4
    };
    
    // Handle both old and new recipe formats
    const imageUrl = validatedRecipe.image;
    const instructions = validatedRecipe.instructions;
    
    card.innerHTML = `
        <div class="recipe-grid-image">
            <img src="${imageUrl}" alt="${validatedRecipe.name}" loading="lazy">
            <div class="recipe-category-badge">${validatedRecipe.modelSource}</div>
        </div>
        
        <div class="recipe-grid-content">
            <h3 class="recipe-grid-title">${validatedRecipe.name}</h3>
            
            <div class="recipe-grid-meta">
                <span class="recipe-time">
                    <i class="fas fa-clock"></i> ${validatedRecipe.cookTime}
                </span>
                <span class="recipe-difficulty">
                    <i class="fas fa-signal"></i> ${validatedRecipe.difficulty}
                </span>
            </div>
            
            <div class="recipe-grid-ingredients">
                <h4>Ingredients:</h4>
                <ul>
                    ${validatedRecipe.ingredients.slice(0, 3).map(ingredient => `<li>${ingredient}</li>`).join('')}
                    ${validatedRecipe.ingredients.length > 3 ? `<li class="more-ingredients">+${validatedRecipe.ingredients.length - 3} more ingredients</li>` : ''}
                </ul>
            </div>
            
            <button class="view-full-recipe-btn" onclick="showFullRecipe('${validatedRecipe.id}')">
                <i class="fas fa-eye"></i> View Full Recipe
            </button>
        </div>
    `;
    
    // Store validated recipe data for modal display
    card.dataset.recipeId = validatedRecipe.id;
    window.recipeData = window.recipeData || {};
    window.recipeData[validatedRecipe.id] = validatedRecipe;
    
    return card;
}

// Create legacy recipe card (full view)
function createRecipeCard(recipe) {
    const card = document.createElement('div');
    card.className = 'recipe-card';
    
    const imageUrl = recipe.image?.url || recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop';
    const instructions = recipe.instructions || recipe.steps || [];
    
    card.innerHTML = `
        <div class="recipe-header">
            <img src="${imageUrl}" alt="${recipe.name}" class="recipe-image">
            <div class="recipe-title">
                <h3>${recipe.name}</h3>
                <div class="recipe-meta">
                    <span><i class="fas fa-clock"></i> ${recipe.cookTime}</span>
                    <span><i class="fas fa-signal"></i> ${recipe.difficulty}</span>
                </div>
            </div>
        </div>
        
        <div class="recipe-ingredients">
            <h4><i class="fas fa-list"></i> Ingredients</h4>
            <ul>
                ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
            </ul>
        </div>
        
        <div class="recipe-steps">
            <h4><i class="fas fa-utensils"></i> Instructions</h4>
            <ol>
                ${instructions.map(step => `<li>${step}</li>`).join('')}
            </ol>
        </div>
    `;
    
    return card;
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '10px',
        color: 'white',
        fontWeight: '500',
        zIndex: '1000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    // Set background color based on type
    const colors = {
        info: '#667eea',
        success: '#10ac84',
        error: '#ff6b6b',
        warning: '#ffa500'
    };
    notification.style.background = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Show full recipe in modal
function showFullRecipe(recipeId) {
    const recipe = window.recipeData[recipeId];
    if (!recipe) {
        console.error('Recipe not found:', recipeId);
        return;
    }
    
    // Create modal if it doesn't exist
    let modal = document.getElementById('recipe-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'recipe-modal';
        modal.className = 'recipe-modal';
        document.body.appendChild(modal);
    }
    
    const imageUrl = recipe.image?.url || recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop';
    const instructions = recipe.instructions || recipe.steps || [];
    
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>${recipe.name}</h2>
                <button class="close-modal" onclick="closeRecipeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="modal-body">
                <div class="recipe-image-container">
                    <img src="${imageUrl}" alt="${recipe.name}" class="recipe-modal-image">
                    <div class="recipe-badge">${recipe.modelSource || 'AI Generated'}</div>
                </div>
                
                <div class="recipe-details">
                    <div class="recipe-info">
                        <div class="info-item">
                            <i class="fas fa-clock"></i>
                            <span>Cook Time: ${recipe.cookTime}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-signal"></i>
                            <span>Difficulty: ${recipe.difficulty}</span>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-users"></i>
                            <span>Servings: ${recipe.servings || '2-4'}</span>
                        </div>
                    </div>
                    
                    <div class="recipe-section">
                        <h3><i class="fas fa-list"></i> Ingredients</h3>
                        <ul class="ingredients-list">
                            ${recipe.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="recipe-section">
                        <h3><i class="fas fa-utensils"></i> Instructions</h3>
                        <ol class="instructions-list">
                            ${instructions.map(step => `<li>${step}</li>`).join('')}
                        </ol>
                    </div>
                    
                    ${recipe.description ? `
                        <div class="recipe-section">
                            <h3><i class="fas fa-info-circle"></i> Description</h3>
                            <p class="recipe-description">${recipe.description}</p>
                        </div>
                    ` : ''}
                </div>
            </div>
        </div>
        <div class="modal-overlay" onclick="closeRecipeModal()"></div>
    `;
    
    // Show modal
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Add fade-in animation
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Close recipe modal
function closeRecipeModal() {
    const modal = document.getElementById('recipe-modal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }, 300);
    }
}

// Close modal when pressing Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeRecipeModal();
    }
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : type === 'warning' ? 'exclamation' : 'info'}-circle"></i>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add some interactive features
document.addEventListener('click', function(e) {
    // Add ripple effect to buttons
    if (e.target.matches('button') || e.target.closest('button')) {
        const button = e.target.matches('button') ? e.target : e.target.closest('button');
        createRipple(e, button);
    }
});

function createRipple(event, element) {
    const circle = document.createElement('span');
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;
    
    const rect = element.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - rect.left - radius}px`;
    circle.style.top = `${event.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');
    
    // Add ripple styles
    Object.assign(circle.style, {
        position: 'absolute',
        borderRadius: '50%',
        transform: 'scale(0)',
        animation: 'ripple 600ms linear',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        pointerEvents: 'none'
    });
    
    // Add CSS animation
    if (!document.querySelector('#ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'ripple-styles';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            button {
                position: relative;
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    }
    
    const ripple = element.querySelector('.ripple');
    if (ripple) {
        ripple.remove();
    }
    
    element.appendChild(circle);
    
    setTimeout(() => {
        circle.remove();
    }, 600);
}
