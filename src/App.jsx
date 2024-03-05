import { useState } from "react";
import "./App.css";
import Sequencer from "./components/Sequencer";
import Header from "./components/Header";

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [tempo, setTempo] = useState(60);

  const updateTempo = (newTempo) => {
    setTempo(newTempo);
  };

  const updateIsPlaying = () => {
    setIsPlaying((prevState) => !prevState);
    console.log("click")
  };

  return (
    <div id="sequencer">
      <Header
        appTempo={tempo}
        updateTempo={updateTempo}
        isPlaying={isPlaying}
        updateIsPlaying={updateIsPlaying}
      />
      <Sequencer tempo={tempo} isPlaying={isPlaying} />
    </div>
  );
}

export default App;
