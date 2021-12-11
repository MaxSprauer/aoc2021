// Copyright 2021 Max Sprauer

import * as fs from 'fs';
let lines: Array<string> = fs.readFileSync('input.txt', 'utf8').split("\n");

const regexp: RegExp = /^(\w+) (\d+)$/;
let depth = 0;
let pos = 0;
let aim = 0;

lines.map((line) => {
    let matches = regexp.exec(line)
    if (matches !== null) {
        let param: number = parseInt(matches[2]);
        switch (matches[1]) {
            case 'down':
                aim += param;
                break;
            case 'up':
                aim -= param;
                break; 
            case 'forward':
                pos += param;
                depth += (aim * param);
                break;
            default:
                console.error('Bad command: ' + matches[1]);
                break;
        }
    } else {
        console.error(`Line does not match: ${line}`);
    }
});

console.log(`Depth ${depth} Pos ${pos} = ${depth * pos}`);