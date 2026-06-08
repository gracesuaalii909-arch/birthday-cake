async function startMicDetection() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();

    analyser.fftSize = 512;
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    let blown = false;

    function detectBlow() {
      analyser.getByteFrequencyData(dataArray);

      let total = 0;

      for (let i = 0; i < dataArray.length; i++) {
        total += dataArray[i];
      }

      const volume = total / dataArray.length;

      console.log("volume:", volume);

      if (volume > 12 && !blown) {
        blown = true;
        blowOutCandles();
      }

      requestAnimationFrame(detectBlow);
    }

    detectBlow();

  } catch (err) {
    alert("Please allow microphone access so you can blow out the candles 💨");
    console.error(err);
  }
}

function blowOutCandles() {
  const candles = document.querySelectorAll(".candle");

  candles.forEach((candle, index) => {
    setTimeout(() => {
      candle.classList.add("blown");
    }, index * 400);
  });

  // change subtitle after candles go out
  setTimeout(() => {
    const subtitle = document.getElementById("subtitle");

    subtitle.textContent =
      "I pray this year brings you peace, happiness, success, and everything you've worked so hard for my love ❤️❤️❤️";

  }, 1800);
}

startMicDetection();