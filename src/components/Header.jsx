import { useState } from "react";

function Header({ appTempo, updateTempo, isPlaying, updateIsPlaying }) {
  const [tempo, setTempo] = useState(120);

  function handleTempoChange(e) {
    e.preventDefault();

    setTempo(e.target.value);
    updateTempo(e.target.value);
  }

  return (
    <header>
      <section className="controls-main">
        <h1>ModemDN</h1>
        <label htmlFor="bpm">BPM</label>
        <input
          name="bpm"
          id="bpm"
          type="range"
          min="60"
          max="180"
          value={tempo}
          step="1"
          onChange={handleTempoChange}
        />
        <span id="bpmval">{tempo}</span>
        <input type="checkbox" id="playBtn" onClick={updateIsPlaying}/>
        <label htmlFor="playBtn">Play</label>
      </section>
    </header>
  );
}

export default Header;
