// Language detection functionality
const detectLanguage = (text) => {
    // Simple language detection based on common words
    const languages = {
        fr: {
            words: ['le', 'la', 'les', 'un', 'une', 'des', 'et', 'ou', 'je', 'tu', 'il', 'elle', 'nous', 'vous'],
            count: 0
        },
        en: {
            words: ['the', 'a', 'an', 'and', 'or', 'i', 'you', 'he', 'she', 'we', 'they', 'this', 'that', 'what'],
            count: 0
        },
        es: {
            words: ['el', 'la', 'los', 'las', 'un', 'una', 'unos', 'y', 'o', 'yo', 'tu', 'él', 'ella', 'nosotros'],
            count: 0
        }
    };

    // Convert text to lowercase and split into words
    const words = text.toLowerCase().split(/\s+/);
    const totalWords = words.length;

    // Count occurrences of words in each language
    words.forEach(word => {
        for (let lang in languages) {
            if (languages[lang].words.includes(word)) {
                languages[lang].count++;
            }
        }
    });

    // Calculate percentages
    const results = {};
    for (let lang in languages) {
        results[lang] = (languages[lang].count / totalWords) * 100;
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

// Export for use in other files
window.languageDetection = {
    detectLanguage
};