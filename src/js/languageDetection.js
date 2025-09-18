import { frenchWords } from './french_words.js';

// Language detection functionality
const detectLanguage = (text) => {
    // Enhanced language detection with comprehensive French word list
    const languages = {
        fr: {
            words: frenchWords,
            commonWords: ['le', 'la', 'les', 'un', 'une', 'des', 'et', 'ou', 'je', 'tu', 'il', 'elle', 'nous', 'vous'],
            count: 0,
            commonCount: 0
        },
        en: {
            words: ['the', 'a', 'an', 'and', 'or', 'i', 'you', 'he', 'she', 'we', 'they', 'this', 'that', 'what'],
            commonWords: ['the', 'a', 'an', 'and', 'or', 'i', 'you', 'he', 'she', 'we'],
            count: 0,
            commonCount: 0
        },
        es: {
            words: ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'y', 'o', 'yo', 'tu', 'él', 'ella', 'nosotros'],
            commonWords: ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'y', 'o', 'yo'],
            count: 0,
            commonCount: 0
        }
    };

    // Convert text to lowercase and split into words
    const words = text.toLowerCase().split(/\s+/);
    const totalWords = words.length;

    // Count occurrences of words in each language with weighted scoring
    words.forEach(word => {
        for (let lang in languages) {
            const langData = languages[lang];
            if (langData.commonWords.includes(word)) {
                langData.commonCount++;
                langData.count++;
            } else if (langData.words.includes(word)) {
                langData.count++;
            }
        }
    });

    // Calculate percentages with weighted scoring
    // Common words are weighted more heavily (2x) as they are stronger indicators
    const results = {};
    for (let lang in languages) {
        const langData = languages[lang];
        results[lang] = ((langData.commonCount * 2 + langData.count) / totalWords) * 100;
    }

    // Determine dominant language
    let dominantLang = Object.keys(results).reduce((a, b) => results[a] > results[b] ? a : b);
    let dominantPercentage = results[dominantLang];

    return {
        dominantLanguage: dominantLang,
        dominantPercentage: dominantPercentage,
        percentages: results
    };
};

// Export the module
export const languageDetection = {
    detectLanguage
};

// Also make it available globally for compatibility
window.languageDetection = languageDetection;