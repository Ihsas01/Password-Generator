const btnEl = document.querySelector(".btn");
const inputEl = document.getElementById("input");
const copyIconEl = document.querySelector(".fa-copy");
const alertContainerEl = document.querySelector(".alert-container");
const lengthSliderEl = document.getElementById("length-slider");
const lengthValueEl = document.getElementById("length-value");
const uppercaseEl = document.getElementById("uppercase");
const lowercaseEl = document.getElementById("lowercase");
const numbersEl = document.getElementById("numbers");
const symbolsEl = document.getElementById("symbols");
const strengthBarEl = document.getElementById("strength-bar");
const strengthTextEl = document.getElementById("strength-text");
const entropyTextEl = document.getElementById("entropy-text");
const nameInputEl = document.getElementById("name-input");
const wordInputEl = document.getElementById("word-input");
const themeToggleEl = document.getElementById("theme-toggle");
const historyListEl = document.getElementById("history-list");

let passwordHistory = [];

btnEl.addEventListener("click", createPassword);
copyIconEl.addEventListener("click", copyPassword);
lengthSliderEl.addEventListener("input", () => {
    lengthValueEl.textContent = lengthSliderEl.value;
    const value = (lengthSliderEl.value - lengthSliderEl.min) / (lengthSliderEl.max - lengthSliderEl.min) * 100;
    lengthSliderEl.style.setProperty('--value', `${value}%`);
    createPassword();
});
[uppercaseEl, lowercaseEl, numbersEl, symbolsEl].forEach(checkbox => {
    checkbox.addEventListener("change", createPassword);
});
nameInputEl.addEventListener("input", createPassword);
wordInputEl.addEventListener("input", createPassword);
themeToggleEl.addEventListener("click", toggleTheme);

function toggleTheme() {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    themeToggleEl.innerHTML = isDark ? '<i class="fas fa-sun animate-spin-on-hover"></i>' : '<i class="fas fa-moon animate-spin-on-hover"></i>';
    localStorage.setItem("theme", isDark ? "dark" : "light");
}

function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        document.body.classList.add("dark");
        themeToggleEl.innerHTML = '<i class="fas fa-sun animate-spin-on-hover"></i>';
    }
}

function createPassword() {
    const length = parseInt(lengthSliderEl.value);
    const useUppercase = uppercaseEl.checked;
    const useLowercase = lowercaseEl.checked;
    const useNumbers = numbersEl.checked;
    const useSymbols = symbolsEl.checked;
    const userName = nameInputEl.value.trim();
    const customWord = wordInputEl.value.trim();

    if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
        showAlert("Select at least one character type!");
        inputEl.value = "";
        updateStrength(0, 0);
        return;
    }

    let chars = "";
    if (useUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useLowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (useNumbers) chars += "0123456789";
    if (useSymbols) chars += "!@#$%^&*()_+?:{}[]";

    let password = "";
    let usedLength = 0;

    if (userName && usedLength < length) {
        const namePart = userName.slice(0, Math.min(3, length - usedLength)).split("").map(c => {
            if (useUppercase && Math.random() > 0.5) return c.toUpperCase();
            return c.toLowerCase();
        }).join("");
        password += namePart;
        usedLength += namePart.length;
    }

    if (customWord && usedLength < length) {
        const wordPart = customWord.slice(0, Math.min(4, length - usedLength)).split("").map(c => {
            if (useUppercase && Math.random() > 0.5) return c.toUpperCase();
            return c.toLowerCase();
        }).join("");
        password += wordPart;
        usedLength += wordPart.length;
    }

    const remainingLength = length - usedLength;
    if (remainingLength > 0) {
        const randomValues = new Uint32Array(remainingLength);
        crypto.getRandomValues(randomValues);
        for (let i = 0; i < remainingLength; i++) {
            const randomIndex = randomValues[i] % chars.length;
            password += chars[randomIndex];
        }
    }

    password = password.split("").sort(() => Math.random() - 0.5).join("");
    inputEl.value = password;

    const strength = calculateStrength(password);
    const entropy = calculateEntropy(password, chars.length);
    updateStrength(strength, entropy);

    updateHistory(password);
}

function copyPassword() {
    if (!inputEl.value) return;
    navigator.clipboard.writeText(inputEl.value);
    showAlert("Password copied!");
}

function showAlert(message) {
    alertContainerEl.innerText = message;
    alertContainerEl.classList.remove("active");
    setTimeout(() => alertContainerEl.classList.add("active"), 2000);
}

function calculateStrength(password) {
    let strength = 0;
    if (password.length > 16) strength += 3;
    else if (password.length > 12) strength += 2;
    else if (password.length > 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[!@#$%^&*()_+?:{}[\]]/.test(password)) strength += 1;
    return strength;
}

function calculateEntropy(password, charsetSize) {
    return Math.log2(Math.pow(charsetSize, password.length)).toFixed(2);
}

function updateStrength(strength, entropy) {
    strengthBarEl.className = "strength-bar h-3 bg-gray-200/50 dark:bg-gray-600/50 rounded-full overflow-hidden";
    entropyTextEl.textContent = `Entropy: ${entropy} bits`;
    if (strength <= 3) {
        strengthBarEl.innerHTML = '<div class="h-full w-1/3 bg-red-400 transition-all duration-500 ease-out"></div>';
        strengthTextEl.textContent = "Weak";
        strengthTextEl.style.color = "#f87171";
    } else if (strength <= 5) {
        strengthBarEl.innerHTML = '<div class="h-full w-2/3 bg-yellow-400 transition-all duration-500 ease-out"></div>';
        strengthTextEl.textContent = "Medium";
        strengthTextEl.style.color = "#facc15";
    } else {
        strengthBarEl.innerHTML = '<div class="h-full w-full bg-green-400 transition-all duration-500 ease-out"></div>';
        strengthTextEl.textContent = "Strong";
        strengthTextEl.style.color = "#4ade80";
    }
}

function updateHistory(password) {
    passwordHistory.unshift(password);
    passwordHistory = passwordHistory.slice(0, 5);
    historyListEl.innerHTML = passwordHistory.map((pwd, index) => `
        <li class="flex justify-between items-center bg-white/30 dark:bg-gray-700/30 backdrop-blur-md p-2 rounded-lg animate-slide-in">
            <span class="text-sm text-gray-800 dark:text-gray-100 font-mono truncate">${pwd}</span>
            <button class="copy-history text-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-300" data-index="${index}">
                <i class="fas fa-copy animate-pulse-on-hover"></i>
            </button>
        </li>
    `).join("");
    document.querySelectorAll(".copy-history").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.dataset.index;
            navigator.clipboard.writeText(passwordHistory[index]);
            showAlert("History password copied!");
        });
    });
}

initTheme();