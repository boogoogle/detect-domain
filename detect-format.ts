const  isNumber = (t:string) : boolean => !isNaN(Number(t))
const isDot = (t:string) : boolean => t === '.'


let LETTERS = ['a','b', 'c', 'd', 'e','f', 'g', 'h', 'i', 'j']
LETTERS = LETTERS.map(l=>l.toUpperCase())


function checkIsDate(str:string): boolean{
    // suppose that every month has 30 days 
    // for more accurate， need more confitions

    if ( str.length !== 4 ) return false

    // judge month 
    if(Number(str[0]) > 1) {
        return false
    }
    if(str[0] === '1'){
        if(Number(str[1]) > 2) {
            return false
        }
    }

    // judge day
    if(Number(str[2]) > 3) {
        return false
    }

    if(str[2] === '3'){
        if(Number(str[3]) > 0) {
            return false
        }
    }

    return true
}

export const detectPattern = (domain: string): Array<string> => {
    let LETTERS_CURSOR = 0

    let isRawDigit = true

    // for most basic pattern

    let  NumberOfD =  0
    let abxxxxPattern = ''
    let xxxxKpattern = ''
    let xxxxDpattern = ''

    let numLetterMap = {} as {
        [key: string]: string
    }


    // for advanced, O... Ox... and letters
    let zero_xxxxPattern_prefix = ''
    let zero_xxxxPattern_last = ''
    let zerox_xxxxPattern_prefix = ''
    let Letter_xxxxPattern = ''

    let isDate = false



    function processNumber(cur: string, i: number) {
            if(!numLetterMap[cur]) {
                numLetterMap[cur] = LETTERS[LETTERS_CURSOR]
                LETTERS_CURSOR += 1
            } 
            abxxxxPattern += numLetterMap[cur]
            
            if(isRawDigit) {
                NumberOfD += 1

                if(i >= 3) {

                    let numOfK = NumberOfD

                    if(zerox_xxxxPattern_prefix === '0x') {
                        numOfK -=1
                    } 
                    
                    xxxxKpattern =  `${Math.pow(10,numOfK) / 1000}K`
 
                    if(Math.pow(10,numOfK) / 1000 > 100) { // if > 100K, don't show
                        xxxxKpattern = ''
                    } 
                    
                }
            }
    }

    function processLetter(cur: string,) {
        if(!numLetterMap[cur]) {
            numLetterMap[cur] = LETTERS[LETTERS_CURSOR]
            LETTERS_CURSOR += 1
        } 
        Letter_xxxxPattern += numLetterMap[cur]
    }


    for(let i=0; i < domain.length; i++) {
        const cur = domain[i] as string

        if(isDot(cur)) {
            isDate = checkIsDate(domain.substring(0,i))
            break;
        }


        const isFirstLetter = i === 0
        const isSecondLetter = i === 1


        if(isFirstLetter) {
            if(Number(cur) == 0) {
                zero_xxxxPattern_prefix += cur
                zerox_xxxxPattern_prefix += cur
                processNumber(cur, i)
                continue
            }
        }

        if(isSecondLetter && zero_xxxxPattern_prefix) {// zero_xxxxPattern_prefix means that the firstLetter is also 0
            if(Number(cur) == 0) {
                zero_xxxxPattern_prefix += cur
                processNumber(cur, i)
                continue
            } 
            if(cur === 'x') {
                zerox_xxxxPattern_prefix += cur //Ox
                continue
            }
        }
        
        if(zero_xxxxPattern_prefix.length == 2) { // '00'
            zero_xxxxPattern_last += 'X'
        }


        if(zero_xxxxPattern_prefix.length == 1 && zerox_xxxxPattern_prefix.length < 2) { // '00'
            zero_xxxxPattern_last += 'X'
        }

        if(zerox_xxxxPattern_prefix.length == 2 && i == 1) { //'0x'
            isRawDigit = true
            xxxxKpattern = ''

            continue
        }


        if(!isNumber(cur)) {
            isRawDigit = false
            processLetter(cur)
        } else {
            processNumber(cur, i)
        }

    }

    xxxxDpattern = (NumberOfD && NumberOfD < 7) ? NumberOfD + 'D' : ''

    let rst:Array<string> =  []
    

    if(abxxxxPattern && zero_xxxxPattern_prefix !== "00" && zerox_xxxxPattern_prefix != "0x") {
        rst.push(abxxxxPattern)
    }

    if(zero_xxxxPattern_prefix && zerox_xxxxPattern_prefix != "0x" && zero_xxxxPattern_last) {
        rst.push(zero_xxxxPattern_prefix + zero_xxxxPattern_last)
    }

    if(xxxxKpattern) {
        if(zerox_xxxxPattern_prefix.length == 2) {
            rst.push(zerox_xxxxPattern_prefix + xxxxKpattern)
        } else {
            rst.push(xxxxKpattern)
        }
    }

    if(xxxxDpattern && zerox_xxxxPattern_prefix != "0x") {
        rst.push(xxxxDpattern)
    }

    if(isRawDigit) {
        if(isDate) {
            rst.push('MMDD')
        }
        rst.push('Digit')
    }

    if(Letter_xxxxPattern) {
        rst.push("Letter" + Letter_xxxxPattern)
    }

    return rst

}