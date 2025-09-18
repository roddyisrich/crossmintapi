// Hit the Ground Running Collection
const allCards = [
    {
        name: "Hit the ground running (1A1)",
        image: "https://red-late-lemming-903.mypinata.cloud/ipfs/bafybeiewucsxwiuzeq7hr4cd3uvycsg6dwp4srbbc6zmvcwfua67c22kj4",
        metadata: "https://red-late-lemming-903.mypinata.cloud/ipfs/bafkreigajxfpjrvojuni3wnez4dl5ztzawbntwygsi46hlfv22tludhfoa",
        rarity: "Gold",
        cardId: "1A1"
    }
];

// Shuffle function
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Initialize shuffled deck
let availableCards = shuffleArray(allCards);
