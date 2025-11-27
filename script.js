// DOM refs
const modeEl = document.getElementById('mode');
const algEl = document.getElementById('algorithm');
const shiftEl = document.getElementById('shift');
const caesarOptions = document.getElementById('caesar-options');
const inputEl = document.getElementById('inputText');
const outputEl = document.getElementById('outputText');
const processBtn = document.getElementById('processBtn');
const clearBtn = document.getElementById('clearBtn');
const copyBtn = document.getElementById('copyBtn');

// Show/hide Caesar options
function updateOptionsVisibility() {
    if (algEl.value === 'caesar') caesarOptions.style.display = 'flex';
    else caesarOptions.style.display = 'none';
}
algEl.addEventListener('change', updateOptionsVisibility);
updateOptionsVisibility();

// Basic Caesar cipher implementation (letters only, preserves case)
function caesarShift(text, shift) {
    const s = ((shift % 26) + 26) % 26; // normalize
    return text.split('').map(ch => {
        const code = ch.charCodeAt(0);
        // A-Z
        if (code >= 65 && code <= 90) {
            return String.fromCharCode(((code - 65 + s) % 26) + 65);
        }
        // a-z
        if (code >= 97 && code <= 122) {
            return String.fromCharCode(((code - 97 + s) % 26) + 97);
        }
        return ch;
    }).join('');
}

// Caesar decode uses negative shift
function caesarProcess(text, shift, mode) {
    if (mode === 'encode') return caesarShift(text, shift);
    return caesarShift(text, -shift);
}

// Base64 encode/decode with safe handling
function base64Process(text, mode) {
    try {
        if (mode === 'encode') {
            // encode UTF-8 to base64
            return btoa(unescape(encodeURIComponent(text)));
        } else {
            // decode base64 to UTF-8
            return decodeURIComponent(escape(atob(text)));
        }
    } catch (e) {
        return 'Error: Invalid input for Base64 operation.';
    }
}

function process() {
    const mode = modeEl.value; // encode / decode
    const alg = algEl.value;   // caesar / base64
    const text = inputEl.value || '';

    if (!text) {
        outputEl.value = '';
        alert('Please enter text to process.');
        return;
    }

    if (alg === 'caesar') {
        const shift = parseInt(shiftEl.value, 10) || 0;
        outputEl.value = caesarProcess(text, shift, mode);
    } else if (alg === 'base64') {
        outputEl.value = base64Process(text, mode);
    } else {
        outputEl.value = 'Unsupported algorithm';
    }
}

// Button events
processBtn.addEventListener('click', process);
clearBtn.addEventListener('click', () => {
    inputEl.value = '';
    outputEl.value = '';
});
copyBtn.addEventListener('click', async () => {
    if (!outputEl.value) return;
    try {
        await navigator.clipboard.writeText(outputEl.value);
        copyBtn.textContent = 'Copied!';
        setTimeout(() => copyBtn.textContent = 'Copy Result', 1200);
    } catch {
        alert('Copy failed — select the output and copy manually.');
    }
});
