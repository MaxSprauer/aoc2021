// Copyright 2021 Max Sprauer

import * as fs from 'fs';
var lines = fs.readFileSync('input.txt','utf8');

const depths = lines.split("\n").map((depth) => +depth);    // Convert string to int
let increases = 0;
let windows = 0;

for (var i = 1; i < depths.length; i++) {
    if (depths[i] > depths[i - 1]) {
        increases++;
    }

    // Part Two
    if (i < depths.length - 2) {
        let prev = depths[i - 1] + depths[i] + depths[i + 1];
        let curr = depths[i] + depths[i+1] + depths[i + 2];
    
        if (curr > prev) {
            windows++;
        }    
    }
}

console.log(increases + "\n");
console.log(windows + "\n");
