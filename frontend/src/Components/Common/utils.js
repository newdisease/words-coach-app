export const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const spellTranslatedWord = (text) => {
  const msg = new SpeechSynthesisUtterance();
  const voices = window.speechSynthesis.getVoices();
  const foundVoices = voices.filter((voice) => voice.lang === "en-US");
  msg.voice = foundVoices[2];
  msg.text = text;
  window.speechSynthesis.speak(msg);
};
