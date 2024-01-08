console.log(`index.js loaded\n${Date()}`);

(async function(){ // go async and anonymous 
    
    // load USM v3 module
    Umod = (await import(`https://usm.github.io/3/usm.mjs`))
    // Umod = (await import(`http://localhost:8000/usm3/usm.mjs`))
    
    function plotUSM(){
        taCGR.value=taCGR.value.toUpperCase().replace(/[^ACGT]/g,'')
        let direction = [direction_forward,direction_backward].filter(ip=>ip.checked==true)[0].value
        let seed = [seed_middle,seed_circular,seed_bidirectional].filter(ip=>ip.checked==true)[0].value
        let u = new Umod.USM(taCGR.value,seed,['A','C','G','T'])
        u.plotACGT(divPlotUSM,600,direction)
        //console.log(u)
    }
    plotUSM()
    taCGR.onkeyup=plotUSM;
    [...divParms.querySelectorAll('input')].forEach(ip => {ip.onclick=plotUSM})
})()

//import('./fold.mjs')

/*
<div id="divParms">
        <textarea id="taCGR" style="width:100%;font-size:large">GATACA</textarea>
        <br><b>Direction:</b> 
            <input type="radio" id="direction_forward" name="direction" value="forward" checked="true"> forward
            <input type="radio" id="direction_backward" name="direction"value="backward"> backward
        <br><b>Seeding:</b>
            <input type="radio" id="seed_middle" name="seed" value="middle" checked="true"> middle
            <input type="radio" id="seed_circular" name="seed" value="circular"> circular
            <input type="radio" id="seed_bidirectional" name="seed" value="bidirectional"> bidirectional
    </div>
*/

