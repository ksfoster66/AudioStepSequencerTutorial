import { useState, useRef, forwardRef, useImperativeHandle } from "react";

const Noise = forwardRef(({ audioContext }, ref) => {
  const [noiseDuration, setNoiseDur] = useState(1);
  const [bandHz, setBandHz] = useState(1000);

  useImperativeHandle(ref, ()=>{
    return { play(time){
      playNoise(time)
    }}
  });

  function playNoise(time) {
    const bufferSize = audioContext.sampleRate * noiseDuration;

    const noiseBuffer = new AudioBuffer({
      length: bufferSize,
      sampleRate: audioContext.sampleRate,
    });

    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = new AudioBufferSourceNode(audioContext, {
      buffer: noiseBuffer,
    });

    const bandpass = new BiquadFilterNode(audioContext, {
      type: "bandpass",
      frequency: bandHz,
    });

    noise.connect(bandpass).connect(audioContext.destination);
    noise.start(time);
  }

  function handleDurationChange(e){
    e.preventDefault();
    setNoiseDur(e.target.value);
  }

  function handleBandHzChange(e){
    e.preventDefault();
    setBandHz(e.target.value)
  }

  return (
    <>
      <h2>Noise</h2>
      <section className="controls">

      <label htmlFor="duration">Dur</label>
      <input
        name="duration"
        id="duration"
        type="range"
        min="0"
        max="1"
        value={noiseDuration}
        step="0.1"
        onChange={handleDurationChange}
        />

      <label htmlFor="band">Band</label>
      <input
        name="band"
        id="band"
        type="range"
        min="400"
        max="1200"
        value={bandHz}
        step="5"
        onChange={handleBandHzChange}
        />
        </section>
    </>
  );
})

export default Noise;
