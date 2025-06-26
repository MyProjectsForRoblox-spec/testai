function sendMessage() {
    const userInput = document.getElementById('user-input').value.toLowerCase().trim();
    const chatOutput = document.getElementById('chat-output');

    // Display user message
    chatOutput.innerHTML += `<p><strong>You:</strong> ${userInput}</p>`;

    // Process response
    let response = '';
    if (userInput === 'hi') {
        response = `Hi! I'm Grok-AI, your nerdy companion built by a coder for coders. I can chat with you about anything and generate stunning images based on your descriptions. Try saying something or describe an image in the generation section below!`;
    } else {
        response = `Hey, I got your message: "${userInput}". I'm Grok-AI, here to chat and create awesome images. Want to talk code or generate a visual masterpiece?`;
    }

    // Display AI response
    chatOutput.innerHTML += `<p><strong>Grok-AI:</strong> ${response}</p>`;

    // Clear input and scroll to bottom
    document.getElementById('user-input').value = '';
    chatOutput.scrollTop = chatOutput.scrollHeight;
}

// Allow pressing Enter to send message
document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});
