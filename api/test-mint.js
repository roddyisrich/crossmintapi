const CROSSMINT_API_KEY = 'sk_production_A52BtotVaZVkE8Pf4Y7d7qAQPt5bpGLpNK2GYEor6Jh6wfP2QjjNTAiMAvok2Uhoee6ervPxDY9ykf13UXjnnCK3jbhq7XdLxfEL5WNfjvsmMUE8E366cGKveQzP5Ek5cmgetAAcfykhv7DhXmZTC688oRaD62dgYrRRFznNkNarr1h4BWL69KkcZ3KZ3ESKanCzqPFF9MQh5h3Qu2LZrUMi';
const COLLECTION_ID = 'dac34fe9-b480-4140-bed0-73fe01d63d4c';
const HOUSE_WALLET = '5mwLJh6T6pg9cSr8rrjnpVWxxyeh65YkSdVFDGHHt1hK';

export default async function handler(req, res) {
  try {
    const payload = {
      templateId: 'e8bdc3cc-25b5-49c6-94be-15f5c9941463', // Hit the Ground Running
      recipient: `solana:${HOUSE_WALLET}`
    };

    const mintResponse = await fetch(
      `https://www.crossmint.com/api/2022-06-09/collections/${COLLECTION_ID}/nfts`,
      {
        method: 'POST',
        headers: {
          'X-API-KEY': CROSSMINT_API_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }
    );

    const responseText = await mintResponse.text();

    return res.status(200).json({
      status: mintResponse.status,
      statusText: mintResponse.statusText,
      response: responseText,
      headers: Object.fromEntries(mintResponse.headers)
    });

  } catch (error) {
    return res.status(500).json({ 
      error: error.message 
    });
  }
}
