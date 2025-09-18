const CROSSMINT_API_KEY = 'sk_production_A52BtotVaZVkE8Pf4Y7d7qAQPt5bpGLpNK2GYEor6Jh6wfP2QjjNTAiMAvok2Uhoee6ervPxDY9ykf13UXjnnCK3jbhq7XdLxfEL5WNfjvsmMUE8E366cGKveQzP5Ek5cmgetAAcfykhv7DhXmZTC688oRaD62dgYrRRFznNkNarr1h4BWL69KkcZ3KZ3ESKanCzqPFF9MQh5h3Qu2LZrUMi';
const COLLECTION_ID = 'dac34fe9-b480-4140-bed0-73fe01d63d4c';

export default async function handler(req, res) {
  try {
    // Fetch collection metadata
    const collectionResponse = await fetch(
      `https://www.crossmint.com/api/2022-06-09/collections/${COLLECTION_ID}`,
      {
        headers: {
          'X-API-KEY': CROSSMINT_API_KEY,
        }
      }
    );

    if (!collectionResponse.ok) {
      const error = await collectionResponse.text();
      return res.status(500).json({ error: 'Failed to fetch collection', details: error });
    }

    const collection = await collectionResponse.json();

    // Try to fetch NFTs in the collection
    const nftsResponse = await fetch(
      `https://www.crossmint.com/api/2022-06-09/collections/${COLLECTION_ID}/nfts`,
      {
        headers: {
          'X-API-KEY': CROSSMINT_API_KEY,
        }
      }
    );

    let nfts = null;
    if (nftsResponse.ok) {
      nfts = await nftsResponse.json();
    }

    return res.status(200).json({
      collection: collection,
      nfts: nfts,
      totalNFTs: nfts?.length || 0
    });

  } catch (error) {
    console.error('Error fetching collection:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}
