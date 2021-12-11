// Copyright 2021 Max Sprauer

import * as fs from 'fs';
let lines: Array<string> = fs.readFileSync('input.txt', 'utf8').split("\n");

const regexp: RegExp = /^(\w+) (\d+)$/;
let depth = 0;
let pos = 0;

lines.map((line) => {
    let matches = regexp.exec(line)
    if (matches !== null) {
        switch (matches[1]) {
            case 'down':
                depth += parseInt(matches[2]);
                break;
            case 'up':
                depth -= parseInt(matches[2]);
                break; 
            case 'forward':
                pos += parseInt(matches[2]);
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