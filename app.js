document.getElementById('start-recognition').addEventListener('click', () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  
    recognition.start();
  
    recognition.onresult = (event) => {
      const speechResult = event.results[0][0].transcript;
      console.log('Result: ', speechResult);
  
      // Send the recognized text to the server
      fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: speechResult }),
      })
      .then(response => response.json())
      .then(data => {
        const responseText = data.response;
        document.getElementById('output').innerText = responseText;
  
        // Use the Web Speech API for TTS
        const utterance = new SpeechSynthesisUtterance(responseText);
        window.speechSynthesis.speak(utterance);
      })
      .catch(error => {
        console.error('Error:', error);
      });
    };
  
    recognition.onspeechend = () => {
      recognition.stop();
    };
  
    recognition.onerror = (event) => {
      console.error('Error occurred in recognition: ', event.error);
    };
  });