console.log(`index.js loaded\n${Date()}`);

(async function(){ // go async and anonymous 
    
    // load USM v3 module
    Umod = (await import(`https://usm.github.io/3/usm.mjs`))
    
    function plotCGR(){
        taCGR.value=taCGR.value.toUpperCase().replace(/[^ACGT]/g,'')
        let u = new Umod.USM(taCGR.value,0.5,['A','C','G','T'])
        u.plotACGT(divPlotCGR)
        //console.log(u)
    }
    plotCGR()
    taCGR.onkeyup=plotCGR
})()

//import('./fold.mjs')

