let waitingForResponse = false

document.addEventListener('DOMContentLoaded', (event) => {
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Space') {
      listen();
    }
  });
});

function listen() {
  if (waitingForResponse) return
  console.log('listen');
  const robotHead = document.getElementById('robotHead');
  
  // Switch to talking animation
  robotHead.style.animation = 'talking 1s infinite alternate';

  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.start();

  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    console.log('Result: ', speechResult);
    waitingForResponse = true;
    callServer(speechResult); 
  };

  recognition.onspeechend = () => {
    recognition.stop();
    // Switch back to idle animation
    robotHead.style.animation = 'idle 1s infinite alternate';
  };

  recognition.onerror = (event) => {
    console.error('Error occurred in recognition: ', event.error);
    // Switch back to idle animation in case of error
    robotHead.style.animation = 'idle 1s infinite alternate';
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
    const url = window.URL.createObjectURL(blob);
    const audio = new Audio(url);

    audio.addEventListener('play', () => {
      document.getElementById('robotHead').style.animation = 'talking 0.5s infinite alternate';
    });

    audio.addEventListener('ended', () => {
      document.getElementById('robotHead').style.animation = 'idle 1s infinite alternate';
      window.URL.revokeObjectURL(url); // Revoke after playing
    });

    await audio.play();
    waitingForResponse = false
    console.log('Audio is playing');
  } catch (error) {
    console.error('Fetch error or audio play error:', error);
  }
}


