import { useEffect, useRef, useState } from "react";
import Sweep from "./Sweep";
import Pulse from "./Pulse";
import Noise from "./Noise";
import DialUp from "./DialUp";
import Pads from "./Pads";

const AudioContext = window.AudioContext || window.webkitAudioContext;

const lookAhead = 25.0;//Default was 25, seemed slightly too fast, but will readjust as needed
const scheduleAhead = 0.1;

function Sequencer({ tempo, isPlaying }) {
  const [audioContext, setAudioContext] = useState(new AudioContext());
  const nextNoteTime = useRef(0.0);
  const currentNote = useRef(0);
  const lastNoteDrawn = useRef(-1)
  const [noteToDraw, setNoteToDraw] = useState(); 

  const sweepRef = useRef();
  const pulseRef = useRef();
  const noiseRef = useRef();
  const dialRef = useRef();
  audioContext.resume();

  const notesInQueue = useRef([]);
  const timerID = useRef()

  const [sweepPads, setSweepPads] = useState([false, false, false, false])
  const [pulsePads, setPulsePads] = useState([false, false, false, false])
  const [noisePads, setNoisePads] = useState([false, false, false, false])
  const [dialPads, setDialPads] = useState([false, false, false, false])

  function nextNote() {
    const secondsPerBeat = 60.0 / tempo;

    nextNoteTime.current += secondsPerBeat;
    currentNote.current = ((currentNote.current + 1) % 4);
  }

  function scheduleNote(beatNumber, time) {
    notesInQueue.current.push({ note: beatNumber, time });
    console.log(`Scheduing note ${beatNumber} at ${time}`);

    if(sweepPads[beatNumber]) sweepRef.current.play(time);
    if(pulsePads[beatNumber]) pulseRef.current.play(time);
    if(noisePads[beatNumber]) noiseRef.current.play(time);
    if(dialPads[beatNumber]) dialRef.current.play(time);
    
  }

  function scheduler(){
    console.log(`Next Note ${nextNoteTime.current} - Current Time ${audioContext.currentTime}`);
    while (nextNoteTime.current < audioContext.currentTime + scheduleAhead){
        scheduleNote(currentNote.current, nextNoteTime.current);
        nextNote();
    }

    draw();

    timerID.current = setTimeout(scheduler, lookAhead);
  }

  //Needs substantial revision, possibly not needed here at all. Probably can be handled via a prop to the pads
  function draw(){
    let drawNote = lastNoteDrawn.current;
    if(lastNoteDrawn.current === -1) drawNote = 0;

    const currentTime = audioContext.currentTime;
    console.log(notesInQueue.current)

    while (notesInQueue.current.length && notesInQueue.current[0].time < currentTime){
        drawNote = notesInQueue.current[0].note;
        notesInQueue.current.shift()
    }
    //console.log(`Last Note Drawn: ${lastNoteDrawn.current} - Draw Note ${drawNote}`);

    if (lastNoteDrawn.current != drawNote){
        lastNoteDrawn.current = drawNote;
        setNoteToDraw(drawNote);
    }
  }

  useEffect(()=>{
    if (isPlaying){
      console.log("Playing")
      if (audioContext.state === "suspended") audioContext.resume(); 

      currentNote.current = 0;
      nextNoteTime.current = audioContext.currentTime;

      scheduler()
    } else{
      console.log("Pausing")
      clearTimeout(timerID.current);
    }
  }, [isPlaying]);

  return (
    <div id="tracks">
      <section className="track-one">
        <Sweep audioContext={audioContext} ref={sweepRef} />
        <Pads vals={sweepPads} setVals={setSweepPads} currentNote={noteToDraw}/>
      </section>
      <section className="track-two">
        <Pulse audioContext={audioContext} ref={pulseRef} />
        <Pads vals={pulsePads} setVals={setPulsePads} currentNote={noteToDraw}/>
      </section>
      <section className="track-three">
        <Noise audioContext={audioContext} ref={noiseRef} />
        <Pads vals={noisePads} setVals={setNoisePads} currentNote={noteToDraw}/>
      </section>
      <section className="track-four">
        <DialUp audioContext={audioContext} ref={dialRef} />
        <Pads vals={dialPads} setVals={setDialPads} currentNote={noteToDraw}/>
      </section>
    </div>
  );
}

export default Sequencer;
