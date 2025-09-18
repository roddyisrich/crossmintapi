async function openPack() {
    const playerID = document.getElementById('playerID').value;
    const accessCode = document.getElementById('accessCode').value;
    
    if (!playerID) {
        alert('Please enter your Player ID!');
        return;
    }
    
    if (!accessCode) {
        alert('Please enter your Access Code!');
        return;
    }
    
    // Check if access code is valid
    if (!isValidAccessCode(accessCode)) {
        alert('Invalid or already used Access Code!');
        return;
    }
    
    if (availableCards.length === 0) {
        alert('No more cards available!');
        return;
    }
    
    // Mark code as used
    markCodeAsUsed(accessCode);
    
    // Show opening animation
    document.getElementById('pack-container').style.display = 'none';
    document.getElementById('opening-animation').style.display = 'block';
    
    // Get random card
    const drawnCard = availableCards.pop();
    
    // Mint real NFT to your wallet (in background)
    mintNFT(drawnCard, playerID, accessCode);
    
    // Simulate pack opening delay
    setTimeout(() => {
        // Hide animation, show card
        document.getElementById('opening-animation').style.display = 'none';
        document.getElementById('card-reveal').style.display = 'block';
        document.getElementById('cardImage').src = drawnCard.image;
        document.getElementById('cardName').textContent = drawnCard.name;
        document.getElementById('cardRarity').textContent = drawnCard.rarity;
    }, 3000);
}

async function mintNFT(card, playerID, accessCode) {
    try {
        const response = await fetch('https://staging.crossmint.com/api/2022-06-09/collections/41e885b6-1886-46ae-9886-c4913068eb18/nfts', {
            method: 'POST',
            headers: {
                'X-API-KEY': 'sk_staging_9ykY8K9HXVN8SNuYX7t2fXpcJJjAyHrC2nqa1My1CVcJ1zGBdFiu1v6hMsWugdoFJUAkkiFyu8HHjBDuXJAZX4N5kfhcdVsJtH1JS1vsRXNmNKR56xQK98P1Zdavk9JgrUC7kpkCA5dYCb4UndtdzHQvE2vByWK2aohsFGwqzwfJkZad66frCqwjPQfySwhn7BcmYapPWqKhTAArSnyffnSu',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                recipient: '5mwLJh6T6pg9cSr8rrjnpVWxxyeh65YkSdVFDGHHt1hK',
                metadata: {
                    name: card.name,
                    image: card.image,
                    description: `Opened by Player ${playerID} using code ${accessCode} - ${card.rarity} card from Breakaway Rush Official Season 0`,
                    attributes: [
                        {"trait_type": "Rarity", "value": card.rarity},
                        {"trait_type": "Card ID", "value": card.cardId},
                        {"trait_type": "Player ID", "value": playerID},
                        {"trait_type": "Access Code", "value": accessCode}
                    ]
                }
            })
        });
        
        const result = await response.json();
        console.log('NFT minted successfully:', result);
    } catch (error) {
        console.log('NFT minting failed:', error);
    }
}

function resetPack() {
    document.getElementById('card-reveal').style.display = 'none';
    document.getElementById('pack-container').style.display = 'block';
    document.getElementById('playerID').value = '';
    document.getElementById('accessCode').value = '';
}
