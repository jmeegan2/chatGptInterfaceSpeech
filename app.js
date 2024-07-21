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
  try {
    const response = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text: speechResult }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const blob = await response.blob();

    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Play the audio directly
    const audio = new Audio(url);
    audio.play().catch(error => {
      console.error('Error playing audio:', error);
    });

    console.log('Audio playing successfully');

  } catch (error) {
    console.error('Fetch error:', error);
  }
}


function playAudio(filename) {
  var audio = new Audio(filename);
  audio.play();  
}
