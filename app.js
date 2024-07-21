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
    playAudio(data.speechChatGPT);
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
}

function playAudio(speechChatGPT) {
  console.log(speechChatGPT.type)
  const audioData = atob(speechChatGPT); // Decode base64 to binary string
  const arrayBuffer = new ArrayBuffer(audioData.length);
  const uintArray = new Uint8Array(arrayBuffer);
  for (let i = 0; i < audioData.length; i++) {
    uintArray[i] = audioData.charCodeAt(i);
  }
  const blob = new Blob([uintArray], { type: 'audio/wav' }); // Use appropriate MIME type
  const url = URL.createObjectURL(blob);
  const audio = new Audio(url);
  audio.play();
}
