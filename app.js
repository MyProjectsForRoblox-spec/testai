const messagesDiv = document.getElementById("messages");
const inputEl = document.getElementById("userInput");
const modelSelect = document.getElementById("modelSelect");
const personalitySelect = document.getElementById("personalitySelect");
let recognizing = false;

// 💬 Load history
function loadChat() {
  messagesDiv.innerHTML = localStorage.getItem("chatLog") || "";
}

// 💾 Save chat
function saveChat() {
  localStorage.setItem("chatLog", messagesDiv.innerHTML);
}

// 💭 Add message
function addMessage(text, className) {
  const msg = document.createElement("div");
  msg.className = `message ${className}`;
  msg.innerHTML = marked.parse(text);
  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  saveChat();
  if (className === "bot") speak(text);
}

// ✍️ Typing animation
function addTyping() {
  const typing = document.createElement("div");
  typing.id = "typing";
  typing.className = "message bot";
  typing.textContent = "Typing...";
  messagesDiv.appendChild(typing);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}
function removeTyping() {
  const t = document.getElementById("typing");
  if (t) t.remove();
}

// 🎭 Personality prompt
function getSystemPrompt() {
  const style = personalitySelect.value;
  if (style === "sarcastic") return "Respond sarcastically.";
  if (style === "poetic") return "Respond with poetic, metaphorical language.";
  return null;
}

// 🤖 OpenAI call
async function fetchFromAPI(userText) {
  const model = modelSelect.value;

  if (model === "mock") {
    return "🌐 This is a mock response. Replace with real API.";
  }

  const messages = [];
  const sysPrompt = getSystemPrompt();
  if (sysPrompt) messages.push({ role: "system", content: sysPrompt });
  messages.push({ role: "user", content: userText });

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

    if (data.choices?.[0]?.message?.content) {
      return data.choices[0].message.content;
    } else if (data.error?.message) {
      return `⚠️ OpenAI Error: ${data.error.message}`;
    } else {
      return "⚠️ Unexpected response format.";
    }
  } catch (err) {
    return `❌ API Request Failed: ${err.message}`;
  }
}

// 🧠 Send message
function sendMessage() {
  const text = inputEl.value.trim();
  if (!text) return;
  addMessage(text, "user");
  inputEl.value = "";
  addTyping();

  setTimeout(async () => {
    const reply = await fetchFromAPI(text);
    removeTyping();
    addMessage(reply, "bot");
  }, 400);
}

// 🧹 New chat
function clearChat() {
  messagesDiv.innerHTML = "";
  localStorage.removeItem("chatLog");
}

// 📄 Export
function exportChat() {
  const blob = new Blob([messagesDiv.innerText], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "chat-history.txt";
  a.click();
}

// 🎤 Voice input
function toggleVoice() {
  if (!("webkitSpeechRecognition" in window)) {
    alert("Speech input not supported.");
    return;
  }

  const rec = new webkitSpeechRecognition();
  rec.lang = "en-US";
  rec.continuous = false;
  rec.interimResults = false;

  rec.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    inputEl.value = transcript;
    sendMessage();
  };

  rec.onerror = () => (recognizing = false);
  rec.onend = () => (recognizing = false);

  if (!recognizing) {
    rec.start();
    recognizing = true;
  } else {
    rec.stop();
    recognizing = false;
  }
}

// 📢 Read reply aloud
function speak(text) {
  const synth = window.speechSynthesis;
  synth.cancel();
  synth.speak(new SpeechSynthesisUtterance(text));
}

// 🌗 Theme toggle
function toggleTheme() {
  document.body.classList.toggle("light");
}

// 📦 Floating mode toggle
function toggleFloating() {
  document.body.classList.toggle("floating");
}

// ⌨️ Send on Enter
inputEl.addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});

// Load chat + auto-theme
window.onload = () => {
  loadChat();
  if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    document.body.classList.add("light");
  }
};
