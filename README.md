# Grok-AI: Chat & Image Generation
**A nerdy, human-like chatbot with Markdown support and image generation, hosted on GitHub Pages.
Features**

*Chatbot:* **Processes every letter of input, builds a word database, and responds in a casual, coder-friendly tone using Markdown formatting (e.g., # Yo!). Prepares for future support of Lua, Luau, and C#.
Image Generation: Simulates advanced image generation with Three.js and HTML overlays (e.g., "cat with a detective hat").
UI: Dark theme with neon accents, Markdown-rendered chat output.**

# Setup

**Clone this repository: git clone https://github.com/your-username/testai.git**
**Ensure all files are in the correct directory structure.**
**Download three.min.js from https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js and place it in js/.**
**Download marked.min.js from https://cdn.jsdelivr.net/npm/marked/marked.min.js and place it in js/.**
**Download the OpenAI logo from https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg and place it in assets/.**
**Push to GitHub: git push origin main.**
**Enable GitHub Pages (Settings > Pages > Source: Deploy from a branch > Branch: main > Save).**
**Access your site at https://your-username.github.io/testai.**

# Troubleshooting

**Error: Uncaught ReferenceError: generateImage is not defined:**
**Ensure imageGeneration.js includes window.generateImage = generateImage;.**
**Verify js/imageGeneration.js is loaded in index.html.**


**Error: Content unavailable. Resource was not cached:**
**Check that all files (css/styles.css, js/three.min.js, js/marked.min.js, js/chatbot.js, js/imageGeneration.js, assets/openai-logo.svg) are present.**
**Verify file paths in index.html.**
**Trigger a redeploy: git commit -m "Trigger redeploy" && git push.**
**Check browser Network tab for 404 errors.**


**Markdown Not Rendering:**
**Ensure marked.min.js is loaded before chatbot.js.**



# Usage

*Chat:* **Type "hi" for a greeting or any message to build the database and get a human-like, Markdown-formatted response.
Image Generation: Enter a prompt like "cat with a detective hat" and click "Generate" for a 3D rendering.**
