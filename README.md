<p align="center">
  <img src="dorker/assets/haxclaw-3d-banner.svg" alt="haxclaw 3D Banner">
</p>

# 🦅 haxclaw // ADVANCED RECON ENGINE


![Version](https://img.shields.io/badge/version-1.0.1-blue.svg)
![Theme](https://img.shields.io/badge/theme-dark/light-success.svg)
[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen.svg)](https://lulublackhat.rf.gd/)

> **PREMIUM RECONNAISSANCE SUITE — PROFESSIONAL EDITION**

**haxclaw** is a comprehensive, client-side web application designed for security researchers, penetration testers, and bug bounty hunters. It acts as a centralized command center for your reconnaissance workflow, combining an extensive Google Dorking engine with a structured bug bounty methodology, custom tools, and session management.

🌐 **Live Demo:** [https://lulublackhat.rf.gd/](https://lulublackhat.rf.gd/)

---

## 🔥 Key Features

### 🎯 Advanced Dork Engine
Fire complex, curated Google Dorks directly from your browser. 
- **Categories:** Recon, Files, Vulnerabilities, CMS, Cloud, API, OSINT, and Web Archive.
- **Bulk Launch:** Fire all dorks for a specific category with a single click (with built-in rate-limit delays).
- **Search & Filter:** Instantly find the exact dork you need.

### 📋 Bug Bounty Methodology Guide
A step-by-step, actionable recon methodology with copy-paste commands for industry-standard tools.
- Auto-generates commands for your specific target domain.
- Covers Subdomain Discovery, Port Scanning, HTTP Probing, Vulnerability Scanning, JS Analysis, and more.

### 🔧 Custom Dork Builder
Build, test, and save your own custom dorks using intuitive dropdowns and inputs (e.g., `site:`, `inurl:`, `intitle:`).

### 🛠️ Built-in Recon Tools
- **Scope Checker:** Paste your in-scope domains/wildcards and instantly verify if a specific URL is in scope.
- **Notes & Checklist:** Keep track of your progress and findings natively within the app.
- **Export System:** Export your dork history, notes, and targets to TXT, MD, JSON, or Raw URLs.

### 💻 Pro Workflows
- **Target Management:** Save multiple targets and switch between them instantly.
- **Favorites:** Star your most-used dorks for quick access.
- **Keyboard Shortcuts:** Power-user friendly (e.g., `Ctrl+K` to focus target, `1-0` for tabs).
- **Dark/Light Mode:** First-class premium UI adaptable to your preference.

---

## 🚀 Getting Started

Since **haxclaw** is entirely client-side, getting started is as simple as opening the `index.html` file or visiting the live URL.

### Local Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/dorker.git
   ```
2. Open the directory:
   ```bash
   cd dorker
   ```
3. Open `index.html` in your favorite modern web browser.

No servers, no databases, no dependencies. All state (history, targets, notes) is saved locally in your browser using `localStorage`.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
| :--- | :--- |
| `Ctrl` + `K` | Focus target input |
| `Ctrl` + `F` | Search dorks |
| `Ctrl` + `1-0` | Switch between tabs |
| `Ctrl` + `S` | Save current target |
| `Escape` | Close modals / cancel launch |
| `?` | Show shortcuts overlay |

---

## 📁 Project Structure

```text
dorker/
├── index.html          # Main application UI
├── README.md           # Documentation
├── css/
│   └── styles.css      # Premium styling, variables, theme logic
├── js/
│   ├── app.js          # Core application logic & state management
│   ├── builder.js      # Custom dork builder functionality
│   ├── dork-engine.js  # Dedicated dork launching logic
│   ├── methodology.js  # Dynamic command generation for recon
│   ├── utils.js        # Helper functions & shared utilities
│   └── data/
│       └── dorks.js    # Curated JSON array of all Google Dorks
└── pages/
    ├── exploits.html   # Exploit and PoC search functionality
    └── methodology.html # Detailed methodology steps and commands
```

---

## ⚠️ Disclaimer

**haxclaw** is built for educational and professional security testing purposes only. You must have explicit permission to scan, test, or exploit any systems you target using this tool. The creator is not responsible for any misuse or legal consequences caused by the use of this software.

---

<p align="center">
  Built with 🖤 for the Bug Bounty Community.
</p>
