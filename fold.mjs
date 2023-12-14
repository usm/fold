// this module will focus on teh folding mechanism only,
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

export{
    fold,
    foldArray,
    foldDegree
}


/*

// Snippet
import('./fold.mjs')


*/