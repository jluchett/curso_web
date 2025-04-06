let translateBtn  = document.getElementById("traslateButton");

translateBtn.addEventListener("click", async() => {
    const inputText = document.getElementById("inputText");
    let text = inputText.value.trim();
    let targetLang = document.getElementById("targetLang").value;

    const userMessage = document.createElement("div");
    userMessage.classList.add("chat__message", "chat__message--user");
    userMessage.innerText = text;
    
   const messagesCont = document.querySelector(".chat__messages");
   messagesCont.appendChild(userMessage);
  messagesCont.scrollTop = messagesCont.scrollHeight;

  try {
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, targetLang }),
    });
    
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    
    const data = await response.json();
    const reply = data.reply;
    
    const botMessage = document.createElement("div");
    botMessage.classList.add("chat__message", "chat__message--bot");
    botMessage.innerText = reply;
    
    messagesCont.appendChild(botMessage);
    messagesCont.scrollTop = messagesCont.scrollHeight;
  }
  catch (error) {
    console.error("Error:", error);
    const errorMessage = document.createElement("div");
    errorMessage.classList.add("chat__message", "chat__message--error");
    errorMessage.innerText = "An error occurred while processing your request.";
    
    messagesCont.appendChild(errorMessage);
    messagesCont.scrollTop = messagesCont.scrollHeight;
  }
  
  inputText.value = ""; // Clear the input field after sending the message
  inputText.focus(); // Keep the focus on the input field
     
});