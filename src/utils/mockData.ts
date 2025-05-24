
export interface Ingredient {
  id: string;
  name: string;
  image?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export type DietaryPreference = 'vegan' | 'vegetarian' | 'gluten-free' | 'dairy-free' | 'nut-free' | 'all';

export interface Recipe {
  id: string;
  title: string;
  image: string;
  ingredients: Ingredient[];
  instructions: string[];
  nutritionInfo: NutritionInfo;
  dietaryPreferences: DietaryPreference[];
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  likes: number;
  dislikes: number;
}

export const ingredients: Ingredient[] = [
  { id: '1', name: 'Tomato', image: 'https://images.unsplash.com/photo-1561136594-7f68413baa99?w=800&auto=format&fit=crop' },
  { id: '2', name: 'Onion', image: 'https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?w=800&auto=format&fit=crop' },
  { id: '3', name: 'Garlic', image: 'https://images.unsplash.com/photo-1615477550927-6451674decad?w=800&auto=format&fit=crop' },
  { id: '4', name: 'Chicken Breast', image: 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&auto=format&fit=crop' },
  { id: '5', name: 'Rice', image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&auto=format&fit=crop' },
  { id: '6', name: 'Pasta', image: 'https://images.unsplash.com/photo-1551462147-37885acc36f1?w=800&auto=format&fit=crop' },
  { id: '7', name: 'Bell Pepper', image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800&auto=format&fit=crop' },
  { id: '8', name: 'Carrot', image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&auto=format&fit=crop' },
  { id: '9', name: 'Broccoli', image: 'https://images.unsplash.com/photo-1583687355032-89b902b7a8fa?w=800&auto=format&fit=crop' },
  { id: '10', name: 'Cheese', image: 'https://images.unsplash.com/photo-1634467524884-5d0ae8898f5e?w=800&auto=format&fit=crop' },
  { id: '11', name: 'Eggs', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800&auto=format&fit=crop' },
  { id: '12', name: 'Butter', image: 'https://images.unsplash.com/photo-1589985270826-4e7fdb9a58b4?w=800&auto=format&fit=crop' },
  { id: '13', name: 'Olive Oil', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&auto=format&fit=crop' },
  { id: '14', name: 'Salt', image: 'https://images.unsplash.com/photo-1518110925495-5fe2fda0442a?w=800&auto=format&fit=crop' },
  { id: '15', name: 'Pepper', image: 'https://images.unsplash.com/photo-1599900554895-5e0fc7aeec92?w=800&auto=format&fit=crop' },
  { id: '16', name: 'Potato', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=800&auto=format&fit=crop' },
  { id: '17', name: 'Lemon', image: 'https://images.unsplash.com/photo-1582476631937-2bc8c2433c0f?w=800&auto=format&fit=crop' },
  { id: '18', name: 'Mushroom', image: 'https://images.unsplash.com/photo-1589948100953-9ae14b9cd9ad?w=800&auto=format&fit=crop' },
  { id: '19', name: 'Beef', image: 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=800&auto=format&fit=crop' },
  { id: '20', name: 'Spinach', image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&auto=format&fit=crop' },
];

export const recipes: Recipe[] = [
  {
    id: '1',
    title: 'Simple Tomato Pasta',
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800&auto=format&fit=crop',
    ingredients: [
      ingredients[0], // Tomato
      ingredients[2], // Garlic
      ingredients[5], // Pasta
      ingredients[12], // Olive Oil
      ingredients[13], // Salt
      ingredients[14], // Pepper
    ],
    instructions: [
      'Boil pasta according to package instructions.',
      'Heat olive oil in a pan and add minced garlic.',
      'Add chopped tomatoes and cook for 5 minutes.',
      'Season with salt and pepper.',
      'Mix with drained pasta and serve.',
    ],
    nutritionInfo: {
      calories: 350,
      protein: 12,
      carbs: 65,
      fat: 8,
      fiber: 4,
    },
    dietaryPreferences: ['vegetarian', 'dairy-free', 'nut-free'],
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    likes: 42,
    dislikes: 3,
  },
  {
    id: '2',
    title: 'Chicken Stir Fry',
    image: 'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=800&auto=format&fit=crop',
    ingredients: [
      ingredients[3], // Chicken Breast
      ingredients[1], // Onion
      ingredients[6], // Bell Pepper
      ingredients[7], // Carrot
      ingredients[8], // Broccoli
      ingredients[2], // Garlic
      ingredients[12], // Olive Oil
      ingredients[13], // Salt
      ingredients[14], // Pepper
      ingredients[4], // Rice
    ],
    instructions: [
      'Cut chicken breast into small pieces.',
      'Slice onion, bell pepper, and carrot.',
      'Heat olive oil in a pan and add minced garlic.',
      'Add chicken and cook until no longer pink.',
      'Add vegetables and stir fry for 5-7 minutes.',
      'Season with salt and pepper.',
      'Serve over cooked rice.',
    ],
    nutritionInfo: {
      calories: 420,
      protein: 35,
      carbs: 40,
      fat: 12,
      fiber: 6,
    },
    dietaryPreferences: ['dairy-free', 'nut-free', 'gluten-free'],
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    likes: 78,
    dislikes: 5,
  },
  {
    id: '3',
    title: 'Vegetable Omelette',
    image: 'https://images.unsplash.com/photo-1565177631132-62ccc5639a27?w=800&auto=format&fit=crop',
    ingredients: [
      ingredients[10], // Eggs
      ingredients[1], // Onion
      ingredients[6], // Bell Pepper
      ingredients[7], // Carrot
      ingredients[9], // Cheese
      ingredients[12], // Olive Oil
      ingredients[13], // Salt
      ingredients[14], // Pepper
    ],
    instructions: [
      'Beat eggs in a bowl.',
      'Dice onion, bell pepper, and grate carrot.',
      'Heat olive oil in a pan.',
      'Add vegetables and sauté for 2-3 minutes.',
      'Pour beaten eggs over vegetables.',
      'Cook for 3-4 minutes until almost set.',
      'Sprinkle cheese on top and fold omelette in half.',
      'Cook for another minute and serve.',
    ],
    nutritionInfo: {
      calories: 280,
      protein: 20,
      carbs: 8,
      fat: 18,
      fiber: 2,
    },
    dietaryPreferences: ['vegetarian', 'gluten-free', 'nut-free'],
    prepTime: 10,
    cookTime: 10,
    servings: 2,
    likes: 56,
    dislikes: 2,
  },
  {
    id: '4',
    title: 'Mushroom Risotto',
    image: 'https://images.unsplash.com/photo-1676037150304-e4e2a8c63a0e?w=800&auto=format&fit=crop',
    ingredients: [
      ingredients[4], // Rice
      ingredients[17], // Mushroom
      ingredients[1], // Onion
      ingredients[2], // Garlic
      ingredients[11], // Butter
      ingredients[12], // Olive Oil
      ingredients[13], // Salt
      ingredients[14], // Pepper
    ],
    instructions: [
      'Heat olive oil and butter in a pan.',
      'Add diced onion and minced garlic, sauté until translucent.',
      'Add sliced mushrooms and cook for 5 minutes.',
      'Add rice and stir for 2 minutes.',
      'Gradually add warm broth, stirring continuously.',
      'Cook until rice is creamy and cooked through.',
      'Season with salt and pepper.',
      'Serve hot.',
    ],
    nutritionInfo: {
      calories: 380,
      protein: 8,
      carbs: 60,
      fat: 12,
      fiber: 3,
    },
    dietaryPreferences: ['vegetarian', 'nut-free'],
    prepTime: 10,
    cookTime: 30,
    servings: 4,
    likes: 92,
    dislikes: 4,
  },
  {
    id: '5',
    title: 'Beef and Vegetable Stir Fry',
    image: 'https://images.unsplash.com/photo-1512058556646-c4da40c95972?w=800&auto=format&fit=crop',
    ingredients: [
      ingredients[18], // Beef
      ingredients[1], // Onion
      ingredients[6], // Bell Pepper
      ingredients[7], // Carrot
      ingredients[8], // Broccoli
      ingredients[2], // Garlic
      ingredients[12], // Olive Oil
      ingredients[13], // Salt
      ingredients[14], // Pepper
      ingredients[4], // Rice
    ],
    instructions: [
      'Slice beef into thin strips.',
      'Chop vegetables into bite-sized pieces.',
      'Heat olive oil in a pan and add minced garlic.',
      'Add beef and stir fry until browned.',
      'Add vegetables and stir fry for 5-7 minutes.',
      'Season with salt and pepper.',
      'Serve hot over rice.',
    ],
    nutritionInfo: {
      calories: 450,
      protein: 30,
      carbs: 40,
      fat: 15,
      fiber: 7,
    },
    dietaryPreferences: ['dairy-free', 'nut-free', 'gluten-free'],
    prepTime: 15,
    cookTime: 15,
    servings: 4,
    likes: 85,
    dislikes: 7,
  },
  {
    id: '6',
    title: 'Spinach and Ricotta Stuffed Shells',
    image: 'https://images.unsplash.com/photo-1551892374-ecf8754cf8b0?w=800&auto=format&fit=crop',
    ingredients: [
      ingredients[5], // Pasta (shells)
      ingredients[19], // Spinach
      ingredients[9], // Cheese (ricotta)
      ingredients[0], // Tomato (for sauce)
      ingredients[2], // Garlic
      ingredients[12], // Olive Oil
      ingredients[13], // Salt
      ingredients[14], // Pepper
    ],
    instructions: [
      'Cook pasta shells according to package instructions.',
      'Mix ricotta cheese with chopped spinach.',
      'Make tomato sauce with olive oil, garlic, and tomatoes.',
      'Fill shells with spinach and ricotta mixture.',
      'Place in baking dish and cover with tomato sauce.',
      'Bake at 375°F for 20 minutes.',
      'Serve hot.',
    ],
    nutritionInfo: {
      calories: 400,
      protein: 20,
      carbs: 45,
      fat: 15,
      fiber: 5,
    },
    dietaryPreferences: ['vegetarian', 'nut-free'],
    prepTime: 20,
    cookTime: 30,
    servings: 6,
    likes: 67,
    dislikes: 3,
  },
];

export const getRecipesByIngredients = (ingredientIds: string[]): Recipe[] => {
  if (ingredientIds.length === 0) return recipes;
  
  return recipes.filter(recipe => {
    const recipeIngredientIds = recipe.ingredients.map(i => i.id);
    // Return recipes where at least one ingredient matches
    return ingredientIds.some(id => recipeIngredientIds.includes(id));
  });
};

export const getRecipesByDietaryPreferences = (preferences: DietaryPreference[]): Recipe[] => {
  if (preferences.length === 0 || preferences.includes('all')) return recipes;
  
  return recipes.filter(recipe =>
    preferences.every(pref => recipe.dietaryPreferences.includes(pref))
  );
};

export const getFilteredRecipes = (ingredientIds: string[], preferences: DietaryPreference[]): Recipe[] => {
  let filteredRecipes = recipes;
  
  if (ingredientIds.length > 0) {
    filteredRecipes = getRecipesByIngredients(ingredientIds);
  }
  
  if (preferences.length > 0 && !preferences.includes('all')) {
    filteredRecipes = filteredRecipes.filter(recipe =>
      preferences.every(pref => recipe.dietaryPreferences.includes(pref))
    );
  }
  
  return filteredRecipes;
};
