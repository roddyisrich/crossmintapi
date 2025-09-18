import { logMintActivity } from '../../lib/logger';

const CROSSMINT_API_KEY = 'sk_production_A52BtotVaZVkE8Pf4Y7d7qAQPt5bpGLpNK2GYEor6Jh6wfP2QjjNTAiMAvok2Uhoee6ervPxDY9ykf13UXjnnCK3jbhq7XdLxfEL5WNfjvsmMUE8E366cGKveQzP5Ek5cmgetAAcfykhv7DhXmZTC688oRaD62dgYrRRFznNkNarr1h4BWL69KkcZ3KZ3ESKanCzqPFF9MQh5h3Qu2LZrUMi';
const COLLECTION_ID = 'dac34fe9-b480-4140-bed0-73fe01d63d4c';
const HOUSE_WALLET = '5mwLJh6T6pg9cSr8rrjnpVWxxyeh65YkSdVFDGHHt1hK';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // First, fetch all templates to see which ones have supply available
    const templatesResponse = await fetch(
      `https://www.crossmint.com/api/2022-06-09/collections/${COLLECTION_ID}/templates`,
      {
        headers: {
          'X-API-KEY': CROSSMINT_API_KEY,
        }
      }
    );

    if (!templatesResponse.ok) {
      return res.status(500).json({ error: 'Failed to fetch templates' });
    }

    const templates = await templatesResponse.json();
    
    // Filter templates that still have supply available
    const availableTemplates = templates.filter(template => 
      template.supply.minted < template.supply.limit
    );

    if (availableTemplates.length === 0) {
      return res.status(500).json({ error: 'No cards available - all templates exhausted' });
    }

    // Randomly select from available templates
    const randomIndex = Math.floor(Math.random() * availableTemplates.length);
    const selectedTemplate = availableTemplates[randomIndex];

    // Clean NFT metadata - no operational data
    const payload = {
      templateId: selectedTemplate.templateId,
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

    if (!mintResponse.ok) {
      const errorText = await mintResponse.text();
      return res.status(500).json({ error: errorText });
    }

    const mintResult = await mintResponse.json();

    // Simple logging - check Vercel function logs
    console.log('PACK OPENED:', {
      playerID: req.body.playerID || 'Unknown',
      cardName: selectedTemplate.metadata.name,
      nftId: mintResult.id || mintResult.actionId,
      timestamp: new Date().toISOString()
    });

    // Log mint activity for the activity feed
    logMintActivity(req.body.playerID || 'Unknown', selectedTemplate.metadata.name);

    return res.status(200).json({
      success: true,
      card: {
        name: selectedTemplate.metadata.name,
        image: selectedTemplate.metadata.image,
        rarity: 'Tier 3'
      },
      mintResult: mintResult
    });

  } catch (error) {
    return res.status(500).json({ 
      error: error.message
    });
  }
}