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

btnEl.addEventListener("click", createPassword);
copyIconEl.addEventListener("click", copyPassword);
lengthSliderEl.addEventListener("input", () => {
    lengthValueEl.textContent = lengthSliderEl.value;
    createPassword();
});
[uppercaseEl, lowercaseEl, numbersEl, symbolsEl].forEach(checkbox => {
    checkbox.addEventListener("change", createPassword);
});

function createPassword() {
    const length = parseInt(lengthSliderEl.value);
    const useUppercase = uppercaseEl.checked;
    const useLowercase = lowercaseEl.checked;
    const useNumbers = numbersEl.checked;
    const useSymbols = symbolsEl.checked;

    if (!useUppercase && !useLowercase && !useNumbers && !useSymbols) {
        alertContainerEl.innerText = "Select at least one character type!";
        alertContainerEl.classList.remove("active");
        setTimeout(() => alertContainerEl.classList.add("active"), 2000);
        inputEl.value = "";
        updateStrength(0);
        return;
    }

    let chars = "";
    if (useUppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (useLowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (useNumbers) chars += "0123456789";
    if (useSymbols) chars += "!@#$%^&*()_+?:{}[]";

    let password = "";
    for (let i = 0; i < length; i++) {
        const randomNum = Math.floor(Math.random() * chars.length);
        password += chars[randomNum];
    }

    inputEl.value = password;
    updateStrength(calculateStrength(password));
}

function copyPassword() {
    if (!inputEl.value) return;

    inputEl.select();
    navigator.clipboard.writeText(inputEl.value);
    alertContainerEl.innerText = "Password copied!";
    alertContainerEl.classList.remove("active");
    setTimeout(() => alertContainerEl.classList.add("active"), 2000);
}

function calculateStrength(password) {
    let strength = 0;
    if (password.length > 12) strength += 2;
    else if (password.length > 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[!@#$%^&*()_+?:{}[\]]/.test(password)) strength += 1;
    return strength;
}

function updateStrength(strength) {
    strengthBarEl.className = "strength-bar";
    if (strength <= 2) {
        strengthBarEl.classList.add("weak");
        strengthTextEl.textContent = "Weak";
        strengthTextEl.style.color = "#ff4d4d";
    } else if (strength <= 4) {
        strengthBarEl.classList.add("medium");
        strengthTextEl.textContent = "Medium";
        strengthTextEl.style.color = "#ffd700";
    } else {
        strengthBarEl.classList.add("strong");
        strengthTextEl.textContent = "Strong";
        strengthTextEl.style.color = "#28a745";
    }
}