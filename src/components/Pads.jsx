import { memo } from "react"

const Pads = memo(function Pads({vals, setVals, currentNote}){
    const [box1, box2, box3, box4] = vals

    function handleClick(box){
      setVals(prevState => {
        let arr = prevState;
        arr[box] = !arr[box];
        return arr
      })
    }

    let borderStyle = [];
    for (let i = 0; i< 4; i++){
      if (currentNote === i){
        borderStyle[i] = {borderColor: "yellow"}
      }
      else{
        borderStyle[i] = {borderColor: "black"}
      }
    }

    

    return <section className="pads">
    <input type="checkbox" id="v1n1" value={box1} onClick={()=>handleClick(0)} style={borderStyle[0]}/>
    <label htmlFor="v1n1">Voice 1, Note 1</label>

    <input type="checkbox" id="v1n2" value={box2} onClick={()=>handleClick(1)} style={borderStyle[1]}/>
    <label htmlFor="v1n2">Voice 1, Note 2</label>

    <input type="checkbox" id="v1n3" value={box3} onClick={()=>handleClick(2)} style={borderStyle[2]}/>
    <label htmlFor="v1n3">Voice 1, Note 3</label>

    <input type="checkbox" id="v1n4" value={box4} onClick={()=>handleClick(3)} style={borderStyle[3]}/>
    <label htmlFor="v1n4">Voice 1, Note 4</label>
  </section>
})

export default Pads