const fetch = require('node-fetch');

// Configuration
const CROSSMINT_API_KEY = 'sk_staging_9ykY8K9HXVN8SNuYX7t2fXpcJJjAyHrC2nqa1My1CVcJ1zGBdFiu1v6hMsWugdoFJUAkkiFyu8HHjBDuXJAZX4N5kfhcdVsJtH1JS1vsRXNmNKR56xQK98P1Zdavk9JgrUC7kpkCA5dYCb4UndtdzHQvE2vByWK2aohsFGwqzwfJkZad66frCqwjPQfySwhn7BcmYapPWqKhTAArSnyffnSu';
const COLLECTION_ID = '41e885b6-1886-46ae-9886-c4913068eb18';
const HOUSE_WALLET = '5mwLJh6T6pg9cSr8rrjnpVWxxyeh65YkSdVFDGHHt1hK';

// Your 14 cards metadata - UPDATE THESE WITH YOUR ACTUAL CARD DATA
const cards = [
  {
    cardId: '1A1',
    name: 'Hit the ground running (1A1)',
    image: 'https://red-late-lemming-903.mypinata.cloud/ipfs/bafybeiewucsxwiuzeq7hr4cd3uvycsg6dwp4srbbc6zmvcwfua67c22kj4',
    rarity: 'Gold'
  },
  // ADD YOUR OTHER 13 CARDS HERE
  // {
  //   cardId: '2A1',
  //   name: 'Card Name (2A1)',
  //   image: 'https://red-late-lemming-903.mypinata.cloud/ipfs/YOUR_IMAGE_HASH',
  //   rarity: 'Silver'
  // },
];

async function mintCard(card, copyNumber = 1) {
  try {
    console.log(`Minting ${card.name} (Copy ${copyNumber}/3)...`);
    
    const response = await fetch(
      `https://staging.crossmint.com/api/2022-06-09/collections/${COLLECTION_ID}/nfts`,
      {
        method: 'POST',
        headers: {
          'X-API-KEY': CROSSMINT_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient: `solana:${HOUSE_WALLET}`,
          metadata: {
            name: `${card.name} #${copyNumber}/3`,
            image: card.image,
            description: `${card.name} - ${card.rarity} card from Breakaway Rush Season 0 Collection - Copy ${copyNumber} of 3`,
            attributes: [
              { trait_type: 'Rarity', value: card.rarity },
              { trait_type: 'Card ID', value: card.cardId },
              { trait_type: 'Copy Number', value: `${copyNumber}/3` },
              { trait_type: 'Season', value: '0' }
            ],
            collection: {
              name: 'Breakaway Rush Official',
              family: 'Breakaway Rush'
            }
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${error}`);
    }

    const result = await response.json();
    console.log(`✅ Successfully minted ${card.name}`);
    return result;

  } catch (error) {
    console.error(`❌ Failed to mint ${card.name}:`, error.message);
    throw error;
  }
}

async function batchMintCards() {
  console.log(`🚀 Starting batch mint of ${cards.length} cards (Copy 1/3 each)...\n`);
  
  const results = [];
  const errors = [];

  for (let i = 0; i < cards.length; i++) {
    try {
      // Add delay between mints to avoid rate limiting
      if (i > 0) {
        console.log('⏳ Waiting 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      const result = await mintCard(cards[i], 1); // Mint copy 1 of 3
      results.push({ card: cards[i], result });
      
    } catch (error) {
      errors.push({ card: cards[i], error: error.message });
    }
  }

  // Summary
  console.log('\n📊 BATCH MINT SUMMARY:');
  console.log(`✅ Successfully minted: ${results.length}/${cards.length}`);
  console.log(`❌ Failed: ${errors.length}/${cards.length}`);
  
  if (errors.length > 0) {
    console.log('\n❌ Failed cards:');
    errors.forEach(({ card, error }) => {
      console.log(`- ${card.name}: ${error}`);
    });
  }
  
  if (results.length > 0) {
    console.log('\n✅ Successfully minted cards:');
    results.forEach(({ card }) => {
      console.log(`- ${card.name}`);
    });
  }
}

// Run the batch mint
if (require.main === module) {
  batchMintCards()
    .then(() => {
      console.log('\n🎉 Batch mint completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Batch mint failed:', error);
      process.exit(1);
    });
}

module.exports = { mintCard, batchMintCards };
