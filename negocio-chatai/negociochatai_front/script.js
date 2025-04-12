const sendButton = document.querySelector("#sendButton");
const mesageContainer = document.querySelector(".chat__messages");
const input = document.querySelector("#inputText")
const userId = Date.now() + Math.floor(Math.random() * 1000); // Generar un ID de usuario único

const sendMessage = async() =>{
  
  const myMesage = input.value.trim();

  if (!myMesage) return false;

  mesageContainer.innerHTML += `
    <div class="chat__message chat__message--user">Yo: ${myMesage}</div>`;

  input.value = ""; // Limpiar el campo de entrada
  mesageContainer.scrollTop = mesageContainer.scrollHeight; // Desplazar hacia abajo

  //añadir mensaje de escribiendo
  setTimeout(() => {
    mesageContainer.innerHTML += `
      <div class="chat__message--typing loader">`;
      mesageContainer.scrollTop = mesageContainer.scrollHeight; // Desplazar hacia abajo
  }, 1000);


  try {
    const response = await fetch("http://localhost:3000/api/chatbot", {
      method: "POST",
      headers: { "Content-Type": "application/json"},
      body: JSON.stringify({
            userId, 
            message: myMesage 
      }),
    })

    const data = await response.json();

    document.querySelector(".chat__message--typing").remove(); // Eliminar el mensaje de escribiendo

    mesageContainer.innerHTML += `
      <div class="chat__message chat__message--bot">Amber: ${data.reply}</div>`;
    
  } catch (error) {
    console.error("Error:", error);
    
  }
  mesageContainer.scrollTop = mesageContainer.scrollHeight;
}

sendButton.addEventListener("click", sendMessage);
input.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault(); // Evitar el envío del formulario
    sendMessage();
  }
});
