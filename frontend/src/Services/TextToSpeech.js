export const textToSpeech = async (txt) => {
  await initVoices();
  const msg = new SpeechSynthesisUtterance(txt);
  msg.voice = speechSynthesis.getVoices()[33];
  speechSynthesis.speak(msg);
};

const initVoices = () => {
  return new Promise(function (res, rej) {
    speechSynthesis.getVoices();
    if (window.speechSynthesis.onvoiceschanged) {
      res();
    } else {
      window.speechSynthesis.onvoiceschanged = () => res();
    }
  });
};
