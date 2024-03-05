import { useState, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import { wavetable } from "../wavetable";

const Sweep = forwardRef(function Sweep({ audioContext }, ref) {
  const [attackTime, setAttackVal] = useState(0.2);
  const [releaseTime, setReleaseVal] = useState(0.5);
  const osc = useRef();

 useImperativeHandle(ref, ()=> {
  return{
    play(time){
      playSweep(time)
    }
  }
 })

  const wave = new PeriodicWave(audioContext, {
    real: wavetable.real,
    imag: wavetable.imag,
  });

  function playSweep(time) {
    const sweepLength = 2;
    osc.current = new OscillatorNode(audioContext, {
      frequency: 380,
      type: "custom",
      periodicWave: wave,
    });
    const sweepEnv = new GainNode(audioContext);
    sweepEnv.gain.cancelScheduledValues(time);
    sweepEnv.gain.setValueAtTime(0, time);
    sweepEnv.gain.linearRampToValueAtTime(1, time + attackTime);
    sweepEnv.gain.linearRampToValueAtTime(0, time + sweepLength - releaseTime);

    osc.current.connect(sweepEnv).connect(audioContext.destination);
    osc.current.start(time);
    osc.current.stop(time + sweepLength);
  }

  function handleAttackChange(e) {
    e.preventDefault();

    setAttackVal(e.target.value);
  }

  function handleReleaseChange(e) {
    e.preventDefault();

    setReleaseVal(e.target.value);
  }

  return (
    <>
      <h2>Sweep</h2>
      <section className="controls">

      <label htmlFor="attack">Att</label>
      <input
        name="attack"
        id="attack"
        type="range"
        min="0"
        max="1"
        value={attackTime}
        step="0.1"
        onChange={handleAttackChange}
        />

      <label htmlFor="release">Rel</label>
      <input
        name="release"
        id="release"
        type="range"
        min="0"
        max="1"
        value={releaseTime}
        step="0.1"
        onChange={handleReleaseChange}
        />
        </section>
    </>
  );
})

export default Sweep;
