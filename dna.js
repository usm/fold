console.log('dna.js loaded');

(function(){ // going anonymous for the sake of packaging
    const dna = async function(seq){
        console.log('dna.js initiatized at '+Date())
        this.date=Date()
        this.seq='asdf'
        //this.seq=seq||(await (await fetch('https://www.ncbi.nlm.nih.gov/sviewer/viewer.cgi?id=50083297&db=nuccore&report=fasta&extrafeat=null&conwithfeat=on&hide-cdd=on&retmode=html&withmarkup=on&tool=portal&log$=seqview&pid=0')).text())
        //ini
    }
    //
    if(typeof(window)=="object"&typeof(define)=="undefined"){
        window.dna=dna // drop it in the global scope 
    }
})()

