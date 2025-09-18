// Speech synthesis functionality
const initSpeechSynthesis = () => {
    if (!window.speechSynthesis) {
        throw new Error('Speech synthesis not supported in this browser');
    }
};

const getVoices = (lang, gender) => {
    const langMap = {
        'en': 'en',
        'fr': 'fr',
        'es': 'es'
    };

    return window.speechSynthesis.getVoices().filter(voice => {
        const matchesLang = voice.lang.startsWith(langMap[lang]);
        const matchesGender = gender === 'any' || 
            (gender === 'female' && voice.name.toLowerCase().includes('female')) ||
            (gender === 'male' && !voice.name.toLowerCase().includes('female'));
        return matchesLang && matchesGender;
    });
};

const speak = (text, lang, gender = 'male') => {
    return new Promise((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(text);
        const voices = getVoices(lang, gender);

        if (voices.length === 0) {
            reject(new Error(`No ${gender} voice found for language ${lang}`));
            return;
        }

        utterance.voice = voices[0];
        utterance.rate = 1;
        utterance.pitch = 1;

        utterance.onend = () => resolve();
        utterance.onerror = (event) => reject(event);

        window.speechSynthesis.speak(utterance);
    });
};

// Export for use in other files
window.speechSynthesis = {
    init: initSpeechSynthesis,
    speak
};