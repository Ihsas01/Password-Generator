SecurePass Forge
Introduction
SecurePass Forge is a modern, user-friendly web application designed to generate highly secure and customizable passwords. With a sleek, glassmorphism-inspired interface, it offers advanced features like cryptographically secure password generation, personalized passwords based on user input (name and custom word), a password history tracker, and a light/dark theme toggle. The application also provides real-time feedback on password strength and entropy, ensuring users create robust passwords with ease.
Features

Secure Password Generation: Utilizes crypto.getRandomValues for cryptographically secure random character selection.
Personalization: Incorporates user's name and custom word into the password for a personalized touch.
Password History: Stores and displays the last 5 generated passwords with a copy feature.
Theme Toggle: Supports light and dark modes, with preferences saved in local storage.
Strength & Entropy Feedback: Displays password strength (Weak/Medium/Strong) and entropy in bits for security insights.
Beautiful UI: Features a glassmorphism design, smooth animations, and a vibrant color scheme with Tailwind CSS and custom styling.

Getting Started

Clone the Repository:git clone <https://github.com/Ihsas01/Password-Generator>

webSite Link - https://password-generator-bice-rho.vercel.app


Open index.html:
Serve the project using a local server (e.g., npx live-server) or open index.html directly in a modern browser.


Dependencies:
No local dependencies required; uses CDN-hosted Tailwind CSS and Font Awesome.
Ensure an internet connection for loading external resources (Google Fonts, Tailwind CSS, Font Awesome).



Usage

Enter your name and/or a custom word to personalize the password.
Adjust the password length using the slider (8-30 characters).
Select character types (uppercase, lowercase, numbers, symbols) via checkboxes.
Click "Generate Password" to create a new password.
Copy the generated password or any from the history list.
Toggle between light and dark themes using the moon/sun icon.

Technologies

HTML5: Structure of the web application.
JavaScript: Core functionality, including secure password generation and event handling.
Tailwind CSS: Responsive and modern styling.
CSS: Custom animations and glassmorphism effects.
Font Awesome: Icons for copy and theme toggle.
Google Fonts: Inter font for enhanced typography.


