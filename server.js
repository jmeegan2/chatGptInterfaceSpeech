const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');  // Add this line

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());  // Add this line

app.post('/chat', async (req, res) => {
  const userInput = req.body.text;
  console.log(userInput)

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4',
      messages: [
        { 
            role: 'user', 
        content: userInput 
    }
]
    }, {
      headers: {
        'Authorization': '',
        'Content-Type': 'application/json'
      }
    });

    const botResponse = response.data.choices[0].message.content;
    res.json({ response: botResponse });
  } catch (error) {
    console.log(error)
    console.error('Error communicating with OpenAI API:', error.message);

    // Send back the error message in JSON format
    res.status(500).json({ error: 'Error communicating with OpenAI API', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});