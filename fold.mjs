// this module will focus on the folding mechanism only,
// for the USM library, imported here by index.js,
// see usm.github.io/3

// for a single USM coordinate, between 0 and 1
function fold(x=Math.random()){
    return x<=0.5 ? x*2 : (x-0.5)*2
}

// for an array of coordinates
function foldArray(xx=[...Array(6)].map(_=>Math.random())){
    return xx.map(fold)
}

// for folding degrees
function foldDegree(x,d){
    let y = fold(x) // 1st degree
    if(d>1){
        y=[y] // so this comes out as an array
        for (let i=1 ; i<=d ; i++){
            y.push(fold(y[i-1]))
        }
    }
    return y
}


function similarLength1D(a,b,n=0){ // distance between two numeric values (1D)
    // the basic folding operation comparing two numbers, >=0 and <=1
    let s = (Math.round(a)==Math.round(b))
    if(s){
        return similarLength1D(fold(a),fold(b),n+1)
    } else {
        return n
    }
}

function findMatchPositions(string, regex) {
  const positions = [];
  let match;

  while ((match = regex.exec(string)) !== null) {
    positions.push(match.index);
  }

  return positions;
}

// Example usage:
// const string = "The quick brown fox jumps over the lazy dog.";
// const regex = /the/gi; // Case-insensitive and global match
// const positions = findMatchPositions(string, regex);
// console.log(positions); // Output: [0, 31]

function similarLength(a,b,n=0){ // generic implementation of similar distance, vectorized
    
    let s = 4
}


export{
    fold,
    foldArray,
    foldDegree,
    similarLength1D,
    fcgr,
    uEGFR,
    u
}


/*

// Snippet
import('./fold.mjs')


*/

// experimental functions, developed first as snippets

async function fcgr(L=2){
    console.log('fcgr')
    Umod = await (await import(`https://usm.github.io/3/usm.mjs`))
    let seq = await localForage.getItem('LRG_304') // default LRG_304 EGFR sequence
    if(!seq){
        seq = (await Umod.getSeq()).seq
        localForage.setItem('LRG_304',seq)
    }
    // u = new Umod.USM(seq,`bidirectional`,['A','C','G','T'])
    let u = new Umod.USM(seq,`bidirectional`,['A','G','C','T'])
    return u.fcgr(L)
    // check edges:
    //[C,T][55984,68461]
    //[A,G][65905,54239]
}

async function uEGFR(seq){
    Umod = await (await import(`https://usm.github.io/3/usm.mjs`))
    seq = await localForage.getItem('LRG_304') // default LRG_304 EGFR sequence
    if(!seq){
        seq = (await Umod.getSeq()).seq
        localForage.setItem('LRG_304',seq)
    }
    let u = new Umod.USM(seq,`bidirectional`,['A','G','C','T'])
    return u
}

async function u(seq='GATTACA'){
    const Umod = await (await import(`https://usm.github.io/3/usm.mjs`))
    let u = new Umod.USM(seq,`circular`,['A','G','C','T'])
    return u
}

async function foldPredict(pos,L){ // position and memory length
    let u = await uEGFR()
    debugger
}
