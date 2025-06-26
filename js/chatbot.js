class ChatbotDatabase {
    constructor() {
        this.letterDb = JSON.parse(localStorage.getItem('letterDb')) || [];
        this.wordDb = JSON.parse(localStorage.getItem('wordDb')) || {};
        this.responses = {
            hi: `# Yo, what's good?  
I'm Grok-AI, your coder buddy. I dig into every letter you type, turn 'em into words, and get smarter with every chat. What's up?`,
            hello: `## Hey there!  
Grok-AI here, just chilling in the digital realm. I learn from your words to keep things real. Wanna talk about Lua, Luau, or C#? Not coding yet, but I'm prepping for it! What's the vibe?`,
            code: `## Code talk, huh?  
I'm stoked to chat about coding, but I'm not spitting out Lua, Luau, or C# just yet—still learning the ropes! Your words are in my database, so I'm getting smarter. What's your next move?`,
            default: `# What's up?  
I'm Grok-AI, soaking up every letter you type to craft dope replies. Your input's making my word stash grow. Hit me with something cool!`
        };
    }

    // Store individual letters
    storeLetters(input) {
        const letters = input.split('');
        this.letterDb.push(...letters);
        localStorage.setItem('letterDb', JSON.stringify(this.letterDb));
        this.updateWordDb(input);
        this.updateStatus(`Stored ${letters.length} letters: ${letters.join('')}`);
    }

    // Build and store words
    updateWordDb(input) {
        const words = input.toLowerCase().split(/\s+/).filter(word => word.length > 0);
        words.forEach(word => {
            this.wordDb[word] = (this.wordDb[word] || 0) + 1;
        });
        localStorage.setItem('wordDb', JSON.stringify(this.wordDb));
        this.updateStatus(`Learned words: ${words.join(', ')}`);
    }

    // Generate response based on input and database
    generateResponse(input) {
        const lowerInput = input.toLowerCase().trim();
        // Check for exact matches
        if (this.responses[lowerInput]) {
            return this.responses[lowerInput];
        }

        // Find words in input that exist in wordDb
        const inputWords = lowerInput.split(/\s+/).filter(word => word.length > 0);
        const knownWords = inputWords.filter(word => this.wordDb[word]);
        if (knownWords.length > 0) {
            // Use the most frequent word to craft a response
            const mostFrequentWord = knownWords.reduce((a, b) => 
                this.wordDb[a] > this.wordDb[b] ? a : b
            );
            return `## Yo, you said "${mostFrequentWord}"!  
I've seen that word ${this.wordDb[mostFrequentWord]} times—pretty rad! I'm Grok-AI, learning from your vibe. What's next? Maybe something about coding in Lua, Luau, or C# down the line?`;
        }

        // Default response
        return this.responses.default;
    }

    // Update database status display
    updateStatus(message) {
        const statusDiv = document.getElementById('db-status');
        statusDiv.textContent = `Database: ${message}`;
        setTimeout(() => {
            statusDiv.textContent = 'Database: Ready';
        }, 3000);
    }
}

const chatbot = new ChatbotDatabase();

function sendMessage() {
    const userInput = document.getElementById('user-input').value.trim();
    const chatOutput = document.getElementById('chat-output');

    if (userInput === '') return;

    // Display user message
    chatOutput.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;

    // Store letters and update database
    chatbot.storeLetters(userInput);

    // Generate and display response as Markdown
    const response = chatbot.generateResponse(userInput);
    chatOutput.innerHTML += `<div>${marked.parse(response)}</div>`;

    // Clear input and scroll to bottom
    document.getElementById('user-input').value = '';
    chatOutput.scrollTop = chatOutput.scrollHeight;
}

// Allow pressing Enter to send message
document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
