// Valid access codes
let validAccessCodes = [
    "PACK-20250110-TEST"
];

// Track used codes
let usedCodes = [];

function isValidAccessCode(code) {
    return validAccessCodes.includes(code.toUpperCase()) && !usedCodes.includes(code.toUpperCase());
}

function markCodeAsUsed(code) {
    usedCodes.push(code.toUpperCase());
    console.log('Code used:', code);
}
