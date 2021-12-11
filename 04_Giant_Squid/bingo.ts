// Copyright 2021 Max Sprauer

import * as fs from 'fs';
import { extensions } from 'vscode';
// import { extensions } from 'vscode';

class BingoCard 
{
    h: number;
    w: number;
    // numString: string;  // one string per card, rows separated by \n
    selected: Boolean[][];
    numbers: number[][] = Array();

    // Yes, we calculate width and height for every card.
    constructor(numString: string) 
    {
        // this.numString = numString;

        let rows: Array<string> = numString.split("\n");
        this.h = rows.length;

        rows.map((row, ind) => {
            this.numbers[ind] = row.trim().split(/\s+/).map(x => parseInt(x));
        });

        this.w = this.numbers[0].length;
        this.selected = new Array(this.h).fill(false).map(() => new Array(this.w).fill(false));
    }

    markNumber(n: number): boolean
    {
        // Find position of number
        for (let r = 0; r < this.h; r++) {
            for (let c = 0; c < this.w; c++) {
                if (this.numbers[r][c] == n) {
                    this.selected[r][c] = true;
                    return true;
                }
            }
        }

        return false;
    }

    sumOfAllUnmarkedNumbers(): number
    {
        let sum = 0;

        for (let r = 0; r < this.h; r++) {
            for (let c = 0; c < this.w; c++) {
                if (!this.selected[r][c]) {
                    sum += this.numbers[r][c];
                }
            }
        }

        return sum;
    }

    callNumber(n: number)
    {
        if (this.markNumber(n)) {
            return this.checkBingo();
        }

        return false;
    }

    checkBingo(): boolean
    {
        // Check rows
        for (let r = 0; r < this.h; r++) {
            let match = true;
            
            for (let c = 0; c < this.w; c++) {
                if (!this.selected[r][c]) {
                    match = false;
                    break;
                } 
            }    

            if (match) {
                return true;
            }
        }

        // Check columns
        for (let c = 0; c < this.w; c++) {
            let match = true;
            
            for (let r = 0; r < this.h; c++) {
                if (!this.numbers[r][c]) {
                    match = false;
                    break;
                } 
            }    

            if (match) {
                return true;
            }
        }

        return false;
    }
}

let lines: Array<string> = fs.readFileSync('input.txt', 'utf8').trim().split("\n");

// Read in first line of called numbers
var called: Array<number>|undefined = lines.shift()?.split(',').map(x => parseInt(x));

// Read in cards as one string per card, rows separated by \n
var cardStrings = lines.join("\n").trim().split("\n\n");
var cards = Array();

cardStrings.map(cardString => {
    cards.push(new BingoCard(cardString));
});

// Part One
called?.some(n => {
    return cards.some(card => {
        if (card.callNumber(n)) {
            console.log(`Part One Bingo: ${card.sumOfAllUnmarkedNumbers() * n}`);
            return true;
        }
        return false;
    });
});

// Part Two
let lastCard: BingoCard;
called?.every(n => {
    cards = cards.filter(card => {
        let bingo = card.callNumber(n);
        if (bingo) {
            lastCard = card;
        }

        // Remove cards that have hit bingo
        return !bingo;
    });

    if (cards.length == 0) {
        console.log(`Part Two Bingo: ${lastCard.sumOfAllUnmarkedNumbers() * n}`);
        // Stop loop when cards are exhausted
        return false;
    }

    return true;
});
