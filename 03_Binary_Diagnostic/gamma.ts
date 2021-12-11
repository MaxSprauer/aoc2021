// Copyright 2021 Max Sprauer

/**
 * Get count of binary 1's at the bit position in the array of binary string numbers
 * @param lines 
 * @param bitpos
 * @returns Count of binary 1's 
 */
function getCountOfOnes(lines: Array<string>, bitpos: number)
{
    let mask = 1 << bitpos;
    let count = 0;

    lines.map((line) => {
        let bitVal = parseInt(line, 2) & mask;
        if (bitVal > 0) {
            count++;
        }
    });

    return count;
}

function dec2bin(dec: number): string {
    return (dec >>> 0).toString(2);
}

const LENGTH = 12;
const NUMBERS = 1000;

import * as fs from 'fs';
import { extensions } from 'vscode';
let lines: Array<string> = fs.readFileSync('input.txt', 'utf8').trim().split("\n");

// Counts per binary digit of how many numbers have a 1
function PartOne(lines: Array<string>) 
{
    let gamma = 0;
    let epsilon = 0;

    for (let i: number = 0; i < LENGTH; i++) {
        let mask = 1 << i;

        let count = getCountOfOnes(lines, i);

        if (count > lines.length / 2) {
            gamma = (gamma | mask);
        }
    }

    epsilon = ~gamma & 0b111111111111;
    console.log('Part One')
    console.log(`Sanity check: gamma XOR epsilon = ${dec2bin(gamma ^ epsilon)}`);
    console.log(`${gamma} (${dec2bin(gamma)}) * ${epsilon} (${dec2bin(epsilon)}) = ${gamma * epsilon}`);
}

// Part Two
function PartTwo(lines: Array<string>) 
{
    var oxygenLines = lines;
    var co2Lines = lines;

    for (let i = LENGTH - 1; i >= 0; i--) {
        if (oxygenLines.length <= 1 && co2Lines.length <= 1) {
            break;
        }
        
        let countOfOnesOxygen = getCountOfOnes(oxygenLines, i);
        let countOfOnesCO2 = getCountOfOnes(co2Lines, i);
        let mostCommonValue = (countOfOnesOxygen >= oxygenLines.length / 2) ? 1 : 0;
        let leastCommonValue = (countOfOnesCO2 >= co2Lines.length / 2) ? 0 : 1;

        // If all elements are filtered out, we need to save the last one
        // and use that.  This is hacky, but should work.
        let savedOxygen = oxygenLines[oxygenLines.length - 1];
        let savedCO2 = co2Lines[co2Lines.length - 1];

        if (oxygenLines.length > 1) {
            oxygenLines = oxygenLines.filter(element => {
                return ((parseInt(element, 2) & (1 << i)) == (mostCommonValue << i));
            });

            if (oxygenLines.length == 0) {
                oxygenLines.unshift(savedOxygen);
            }
        }

        if (co2Lines.length > 1) {
            co2Lines = co2Lines.filter(element => {
                return ((parseInt(element, 2) & (1 << i)) == (leastCommonValue << i));            
            });

            if (co2Lines.length == 0) {
                co2Lines.unshift(savedCO2);
            }
        }
    }

    let oxygen = parseInt(oxygenLines[0], 2);
    let co2 = parseInt(co2Lines[0], 2);
    console.log('Part Two')
    console.log(`Oxygen: ${oxygen}`);
    console.log(`CO2: ${co2}`);
    console.log(`Oxygen * CO2 = ${oxygen * co2}`);
}

PartOne(lines);
PartTwo(lines);
PartThree(lines);

// Part Two again without duplicated code.  Not sure if I like this better or not.
function PartThree(lines: Array<string>) 
{
    var oxygenLines = lines;
    var co2Lines = lines;

    let oxRating = GetRating(oxygenLines, (countOfOnes: number, len: number) => { return (countOfOnes >= len / 2) ? 1 : 0 });
    let co2Rating = GetRating(co2Lines, (countOfOnes: number, len: number) => { return (countOfOnes >= len / 2) ? 0 : 1 });

    console.log('Part Two')
    console.log(`Oxygen: ${oxRating}`);
    console.log(`CO2: ${co2Rating}`);
    console.log(`Oxygen * CO2 = ${oxRating * co2Rating}`);

    function GetRating(elementLines: Array<string>, findCommonVal: Function) : number
    {
        for (let i = LENGTH - 1; i >= 0; i--) {
            let countOfOnes = getCountOfOnes(elementLines, i);
            // Most or least common value, depending on callback
            let commonValue = findCommonVal(countOfOnes, elementLines.length);

            // If all elements are filtered out, we need to save the last one
            // and use that.  This is hacky, but should work.
            let savedElement = elementLines[elementLines.length - 1];

            if (elementLines.length > 1) {
                elementLines = elementLines.filter(element => {
                    return ((parseInt(element, 2) & (1 << i)) == (commonValue << i));
                });
    
                if (elementLines.length == 0) {
                    elementLines.unshift(savedElement);
                }
            }

            if (elementLines.length == 1) {
                return parseInt(elementLines[0], 2);
            }
        }

        return -1;
    }
}