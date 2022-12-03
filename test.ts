import {describe, expect, test} from '@jest/globals';


import {detectPattern} from './detect-format'


describe('detectPattern', () => {
    test('Basic detectPattern', () => {
        expect(detectPattern('333.bit')).toEqual(['AAA', '3D', 'Digit'])

        // expect(detectPattern('2112.bit')).toEqual(['ABBC','10K', '4D', 'Digit']) // why abbc
        expect(detectPattern('2112.bit')).toEqual(['ABBA','10K', '4D', 'Digit']) // maybe abba

        expect(detectPattern('45555.bit')).toEqual(['ABBBB', '100K', '5D', 'Digit'])
        expect(detectPattern('888000.bit')).toEqual(['AAABBB', '6D', 'Digit'])

        // expect(detectPattern('8880000.bit')).toEqual(['ABCC', '10K', 'Digit']) // why abcc?
        // expect(detectPattern('8880000.bit')).toEqual(['ABCC', '10K', 'Digit']) 
    });


    test('Advanced detectPattern', () => {

        expect(detectPattern('0098.bit')).toEqual(['00XX','10K', '4D', 'Digit'])
        expect(detectPattern('0x9832.bit')).toEqual(['0x10K', 'Digit'])
        expect(detectPattern('DDD.bit')).toEqual(['LetterAAA'])
        expect(detectPattern('DID.bit')).toEqual(['LetterABA'])
        expect(detectPattern('0311.bit')).toEqual(['ABCC', '0XXX', '10K','4D', 'MMDD', 'Digit'])
    });
  });