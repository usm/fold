console.log(`index.js loaded\n${Date()}`);

(async function(){ // go async and anonymous 
    
    // load USM v3 module
    Umod = (await import(`https://usm.github.io/3/usm.mjs`))
    // Umod = (await import(`http://localhost:8000/usm3/usm.mjs`))
    
    function plotUSM(){
        taCGR.value=taCGR.value.toUpperCase().replace(/[^ACGT]/g,'')
        let direction = [direction_forward,direction_backward].filter(ip=>ip.checked==true)[0].value
        let seed = [seed_middle,seed_circular,seed_bidirectional].filter(ip=>ip.checked==true)[0].value
        let size = plotSize.value
        let u = new Umod.USM(taCGR.value,seed,['A','C','G','T'])
        u.plotACGT(divPlotUSM,size,direction)
        //console.log(u)
    }

    function plotCanvas(){
        
    }
    
    // coordinate plot
    plotUSM()
    taCGR.onkeyup=plotUSM;
    [...divParms.querySelectorAll('input')].forEach(ip => {ip.onchange=plotUSM})

    // density plot

    let seq = (await Umod.getSeq()).seq // default sequence
    taDensitySequence.value=seq.toLocaleUpperCase()
    densityButton.disabled=false
    densityButton.style.color="blue"
    seqLength.textContent=seq.length
    densityButton.onclick=function(){
        taDensitySequence.value=taDensitySequence.value.toLocaleUpperCase()
        seq = taDensitySequence.value // a new sequence may have been pasted in
        let u = new Umod.USM(seq,'bidirectional',['A','C','G','T'])
        console.log(u)
    }

    rangeQuadrants.onchange=function(){
        numQuadrants.value=rangeQuadrants.value
        numBins.textContent = numQuadrants.value**2
        ngramLength.textContent=Math.log2(parseInt(numQuadrants.value))
    }

    numQuadrants.onchange=function(){
        rangeQuadrants.value=numQuadrants.value
        numBins.textContent = numQuadrants.value**2
        ngramLength.textContent=Math.log2(parseInt(numQuadrants.value))
    }
    
})()
