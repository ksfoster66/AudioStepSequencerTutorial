import { useState, forwardRef, useImperativeHandle } from "react";

import dialTone from "../assets/dtmf.mp3";

async function createBuffer(audioContext) {
  const response = await fetch(dialTone);
  const arrayBuffer = await response.arrayBuffer();
  const buffer = await audioContext.decodeAudioData(arrayBuffer);
  return buffer;
}

const DialUp = forwardRef(function DialUp({ audioContext }, ref) {
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioBuffer = createBuffer(audioContext);

  useImperativeHandle(ref, () => {
    return {
      play(time) {
        playSample(time);
      },
    };
  });

  function playSample(time) {
    audioBuffer.then((buffer) => {
      const sampleSource = new AudioBufferSourceNode(audioContext, {
        buffer: buffer,
        playbackRate: playbackRate,
      });

      sampleSource.connect(audioContext.destination);
      sampleSource.start(time);

      return sampleSource;
    });
  }

  function handlePlaybackRateChange(e) {
    e.preventDefault();
    setPlaybackRate(e.target.value);
  }

  return (
    <>
        <h2>DTMF</h2>
        <section className="controls">

      <label htmlFor="rate">Rate</label>
      <input
        name="rate"
        id="rate"
        type="range"
        min="0.1"
        max="2"
        value={playbackRate}
        step="0.1"
        onChange={handlePlaybackRateChange}
        />
        </section>
    </>
  );
});

export default DialUp;
