function listen() {
  console.log('listen');
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    console.log('Result: ', speechResult);
    callServer(speechResult); 
  };

  recognition.onspeechend = () => {
    recognition.stop();
  };

  recognition.onerror = (event) => {
    console.error('Error occurred in recognition: ', event.error);
  };
}

async function callServer(speechResult) {
  await fetch('http://localhost:3000/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text: speechResult }),
  })
  .then(response => response.json())
  .then(data => {
    playAudio(data.filename);
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
}

function playAudio(filename) {
  var audio = new Audio(filename);
  audio.play();  
}
