function getUpperCase(str) {
    let ret = ''

    for(let i=0; i < str.length; i++) {
        switch (str[i]) {
            case 'a':
                ret = ret + 'A'
                break;
            case 'b':
                ret = ret + 'B'
                break;
            case 'c':
                ret = ret + 'C'
                break;
            default: 
                ret = ret + str[i]                
        }
    }

    return ret
}

function getUpperCase2(str) {
    const abc = 'abcdefghijklmnopqrstuvwxyz'
    const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    
}

console.log(getUpperCase('abcbaAAA'))