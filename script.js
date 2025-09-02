// Configuration
const CONFIG = {
    backendUrl: "https://lovnishverma-iris-backend.hf.space/predict",
    requestTimeout: 30000, // 30 seconds
    sampleData: {
        setosa: { sepal_length: 5.1, sepal_width: 3.5, petal_length: 1.4, petal_width: 0.2 },
        versicolor: { sepal_length: 6.2, sepal_width: 2.9, petal_length: 4.3, petal_width: 1.3 },
        virginica: { sepal_length: 6.5, sepal_width: 3.0, petal_length: 5.2, petal_width: 2.0 }
    },
    speciesInfo: {
        setosa: { emoji: '🌺', latin: 'Iris setosa', color: '#ff6b6b' },
        versicolor: { emoji: '🌻', latin: 'Iris versicolor', color: '#4ecdc4' },
        virginica: { emoji: '🌷', latin: 'Iris virginica', color: '#45b7d1' }
    }
};

// DOM elements
const form = document.getElementById('irisForm');
const submitBtn = document.getElementById('submitBtn');
const loadingOverlay = document.getElementById('loadingOverlay');
const resultSection = document.getElementById('resultSection');
const errorSection = document.getElementById('errorSection');
const clearBtn = document.getElementById('clearBtn');
const retryBtn = document.getElementById('retryBtn');

// Utility functions
function showElement(element) {
    element.classList.remove('hidden');
}

function hideElement(element) {
    element.classList.add('hidden');
}

function setButtonLoading(loading) {
    const btnText = submitBtn.querySelector('.btn-text');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    if (loading) {
        submitBtn.disabled = true;
        hideElement(btnText);
        showElement(btnLoading);
        showElement(loadingOverlay);
    } else {
        submitBtn.disabled = false;
        showElement(btnText);
        hideElement(btnLoading);
        hideElement(loadingOverlay);
    }
}

// Input validation
function validateInput(field, value) {
    const ranges = {
        sepal_length: { min: 4.0, max: 8.0 },
        sepal_width: { min: 2.0, max: 4.5 },
        petal_length: { min: 1.0, max: 7.0 },
        petal_width: { min: 0.1, max: 2.5 }
    };

    const range = ranges[field];
    const errorElement = document.getElementById(`${field}_error`);
    const inputElement = document.getElementById(field);

    if (!value || isNaN(value)) {
        showError(errorElement, inputElement, 'This field is required');
        return false;
    }

    if (value < range.min || value > range.max) {
        showError(errorElement, inputElement, `Value must be between ${range.min} and ${range.max} cm`);
        return false;
    }

    clearError(errorElement, inputElement);
    return true;
}

function showError(errorElement, inputElement, message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    inputElement.classList.add('error');
}

function clearError(errorElement, inputElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
    inputElement.classList.remove('error');
}

function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    const inputElements = document.querySelectorAll('input[type="number"]');
    
    errorElements.forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
    
    inputElements.forEach(el => {
        el.classList.remove('error');
    });
}

// Form validation
function validateForm() {
    const formData = new FormData(form);
    let isValid = true;

    for (const [field, value] of formData.entries()) {
        if (!validateInput(field, parseFloat(value))) {
            isValid = false;
        }
    }

    return isValid;
}

// API call with timeout
async function makeApiCall(data) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CONFIG.requestTimeout);

    try {
        const response = await fetch(CONFIG.backendUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout. Please try again.');
        }
        throw error;
    }
}

// Display results
function displayResult(prediction, confidence = null, probabilities = null, processingTime = null) {
    const speciesInfo = CONFIG.speciesInfo[prediction.toLowerCase()];
    
    if (!speciesInfo) {
        throw new Error('Unknown species prediction');
    }

    // Update species information
    document.getElementById('speciesEmoji').textContent = speciesInfo.emoji;
    document.getElementById('speciesName').textContent = 
        prediction.charAt(0).toUpperCase() + prediction.slice(1);
    document.getElementById('speciesLatin').textContent = speciesInfo.latin;

    // Update confidence if available
    if (confidence !== null) {
        const confidencePercentage = Math.round(confidence * 100);
        document.getElementById('confidenceValue').textContent = `${confidencePercentage}%`;
        document.getElementById('confidenceProgress').style.width = `${confidencePercentage}%`;
        document.getElementById('confidenceProgress').style.backgroundColor = speciesInfo.color;
    }

    // Update probabilities if available
    if (probabilities) {
        updateProbabilityBars(probabilities);
    }

    // Update processing time if available
    if (processingTime !== null) {
        document.getElementById('processingTime').textContent = processingTime;
    }

    // Show result section
    hideElement(errorSection);
    showElement(resultSection);
    
    // Scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function updateProbabilityBars(probabilities) {
    const species = ['setosa', 'versicolor', 'virginica'];
    
    species.forEach(species => {
        const probability = probabilities[species] || 0;
        const percentage = Math.round(probability * 100);
        
        const probElement = document.getElementById(`${species}Prob`);
        const pctElement = document.getElementById(`${species}Pct`);
        
        if (probElement && pctElement) {
            probElement.style.width = `${percentage}%`;
            pctElement.textContent = `${percentage}%`;
        }
    });
}

// Display error
function displayError(message) {
    document.getElementById('errorMessage').textContent = message;
    hideElement(resultSection);
    showElement(errorSection);
    errorSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Load sample data
function loadSampleData(species) {
    const data = CONFIG.sampleData[species];
    if (!data) return;

    Object.entries(data).forEach(([field, value]) => {
        const input = document.getElementById(field);
        if (input) {
            input.value = value;
            input.dispatchEvent(new Event('input')); // Trigger validation
        }
    });

    clearAllErrors();
}

// Clear form and results
function clearForm() {
    form.reset();
    clearAllErrors();
    hideElement(resultSection);
    hideElement(errorSection);
    document.getElementById('sepal_length').focus();
}

// Event listeners
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    clearAllErrors();
    
    if (!validateForm()) {
        return;
    }

    const formData = new FormData(form);
    const data = {};
    
    for (const [key, value] of formData.entries()) {
        data[key] = parseFloat(value);
    }

    setButtonLoading(true);

    try {
        const startTime = performance.now();
        const result = await makeApiCall(data);
        const endTime = performance.now();
        const processingTime = Math.round(endTime - startTime);

        displayResult(
            result.prediction,
            result.confidence,
            result.probabilities,
            processingTime
        );
    } catch (error) {
        console.error('Prediction error:', error);
        displayError(error.message || 'Failed to get prediction. Please check your connection and try again.');
    } finally {
        setButtonLoading(false);
        console.log('Loading state reset');
    }
});

// Real-time input validation
document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener('input', (e) => {
        const field = e.target.name;
        const value = parseFloat(e.target.value);
        
        if (e.target.value) {
            validateInput(field, value);
        } else {
            clearError(
                document.getElementById(`${field}_error`),
                e.target
            );
        }
    });

    input.addEventListener('blur', (e) => {
        const field = e.target.name;
        const value = parseFloat(e.target.value);
        
        if (e.target.value) {
            validateInput(field, value);
        }
    });
});

// Sample data buttons
document.querySelectorAll('.sample-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const species = btn.dataset.species;
        loadSampleData(species);
    });
});

// Clear button
clearBtn.addEventListener('click', clearForm);

// Retry button
retryBtn.addEventListener('click', () => {
    hideElement(errorSection);
    document.getElementById('sepal_length').focus();
});

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Focus first input
    document.getElementById('sepal_length').focus();
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch(e.key) {
                case 'Enter':
                    e.preventDefault();
                    if (!submitBtn.disabled) {
                        form.dispatchEvent(new Event('submit'));
                    }
                    break;
                case 'r':
                    e.preventDefault();
                    clearForm();
                    break;
            }
        }
    });
    
    console.log('🌸 Iris Classifier loaded successfully!');
    console.log('💡 Tip: Use Ctrl+Enter to submit and Ctrl+R to reset');
});
