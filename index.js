console.log(`index.js loaded\n${Date()}`);

(async function(){ // go async and anonymous 
    localForage = (await import('https://cdn.jsdelivr.net/npm/localforage@1.10.0/+esm')).default;
    // load USM v3 module
    Umod = (await import(`https://usm.github.io/3/usm.mjs`))
    // Umod = (await import(`http://localhost:8000/usm3/usm.mjs`))
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
        
        // --- language model panel (C) ---//
        
        iRange.min=picki.min=0
        iRange.max=picki.max=u2.n-1
        iRange.value=picki.value=Math.floor(u2.n/2)
        iRange.onchange=function(){
            picki.value=iRange.value
            pickn.click()
        }
        picki.onkeyup=picki.onchange=function(){
            iRange.value=picki.value
            pickn.click()
        }
        pickn.onclick=function(){
            console.log(`picking from training sequence at position ${picki.value}`)
            let i = parseInt(picki.value)
            fw1.value=u2.forward[1][i-1]
            fw2.value=u2.forward[0][i-1]
            bk1.value=u2.backward[1][i+1]
            bk2.value=u2.backward[0][i+1]
            pickedSeq.innerHTML=`...${u2.seq.slice(i-31,i-1).join().replace(/,/g,'')}<span style="color:blue;font-size:large">[${u2.seq[i-1]}]&#8594;<span style="color:red;background-color:yellow;font-size:xx-large">${u2.seq[i]}</span>&#8592;[${u2.seq[i+1]}]</span>${u2.seq.slice(i+2,i+31).join().replace(/,/g,'')}...`
            before.textContent=`[${u2.seq[i-1]}]`
            after.textContent=`[${u2.seq[i+1]}]`
            fw1.onkeyup()
            fw2.onkeyup()
            bk1.onkeyup()
            bk2.onkeyup()
            //debugger
        }

        // rebin if values onchange
        function rebin(){
            fw1.onkeyup=()=>{
                binFw1.value=Math.floor(parseFloat(fw1.value)*parseFloat(numQuadrants.value))
                countFw.textContent=u2.lastFCGR.forward[binFw1.value][binFw2.value]
            }
            fw2.onkeyup=()=>{
                binFw2.value=Math.floor(parseFloat(fw2.value)*parseFloat(numQuadrants.value))
                countFw.textContent=u2.lastFCGR.forward[binFw1.value][binFw2.value]
            }
            bk1.onkeyup=()=>{
                binBk1.value=Math.floor(parseFloat(bk1.value)*parseFloat(numQuadrants.value))
                countBk.textContent=u2.lastFCGR.backward[binBk1.value][binBk2.value]
            }
            bk2.onkeyup=()=>{
                binBk2.value=Math.floor(parseFloat(bk2.value)*parseFloat(numQuadrants.value))
                countBk.textContent=u2.lastFCGR.backward[binBk1.value][binBk2.value]
            }
            //editing bis directly
            binFw1.onkeyup=binFw1.onchange=binFw2.onkeyup=binFw2.onchange=binFw1.onkeyup=binBk1.onchange=binBk2.onkeyup=binBk2.onchange=()=>{
                countFw.textContent=u2.lastFCGR.forward[binFw1.value][binFw2.value]
                countBk.textContent=u2.lastFCGR.backward[binBk1.value][binBk2.value]
            }
            
            /*
            fw1.onkeyup()
            fw2.onkeyup()
            bk1.onkeyup()
            bk2.onkeyup()
            */
        }
        rebin()
        
        //debugger
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
    taDensitySequence.onkeyup=function(){
        taDensitySequence.value = taDensitySequence.value.toUpperCase()
        densityButton.click()
    }
    colorCheckbox.onchange=densityGray

    function densityGray(){
        fcgrForward.innerHTML=`<p style="color:black;font-size:small;font-family:arial">Forward density, bivariate seed, of sequence length ${seq.length}
                               with ${numQuadrants.value} quadrants &#8594; k-mer length ${parseInt(ngramLength.textContent*1000000)/1000000}
                               </p>`
        fcgrBackward.innerHTML=`<p style="color:black;font-size:small;font-family:arial;width:100%">Backward density, bivariate seed, of sequence length ${seq.length},
                               with ${numQuadrants.value} quadrants &#8594; k-mer length ${parseInt(ngramLength.textContent*1000000)/1000000}
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
    function foldLanguage(){
        
    }
    
    
})()
