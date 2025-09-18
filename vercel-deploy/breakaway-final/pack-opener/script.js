async function openPack() {
    const email = document.getElementById('playerEmail').value;
    
    if (!email) {
        alert('Please enter your email!');
        return;
    }
    
    if (availableCards.length === 0) {
        alert('No more cards available!');
        return;
    }
    
    // Show opening animation
    document.getElementById('pack-container').style.display = 'none';
    document.getElementById('opening-animation').style.display = 'block';
    
    // Get random card
    const drawnCard = availableCards.pop();
    
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

function resetPack() {
    document.getElementById('card-reveal').style.display = 'none';
    document.getElementById('pack-container').style.display = 'block';
    document.getElementById('playerEmail').value = '';
}
