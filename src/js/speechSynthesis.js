// Speech synthesis functionality
const checkSpeechSynthesisSupport = () => {
    if (typeof window === 'undefined' || typeof window.speechSynthesis === 'undefined') {
        throw new Error('Speech synthesis not supported in this browser');
    }
    return window.speechSynthesis;
};

const initSpeechSynthesis = () => {
    const synthesis = checkSpeechSynthesisSupport();
    
    // Wait for voices to be loaded
    return new Promise((resolve, reject) => {
        let voices = synthesis.getVoices();
        
        if (voices.length > 0) {
            resolve(synthesis);
            return;
        }

        // Chrome loads voices asynchronously
        synthesis.addEventListener('voiceschanged', () => {
            voices = synthesis.getVoices();
            if (voices.length > 0) {
                resolve(synthesis);
            } else {
                reject(new Error('No voices available'));
            }
        }, { once: true });

        // Timeout after 3 seconds
        setTimeout(() => {
            reject(new Error('Timeout waiting for voices'));
        }, 3000);
    });
};

const getVoices = (lang, gender) => {
    const synthesis = checkSpeechSynthesisSupport();
    const langMap = {
        'en': ['en-US', 'en-GB', 'en'],
        'fr': ['fr-FR', 'fr'],
        'es': ['es-ES', 'es']
    };

    const voices = synthesis.getVoices();
    return voices.filter(voice => {
        // Check if voice matches any of the language codes for the requested language
        const matchesLang = langMap[lang].some(code => voice.lang.startsWith(code));
        // Check gender if specified, default to any voice if gender matching fails
        const matchesGender = gender === 'any' || 
            (gender === 'female' && voice.name.toLowerCase().includes('female')) ||
            (gender === 'male' && !voice.name.toLowerCase().includes('female'));
        return matchesLang && matchesGender;
    });
};

const speak = (text, lang, gender = 'male') => {
    const synthesis = checkSpeechSynthesisSupport();
    
    return new Promise((resolve, reject) => {
        // Cancel any ongoing speech
        synthesis.cancel();

        const voices = getVoices(lang, gender);
        if (voices.length === 0) {
            // Fallback to any voice for the language if gender-specific voice not found
            const anyVoices = getVoices(lang, 'any');
            if (anyVoices.length === 0) {
                reject(new Error(`No voice found for language ${lang}`));
                return;
            }
            voices.push(anyVoices[0]);
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voices[0];
        utterance.lang = voices[0].lang; // Ensure language matches the voice
        utterance.rate = 1;
        utterance.pitch = 1;

        utterance.onend = () => {
            resolve();
        };

        utterance.onerror = (event) => {
            reject(new Error(`Speech synthesis error: ${event.error}`));
        };

        synthesis.speak(utterance);
    });
};

// Export for use in other files
window.textToSpeech = {
    init: initSpeechSynthesis,
    speak,
    getVoices
};