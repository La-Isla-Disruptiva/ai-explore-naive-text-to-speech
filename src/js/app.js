import { languageDetection } from './languageDetection.js';

// Main application logic
document.addEventListener('DOMContentLoaded', () => {
    // Initialize speech synthesis
    window.textToSpeech.init()
        .then(() => {
            showStatus('Speech synthesis ready');
            document.getElementById('speak-button').disabled = false;
        })
        .catch(error => {
            showStatus(`Error: ${error.message}`, 'error');
            document.getElementById('speak-button').disabled = true;
        });

    const textInput = document.getElementById('text-input');
    const voiceSelect = document.getElementById('voice-select');
    const speakButton = document.getElementById('speak-button');
    const statusMessage = document.getElementById('status-message');
    const wordCount = document.getElementById('word-count');
    const languageStats = document.getElementById('language-stats');

    // Word count and language detection
    textInput.addEventListener('input', () => {
        const text = textInput.value.trim();
        const words = text.split(/\s+/).filter(word => word.length > 0);
        const count = words.length;

        wordCount.textContent = count;

        if (count > 500) {
            showStatus('Error: Text exceeds 500 words limit', 'error');
            speakButton.disabled = true;
            return;
        }

        if (count > 0) {
            const { dominantLanguage, dominantPercentage, percentages } = languageDetection.detectLanguage(text);
            
            languageStats.innerHTML = `
                Detected languages:<br>
                French: ${percentages.fr.toFixed(1)}%<br>
                English: ${percentages.en.toFixed(1)}%<br>
                Spanish: ${percentages.es.toFixed(1)}%
            `;

            if (dominantPercentage < 50) {
                showStatus('Error: No dominant language detected (threshold: 50%)', 'error');
                speakButton.disabled = true;
                return;
            }

            speakButton.disabled = false;
            showStatus('');
        } else {
            languageStats.innerHTML = '';
            speakButton.disabled = true;
        }
    });

    // Speech synthesis
    speakButton.addEventListener('click', async () => {
        const text = textInput.value.trim();
        if (!text) return;

        const { dominantLanguage } = languageDetection.detectLanguage(text);
        const gender = voiceSelect.value;

        speakButton.disabled = true;
        showStatus('Reading text...');

        try {
            await window.textToSpeech.speak(text, dominantLanguage, gender);
            showStatus('Finished reading');
        } catch (error) {
            showStatus(`Error: ${error.message}`, 'error');
        } finally {
            speakButton.disabled = false;
        }
    });
});

// Helper function to show status messages
function showStatus(message, type = 'info') {
    const statusMessage = document.getElementById('status-message');
    statusMessage.textContent = message;
    statusMessage.className = `status ${type}`;
}