import { useState, forwardRef, useImperativeHandle } from "react";

const Pulse = forwardRef(function Pulse({audioContext}, ref) {
  const [hzVal, setHzVal] = useState(880);
  const [lfoVal, setLfoVal] = useState(30);

  useImperativeHandle(ref, ()=>{
    return{
      play(time){
        playPulse(time)
      }
    }
  })

const pulseTime = 1;
function playPulse(time) {
  const osc = new OscillatorNode(audioContext, {
    type: "sine",
    frequency: hzVal,
  });

  const amp = new GainNode(audioContext, {
    value: 1,
  });

  const lfo = new OscillatorNode(audioContext, {
    type: "square",
    frequency: lfoVal,
  });

  lfo.connect(amp.gain);
  osc.connect(amp).connect(audioContext.destination);
  lfo.start();
  osc.start(time);
  osc.stop(time + pulseTime);
}

  function handleHzChange(e) {
    e.preventDefault();
    setHzVal(e.target.value);
  }

  function handleLfoChange(e) {
    e.preventDefault();
    setLfoVal(e.target.value);
  }
  return (
    <>
      <h2>Pulse</h2>
      <section className="controls">

      <label htmlFor="hz">Hz</label>
      <input
        name="hz"
        id="hz"
        type="range"
        min="660"
        max="1320"
        value={hzVal}
        step="1"
        onChange={handleHzChange}
        />
      <label htmlFor="lfo">LFO</label>
      <input
        name="lfo"
        id="lfo"
        type="range"
        min="20"
        max="40"
        value={lfoVal}
        step="1"
        onChange={handleLfoChange}
        />
        </section>
    </>
  );
})

export default Pulse;
