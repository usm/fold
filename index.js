console.log(`index.js loaded\n${Date()}`);

(async function(){ // go async and anonymous 
    localForage = (await import('https://cdn.jsdelivr.net/npm/localforage@1.10.0/+esm')).default;
    // load USM v3 module
    // Umod = (await import(`https://usm.github.io/3/usm.mjs`))
    Umod = (await import(`http://localhost:8000/usm3/usm.mjs`))
    // Umod = (await import(`http://localhost:8000/usmDev/usm.mjs`))
    
    function plotUSM(){
        taCGR.value=taCGR.value.toUpperCase().replace(/[^ACGT]/g,'')
        //let direction = [direction_forward,direction_backward].filter(ip=>ip.checked==true)[0].value
        let seed = [seed_middle,seed_circular,seed_bidirectional].filter(ip=>ip.checked==true)[0].value
        let size = parseInt(plotSize.value)+200
        let u = new Umod.USM(taCGR.value,seed,['A','C','G','T'])
        //u.plotACGT(divPlotUSM,size,direction)
        //console.log(u)
        u.plotACGT(forwardACGT,size,'forward')
        u.plotACGT(backwardACGT,size,'backward')
    }

    // coordinate plot
    plotUSM()
    taCGR.onkeyup=plotUSM;
    [...divParms.querySelectorAll('input')].forEach(ip => {ip.onchange=plotUSM})
    plotRange.onchange=function(){
        plotSize.value= this.value
        plotUSM()
    }
    plotSize.onchange=function(){
        plotRange.value = this.value
        plotUSM()
    }
    
    // density plot

    let seq = await localForage.getItem('LRG_304') // default LRG_304 EGFR sequence
    if(!seq){
        seq = (await Umod.getSeq()).seq
        localForage.setItem('LRG_304',seq)
    }
    //let seq = (await Umod.getSeq()).seq // default sequence
    let u2 // the usm map of the long sequence 
    taDensitySequence.value=seq.toLocaleUpperCase()
    densityButton.disabled=false
    densityButton.style.color="blue"
    seqLength.textContent=seq.length
    densityButton.onclick=function(){
        taDensitySequence.value=taDensitySequence.value.toLocaleUpperCase()
        seq = taDensitySequence.value // a new sequence may have been pasted in
        u2 = new Umod.USM(seq,'bidirectional',['A','G','C','T'])
        seqLength.textContent = u2.seq.length
        densityGray(u2)
        console.log(u2)
    }
    densityButton.click()

    rangeQuadrants.onchange=function(){
        numQuadrants.value=rangeQuadrants.value
        numBins.textContent = numQuadrants.value**2
        ngramLength.textContent=Math.log2(parseInt(numQuadrants.value))
        densityGray()
    }

    numQuadrants.onchange=function(){
        rangeQuadrants.value=numQuadrants.value
        numBins.textContent = numQuadrants.value**2
        ngramLength.textContent=Math.log2(parseInt(numQuadrants.value))
        densityGray()
    }

    resizeCheckbox.onchange=densityGray

    colorCheckbox.onchange=densityGray

    function densityGray(){
        fcgrForward.innerHTML=`<p style="color:black;font-size:small;font-family:arial">Forward density, bivariate seed, of sequence length ${seq.length}
                               with ${numQuadrants.value} quadrants &#8594; n-gram length ${parseInt(ngramLength.textContent*1000000)/1000000}
                               </p>`
        fcgrBackward.innerHTML=`<p style="color:black;font-size:small;font-family:arial;width:100%">Backward density, bivariate seed, of sequence length ${seq.length},
                               with ${numQuadrants.value} quadrants &#8594; n-gram length ${parseInt(ngramLength.textContent*1000000)/1000000}
                               </p>`
        let color = colorCheckbox.checked
        let resize = resizeCheckbox.checked
        if(resize){
            let fixedSize = parseInt(document.querySelector('#plotSize').value)
            let size = parseInt(document.querySelector('#numQuadrants').value)
            resize = fixedSize/size
            // console.log('initial resize factor:',resize)
        }
        //console.log('color:',colorCheckbox.checked,color)
        fcgrForward.appendChild(u2.plotCanvasGray(numQuadrants.value,'forward',color,resize))
        fcgrBackward.appendChild(u2.plotCanvasGray(numQuadrants.value,'backward',color,resize))
        // download links
        let downloadLinkForward = document.createElement('span')
        downloadLinkForward.innerHTML='<br>[<a href="#">download map as png</a>]'
        fcgrForward.appendChild(downloadLinkForward)
        let downloadLinkBackward = document.createElement('span')
        downloadLinkBackward.innerHTML='<br>[<a href="#">download map as png</a>]'
        fcgrBackward.appendChild(downloadLinkBackward)
        
    }
    
    
})()
