const messagesDiv = document.getElementById("messages");
const inputEl = document.getElementById("userInput");
const modelSelect = document.getElementById("modelSelect");
const personalitySelect = document.getElementById("personalitySelect");
const chatContainer = document.getElementById("chatContainer");
let recognizing = false;
const synth = window.speechSynthesis;

// 💬 Load chat history
function loadChat() {
  messagesDiv.innerHTML = localStorage.getItem("chatLog") || "";
}

// 💾 Save chat history
function saveChat() {
  localStorage.setItem("chatLog", messagesDiv.innerHTML);
}

// 🧠 Add message to chat
function addMessage(text, className) {
  const msg = document.createElement("div");
  msg.className = `message ${className}`;
  msg.innerHTML = marked.parse(text);
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  saveChat();
  if (className === "bot") speak(text);
}

// ✍️ Typing indicator
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

// 🧠 Prompt personality wrapper
function getPersonalityPrefix() {
  const tone = personalitySelect.value;
  switch (tone) {
    case "sarcastic":
      return "Respond sarcastically:";
    case "poetic":
      return "Respond like a poetic storyteller:";
    default:
      return "";
  }
}

async function fetchFromAPI(userText) {
  const promptPrefix = getPersonalityPrefix();
  const messages = [
    ...(promptPrefix ? [{ role: "system", content: promptPrefix }] : []),
    { role: "user", content: userText }
  ];

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages
      })
    });

    const data = await res.json();

    if (data.choices && data.choices[0]?.message?.content) {
      return data.choices[0].message.content;
    } else if (data.error?.message) {
      return `⚠️ OpenAI Error: ${data.error.message}`;
    } else {
      return "⚠️ Unexpected response format.";
    }

  } catch (error) {
    return `❌ API Request Failed: ${error.message}`;
  }
}


// 🚀 Send message
function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;

  addMessage(text, "user");
  inputEl.value = "";
  addTypingIndicator();

  setTimeout(async () => {
    const reply = await fetchFromAPI(text);
    removeTypingIndicator();
    addMessage(reply, "bot");
  }, 600);
}

// 🎙 Speech synthesis
function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  synth.cancel();
  synth.speak(utter);
}

// 🎤 Voice input
function toggleVoice() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Speech recognition not supported.");
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

    rec.onresult = function (event) {
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

// 🎨 Theme toggling
function toggleTheme() {
  document.body.classList.toggle("light");
}

// 🧊 Floating chat mode
function toggleFloating() {
  document.body.classList.toggle("floating");
}

// 🗑 Clear chat history
function clearChat() {
  messagesDiv.innerHTML = "";
  localStorage.removeItem("chatLog");
}

// 📤 Export chat as .txt
function exportChat() {
  const blob = new Blob([messagesDiv.innerText], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "chat-history.txt";
  link.click();
}

// 🧠 Init
document.getElementById("userInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

if (window.matchMedia("(prefers-color-scheme: light)").matches) {
  document.body.classList.add("light");
}

loadChat();
