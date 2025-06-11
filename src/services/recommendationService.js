
import * as tf from '@tensorflow/tfjs';
import Papa from 'papaparse';

// Daftar 35 bahan sebagai kosakata utama
const VOCABULARY = [
    'Bawang Bombai', 'Bawang Merah', 'Bawang Putih', 'Brokoli', 'Cabai Hijau', 'Cabai Merah',
    'Daging Sapi', 'Daging Unggas', 'Ikan', 'Jagung', 'Jahe', 'Jamur', 'Kacang Hijau',
    'Kacang Merah', 'Kacang Panjang', 'Kacang Tanah', 'Kembang Kol', 'Kentang', 'Kikil',
    'Kol', 'Labu Siam', 'Mie', 'Nasi', 'Petai', 'Sawi', 'Selada', 'Seledri',
    'Telur Ayam', 'Telur Bebek', 'Tempe', 'Terong', 'Timun', 'Tomat', 'Usus', 'Wortel'
];

// Pemetaan kata kunci bahan ke nama kanonikal dalam VOCABULARY
const CANONICAL_TO_KEYWORDS_MAP = {
    'Bawang Bombai': ['bawang bombay', 'bombay'],
    'Bawang Merah': ['bawang merah'],
    'Bawang Putih': ['bawang putih'],
    'Brokoli': ['brokoli'],
    'Cabai Hijau': ['cabai hijau', 'cabe hijau'],
    'Cabai Merah': ['cabai merah', 'cabe merah'],
    'Daging Sapi': ['daging sapi', 'sapi'],
    'Daging Unggas': ['daging unggas', 'ayam', 'itik', 'bebek'], 
    'Ikan': ['ikan', 'tongkol', 'lele', 'gurame'],
    'Jagung': ['jagung'],
    'Jahe': ['jahe'],
    'Jamur': ['jamur', 'jamur tiram', 'jamur kancing'],
    'Kacang Hijau': ['kacang hijau', 'kacang ijo'],
    'Kacang Merah': ['kacang merah'],
    'Kacang Panjang': ['kacang panjang'],
    'Kacang Tanah': ['kacang tanah'],
    'Kembang Kol': ['kembang kol'],
    'Kentang': ['kentang'],
    'Kikil': ['kikil'],
    'Kol': ['kol', 'kubis'],
    'Labu Siam': ['labu siam', 'labu jipang'],
    'Mie': ['mie', 'mi', 'bakmi'],
    'Nasi': ['nasi'],
    'Petai': ['petai', 'pete'],
    'Sawi': ['sawi', 'sawi hijau', 'caisim', 'pakcoy'], 
    'Selada': ['selada'],
    'Seledri': ['seledri'],
    'Telur Ayam': ['telur ayam', 'telur'], 
    'Telur Bebek': ['telur bebek'],
    'Tempe': ['tempe', 'tempeh'],
    'Terong': ['terong', 'terung'],
    'Timun': ['timun', 'ketimun'],
    'Tomat': ['tomat'],
    'Usus': ['usus', 'usus ayam'],
    'Wortel': ['wortel']
};


class RecommendationService {
    constructor() {
        this.recipesData = [];
        this.recipeVectorsTensor = null;
        this.isInitialized = false;
        this.vocabulary = VOCABULARY;
        this.keywordMap = CANONICAL_TO_KEYWORDS_MAP;
    }

    // Mem-parse string bahan dari dataset dan memetakan ke kosakata
    parseIngredientsStringFromRecipe(ingredientsStr) {
        const ingredientsInRecipe = new Set();
        if (!ingredientsStr || typeof ingredientsStr !== 'string') return [];
        const normalizedIngredientsStr = ingredientsStr.toLowerCase();

        this.vocabulary.forEach(canonicalName => {
            const keywords = this.keywordMap[canonicalName] || [canonicalName.toLowerCase()];
            for (const keyword of keywords) {
                if (normalizedIngredientsStr.includes(keyword.toLowerCase())) {
                    ingredientsInRecipe.add(canonicalName);
                    break; 
                }
            }
        });
        return Array.from(ingredientsInRecipe);
    }

    // Mengubah daftar nama bahan (dari resep atau pengguna) menjadi vektor biner
    ingredientListToVector(ingredientList) {
        const vector = Array(this.vocabulary.length).fill(0);
        ingredientList.forEach(ingredientName => {
            const index = this.vocabulary.indexOf(ingredientName);
            if (index !== -1) {
                vector[index] = 1;
            }
        });
        return vector;
    }

    async init(datasetPath = '/dataset_finale.csv') {
        if (this.isInitialized) return;

        try {
            const response = await fetch(datasetPath);
            const csvText = await response.text();

            const parseResult = Papa.parse(csvText, { header: true, skipEmptyLines: true });
            const rawRecipes = parseResult.data;

            // Membersihkan data: pastikan Title dan Ingredients ada, dan Loves/Kalori numerik
            this.recipesData = rawRecipes
                .filter(recipe => recipe.Title && recipe.Ingredients)
                .map(recipe => ({
                    ...recipe,
                    Loves: parseFloat(recipe.Loves) || 0,
                    Kalori: parseFloat(recipe.Kalori) || 0,
                }));
            
            const recipeVectorsArray = this.recipesData.map(recipe => {
                const parsedRecipeIngredients = this.parseIngredientsStringFromRecipe(recipe.Ingredients);
                return this.ingredientListToVector(parsedRecipeIngredients);
            });
            
            if (recipeVectorsArray.length === 0) {
                 console.warn("Tidak ada vektor resep yang bisa dibuat. Periksa dataset dan logika parsing.");
                 this.isInitialized = false;
                 return;
            }

            this.recipeVectorsTensor = tf.tensor2d(recipeVectorsArray, [recipeVectorsArray.length, this.vocabulary.length]);
            this.isInitialized = true;
            console.log('Layanan Rekomendasi berhasil diinisialisasi.');
        } catch (error) {
            console.error('Gagal menginisialisasi Layanan Rekomendasi:', error);
            this.isInitialized = false;
        }
    }

    async getRecommendations(userInputIngredients, topN = 10) {
        if (!this.isInitialized || !this.recipeVectorsTensor) {
            console.warn('Layanan Rekomendasi belum siap atau tidak ada vektor resep.');
            return [];
        }
        if (!userInputIngredients || userInputIngredients.length === 0) {
            return [];
        }

        const userVectorArray = this.ingredientListToVector(userInputIngredients);
        
        if (userVectorArray.every(val => val === 0)) {
            console.log("Input pengguna tidak cocok dengan item kosakata manapun.");
            return [];
        }

        const recommendations = await tf.tidy(() => {
            const userQueryTensor = tf.tensor1d(userVectorArray);

            const recipeNorms = this.recipeVectorsTensor.norm(2, 1).clipByValue(1e-6, Infinity); 
            const userNorm = userQueryTensor.norm().clipByValue(1e-6, Infinity);      
            
            const dotProducts = tf.sum(this.recipeVectorsTensor.mul(userQueryTensor), 1);
            
            const similarities = dotProducts.div(recipeNorms.mul(userNorm));
            return similarities.array(); 
        });

        const scoredRecipes = this.recipesData
            .map((recipe, index) => ({
                ...recipe, 
                score: recommendations[index] || 0, 
            }))
            .filter(recipe => recipe.score > 0.00001); // Filter resep dengan skor sangat rendah

        scoredRecipes.sort((a, b) => b.score - a.score);

        return scoredRecipes.slice(0, topN);
    }
}

const recommendationService = new RecommendationService();
export default recommendationService;