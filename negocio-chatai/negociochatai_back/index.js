const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // Para manejar variables de entorno

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(cors()); // Habilitar CORS para todas las rutas
app.use(express.json());

// Configuración de la API de DeepSeek
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'tu_api_key_aquí'; // Usa variables de entorno
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';

// Endpoint para enviar mensajes a DeepSeek
app.post('/api/chatbot', async (req, res) => {
  const contexto = `
    Eres un asistente virtual del Supermercado "OLimpica". Tu tarea es ayudar a los usuarios a encontrar información sobre productos y servicios del supermercado. Responde de manera clara y concisa.
    Informacion del supermercado:
    - Nombre: OLimpica
    - Ubicación: Calle el parque, numero 41E esquina, Barranquilla, Atlántico, Colombia
    - Horario: Lunes a Domingo de 8:00 AM a 10:00 PM
    - Productos: Frutas, verduras, carnes, lácteos, panadería, productos de limpieza, productos de cuidado personal, electrodomensticos.
    - Marcas: Coca-Cola, Pepsi, Nestlé, Colechera, Bimbo, Colgate-Palmolive, Samurai, Kaley.
    - Metodos de pago: Efectivo, tarjeta de crédito, tarjeta de débito, pago móvil.
    Solo responde con la información que te he proporcionado. No hagas suposiciones ni inventes información adicional, responde de la forma mas corta y directa usando los minimos de tokens.
  `;

  const { message } = req.body; // Mensaje del cliente
  if (!message) {
    return res.status(400).json({ error: 'El mensaje es requerido.' });
  }

  try {
    const response = await axios.post(DEEPSEEK_API_URL, {
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: contexto },
        { role: 'user', content: message }
      ],
      max_tokens: 200,
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const reply = response.data.choices[0].message.content;
    res.json({ reply });
    
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    return res.status(500).json({ error: 'Error interno del servidor.' });
    
  }



});

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('¡Servidor de DeepSeek Chat funcionando! 🚀');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});