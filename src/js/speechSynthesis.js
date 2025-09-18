// Speech synthesis functionality
const checkSpeechSynthesisSupport = () => {
    if (typeof window === 'undefined' || typeof window.speechSynthesis === 'undefined') {
        throw new Error('Speech synthesis not supported in this browser');
    }
    return window.speechSynthesis;
};

// Global variable to store loaded voices
let loadedVoices = null;

const loadVoices = () => {
    const synthesis = checkSpeechSynthesisSupport();
    
    return new Promise((resolve, reject) => {
        // First attempt: check if voices are already available
        let voices = synthesis.getVoices();
        if (voices.length > 0) {
            loadedVoices = voices;
            console.log('Voices loaded immediately:', voices.length);
            resolve(voices);
            return;
        }

        // Second attempt: try polling a few times before setting up the event listener
        let attempts = 0;
        const maxAttempts = 10;
        const pollInterval = 100; // 100ms between attempts

        const tryGetVoices = () => {
            voices = synthesis.getVoices();
            if (voices.length > 0) {
                loadedVoices = voices;
                console.log('Voices loaded after polling:', voices.length);
                resolve(voices);
                return true;
            }
            return false;
        };

        const pollVoices = () => {
            if (attempts >= maxAttempts) {
                // If polling fails, set up the event listener as fallback
                console.log('Polling failed, setting up voiceschanged listener');
                setupEventListener();
                return;
            }

            attempts++;
            if (!tryGetVoices()) {
                setTimeout(pollVoices, pollInterval);
            }
        };

        const setupEventListener = () => {
            console.log('Setting up voiceschanged event listener');
            const voicesChangedHandler = () => {
                const newVoices = synthesis.getVoices();
                if (newVoices.length > 0) {
                    loadedVoices = newVoices;
                    console.log('Voices loaded from event:', newVoices.length);
                    synthesis.removeEventListener('voiceschanged', voicesChangedHandler);
                    resolve(newVoices);
                }
            };

            synthesis.addEventListener('voiceschanged', voicesChangedHandler);

            // Final timeout
            setTimeout(() => {
                synthesis.removeEventListener('voiceschanged', voicesChangedHandler);
                // One last attempt before giving up
                voices = synthesis.getVoices();
                if (voices.length > 0) {
                    loadedVoices = voices;
                    console.log('Voices loaded in final attempt:', voices.length);
                    resolve(voices);
                } else {
                    console.error('Failed to load voices after all attempts');
                    reject(new Error('Could not load speech synthesis voices'));
                }
            }, 3000);
        };

        // Start the polling process
        pollVoices();
    });
};

const initSpeechSynthesis = async () => {
    const synthesis = checkSpeechSynthesisSupport();
    
    try {
        console.log('Initializing speech synthesis...');
        const voices = await loadVoices();
        if (voices.length === 0) {
            throw new Error('No voices available after initialization');
        }
        
        console.log('Available voices:', voices.map(v => ({
            name: v.name,
            lang: v.lang,
            default: v.default ? 'yes' : 'no',
            localService: v.localService ? 'yes' : 'no'
        })));
        
        // Pre-filter voices for each language
        const langMap = {
            'en': ['en-US', 'en-GB', 'en', 'en-CA'],
            'fr': ['fr-FR', 'fr-CA', 'fr', 'fra', 'fr-BE', 'fr-CH'],
            'es': ['es-ES', 'es-MX', 'es', 'spa', 'es-AR', 'es-CL']
        };
        
        for (const [lang, codes] of Object.entries(langMap)) {
            const availableVoices = voices.filter(voice => 
                codes.some(code => voice.lang.toLowerCase().startsWith(code.toLowerCase()))
            );
            console.log(`Found ${availableVoices.length} voices for ${lang}:`,
                availableVoices.map(v => `${v.name} (${v.lang})`));
        }
        
        return synthesis;
    } catch (error) {
        console.error('Speech synthesis initialization failed:', error);
        throw new Error('Speech synthesis initialization failed: ' + error.message);
    }
};

const getVoices = (lang, gender) => {
    const synthesis = checkSpeechSynthesisSupport();
    const langMap = {
        'en': ['en-US', 'en-GB', 'en', 'en-CA'],
        'fr': ['fr-FR', 'fr-CA', 'fr', 'fra', 'fr-BE', 'fr-CH'],
        'es': ['es-ES', 'es-MX', 'es', 'spa', 'es-AR', 'es-CL']
    };

    // Use cached voices or get new ones
    const voices = loadedVoices || synthesis.getVoices();
    console.log('Available voices:', voices.map(v => ({ name: v.name, lang: v.lang })));
    
    // Try exact match first
    let matchedVoices = voices.filter(voice => {
        const matchesLang = langMap[lang].some(code => voice.lang.startsWith(code));
        // More lenient gender detection
        const matchesGender = gender === 'any' || 
            (gender === 'female' && (voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('femme'))) ||
            (gender === 'male' && (voice.name.toLowerCase().includes('male') || voice.name.toLowerCase().includes('homme')));
        return matchesLang && matchesGender;
    });

    // If no voices found with gender preference, return any voice for the language
    if (matchedVoices.length === 0) {
        matchedVoices = voices.filter(voice => 
            langMap[lang].some(code => voice.lang.startsWith(code))
        );
    }

    console.log(`Found ${matchedVoices.length} voices for language ${lang}:`, 
        matchedVoices.map(v => ({ name: v.name, lang: v.lang })));
    
    return matchedVoices;
};

const speak = async (text, lang, gender = 'male') => {
    const synthesis = checkSpeechSynthesisSupport();
    
    // Ensure voices are loaded
    if (!loadedVoices) {
        try {
            await loadVoices();
        } catch (error) {
            console.error('Failed to load voices:', error);
            throw new Error('Unable to load speech synthesis voices');
        }
    }
    
    return new Promise((resolve, reject) => {
        // Cancel any ongoing speech
        synthesis.cancel();

        const voices = getVoices(lang, gender);
        if (voices.length === 0) {
            reject(new Error(`No voice found for language ${lang}. Available voices: ${synthesis.getVoices().map(v => `${v.name} (${v.lang})`).join(', ')}`));
            return;
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