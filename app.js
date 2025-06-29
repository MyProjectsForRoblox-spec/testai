const messagesDiv = document.getElementById("messages");
const inputEl = document.getElementById("userInput");
const modelSelect = document.getElementById("modelSelect");
const personalitySelect = document.getElementById("personalitySelect");
const chatContainer = document.getElementById("chatContainer");
let recognizing = false;
const synth = window.speechSynthesis;

function addMessage(text, className) {
  const msg = document.createElement("div");
  msg.className = `message ${className}`;
  msg.innerHTML = marked.parse(text);
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  saveChat();
  if (className === "bot") speak(text);
}

function simulateBotReply(text) {
  const style = personalitySelect.value;
  const templates = {
    default: `Got it! What's next?`,
    sarcastic: `Oh wow, you're so original. 😐`,
    poetic: `Ah, your words arrive like thunderclouds in bloom.`,
  };
  return templates[style] || templates["default"];
}

function fetchFromAPI(userText) {
  const model = modelSelect.value;
  switch (model) {
    case "mock":
      return simulateBotReply(userText);
    case "local":
      return `Pretending to call local model: "${userText}"`;
    case "api1":
      return `Mock reply from API #1 for: "${userText}"`;
    default:
      return `Model not supported.`;
  }
}

function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;
  addMessage(text, "user");
  inputEl.value = "";
  addTypingIndicator();
  setTimeout(() => {
    removeTypingIndicator();
    const reply = fetchFromAPI(text);
    addMessage(reply, "bot");
  }, 800);
}

function addTypingIndicator() {
  const typing = document.createElement("div");
  typing.className = "message bot";
  typing.id = "typing";
  typing.textContent = "Typing...";
  messagesDiv.appendChild(typing);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function removeTypingIndicator() {
  const typing = document.getElementById("typing");
  if (typing) typing.remove();
}

function clearChat() {
  messagesDiv.innerHTML = "";
  localStorage.removeItem("chatLog");
}

function saveChat() {
  localStorage.setItem("chatLog", messagesDiv.innerHTML);
}

function loadChat() {
  messagesDiv.innerHTML = localStorage.getItem("chatLog") || "";
}

function exportChat() {
  const blob = new Blob([messagesDiv.innerText], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "chat-history.txt";
  link.click();
}

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  synth.speak(utter);
}

function toggleVoice() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Voice recognition not supported.");
    return;
  }
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const rec = new SpeechRecognition();
  rec.lang = "en-US";
  rec.continuous = false;
  rec.interimResults = false;

  if (!recognizing) {
    rec.start();
    recognizing = true;

    rec.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      inputEl.value = transcript;
      sendMessage();
    };

    rec.onend = () => (recognizing = false);
  } else {
    rec.stop();
    recognizing = false;
  }
}

function toggleTheme() {
  document.body.classList.toggle("light");
}

function toggleFloating() {
  document.body.classList.toggle("floating");
}

document.getElementById("userInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

window.matchMedia("(prefers-color-scheme: light)").matches &&
  document.body.classList.add("light");

loadChat();
