const CROSSMINT_API_KEY = 'sk_production_A52BtotVaZVkE8Pf4Y7d7qAQPt5bpGLpNK2GYEor6Jh6wfP2QjjNTAiMAvok2Uhoee6ervPxDY9ykf13UXjnnCK3jbhq7XdLxfEL5WNfjvsmMUE8E366cGKveQzP5Ek5cmgetAAcfykhv7DhXmZTC688oRaD62dgYrRRFznNkNarr1h4BWL69KkcZ3KZ3ESKanCzqPFF9MQh5h3Qu2LZrUMi';
const COLLECTION_ID = 'dac34fe9-b480-4140-bed0-73fe01d63d4c';

export default async function handler(req, res) {
  try {
    // Fetch all templates with pagination
    let allTemplates = [];
    let page = 1;

    while (true) {
      const templatesResponse = await fetch(
        `https://www.crossmint.com/api/2022-06-09/collections/${COLLECTION_ID}/templates?limit=50&page=${page}`,
        {
          headers: {
            'X-API-KEY': CROSSMINT_API_KEY,
          }
        }
      );

      if (!templatesResponse.ok) {
        if (page === 1) {
          throw new Error('Failed to fetch templates');
        }
        break;
      }

      const pageTemplates = await templatesResponse.json();
      const templates = pageTemplates.results || pageTemplates;
      
      if (!Array.isArray(templates) || templates.length === 0) {
        break;
      }
      
      allTemplates = allTemplates.concat(templates);
      page++;
    }

    const templates = allTemplates;
    const availableCount = templates.filter(template => template.supply.minted < template.supply.limit).length;

    const html = `<!DOCTYPE html>
<html>
<head>
    <title>Card Gallery - Breakaway Rush Season 0</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Inter:wght@400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: 'Inter', sans-serif; 
            background: radial-gradient(ellipse at 25% 25%, rgba(220,220,220,0.4) 0%, transparent 60%), radial-gradient(ellipse at 75% 75%, rgba(192,192,192,0.3) 0%, transparent 60%), linear-gradient(135deg, #2c3e50 0%, #34495e 25%, #2c3e50 50%, #1a252f 75%, #2c3e50 100%);
            min-height: 100vh; color: white; position: relative;
        }
        body::before {
            content: ''; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: repeating-linear-gradient(22.5deg, transparent 0px, rgba(255,255,255,0.02) 1px, rgba(220,220,220,0.06) 2px, rgba(192,192,192,0.04) 3px, transparent 4px, transparent 8px);
            pointer-events: none; z-index: 1; animation: shimmer 12s ease-in-out infinite;
        }
        @keyframes shimmer { 0%, 100% { opacity: 0.6; } 50% { opacity: 0.8; } }
        .header { 
            text-align: center; padding: 50px 20px; 
            background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(235,235,235,0.06) 50%, rgba(255,255,255,0.1) 100%);
            backdrop-filter: blur(20px); border-bottom: 2px solid rgba(255,255,255,0.15); position: relative; z-index: 2;
        }
        .header h1 { 
            font-family: 'Orbitron', monospace; font-size: 2.8rem; margin: 0 0 15px 0;
            background: linear-gradient(135deg, #ffffff 0%, #e8e8e8 25%, #ffffff 50%, #d3d3d3 75%, #ffffff 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
            text-shadow: 0 0 25px rgba(255,255,255,0.3);
        }
        .stats { 
            background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(235,235,235,0.1) 25%, rgba(255,255,255,0.15) 50%, rgba(220,220,220,0.1) 75%, rgba(255,255,255,0.15) 100%);
            backdrop-filter: blur(20px); padding: 30px; margin: 40px auto; border-radius: 25px; text-align: center;
            max-width: 700px; border: 2px solid rgba(255,255,255,0.25); position: relative; z-index: 2;
        }
        .pack-link {
            display: inline-block; margin-top: 20px;
            background: linear-gradient(135deg, #e74c3c 0%, #c0392b 25%, #e74c3c 50%, #a93226 75%, #e74c3c 100%);
            color: white; padding: 20px 40px; border-radius: 18px; text-decoration: none;
            font-weight: bold; font-family: 'Orbitron', monospace; letter-spacing: 1px;
            transition: all 0.4s ease; box-shadow: 0 12px 25px rgba(231,76,60,0.4), inset 0 2px 0 rgba(255,255,255,0.3);
        }
        .pack-link:hover { transform: translateY(-4px); }
        .container { max-width: 1500px; margin: 0 auto; padding: 30px; position: relative; z-index: 2; }
        .cards-grid { 
            display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); 
            gap: 50px; margin-top: 60px; justify-items: center; padding: 20px 0;
        }
        .card-container { position: relative; cursor: pointer; }
        .card-container img { 
            width: 280px; height: 392px; object-fit: cover; border-radius: 20px; 
            box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(255,255,255,0.1);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); position: relative; z-index: 2;
            image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;
            filter: brightness(1.05) contrast(1.1) saturate(1.15); border: 1px solid rgba(255,255,255,0.2);
        }
        .card-container::before {
            content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 30%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.3) 70%, transparent 100%);
            transition: left 0.8s ease; z-index: 3; border-radius: 20px; pointer-events: none;
        }
        .card-container:hover img {
            transform: translateY(-8px) scale(1.03);
            box-shadow: 0 30px 60px rgba(0,0,0,0.6), 0 0 30px rgba(255,255,255,0.15);
            filter: brightness(1.1) contrast(1.15) saturate(1.2);
        }
        .card-container:hover::before { left: 100%; }
        .card-info { text-align: center; margin-top: 20px; position: relative; z-index: 2; }
        .card-name { 
            font-family: 'Orbitron', monospace; font-size: 1.1rem; font-weight: 700; margin: 0 0 10px 0; 
            background: linear-gradient(135deg, #ffffff 0%, #e8e8e8 50%, #ffffff 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
            text-shadow: 0 0 10px rgba(255,255,255,0.3);
        }
        .card-stats { 
            background: rgba(255,255,255,0.15); padding: 6px 16px; border-radius: 15px; 
            font-family: 'Orbitron', monospace; font-size: 0.85rem; margin: 8px 0;
            display: inline-block; border: 1px solid rgba(255,255,255,0.2);
        }
        .card-type {
            padding: 8px 20px; border-radius: 25px; font-weight: bold; display: inline-block;
            margin: 8px 0; text-transform: uppercase; letter-spacing: 1px; font-size: 0.9rem;
            background: linear-gradient(135deg, #9d4edd, #c77dff, #9d4edd); color: white;
            box-shadow: 0 0 25px rgba(157,78,221,0.5);
        }
        .card-container.sold-out {
            opacity: 0.4;
            filter: grayscale(80%) brightness(0.6);
        }
        .card-container.sold-out img {
            filter: grayscale(100%) brightness(0.5) contrast(0.7);
        }
        .card-container.sold-out:hover {
            transform: none !important;
        }
        .card-container.sold-out:hover img {
            transform: none !important;
            filter: grayscale(100%) brightness(0.5) contrast(0.7) !important;
        }
        .card-container.sold-out::before {
            display: none !important;
        }
        .sold-out-overlay {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.8);
            color: #ff6b6b;
            padding: 10px 20px;
            border-radius: 10px;
            font-family: 'Orbitron', monospace;
            font-weight: bold;
            font-size: 1.2rem;
            text-shadow: 0 0 10px rgba(255,107,107,0.5);
            z-index: 10;
        }
        .availability-badge {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: bold;
            margin: 8px 0;
            display: inline-block;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .available-badge {
            background: linear-gradient(135deg, #4ade80, #22c55e);
            color: white;
            box-shadow: 0 0 15px rgba(34,197,94,0.4);
        }
        .sold-out-badge {
            background: linear-gradient(135deg, #ef4444, #dc2626);
            color: white;
            box-shadow: 0 0 15px rgba(239,68,68,0.4);
        }
        @media (max-width: 768px) {
            .cards-grid { grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 40px; }
            .card-container img { width: 240px; height: 336px; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>SEASON 0 CARD GALLERY</h1>
        <p>Hunt these cards in Breakaway Rush packs</p>
    </div>
    
    <div class="container">
        <div class="stats">
            <h3>Collection Stats</h3>
            <p><strong>Total Cards:</strong> ${templates.length} | <strong>Available:</strong> ${availableCount} | <strong>Minted:</strong> ${templates.length - availableCount}</p>
            <p><strong>Season:</strong> 0 (Genesis Collection)</p>
            <a href="/pack-opener" class="pack-link">OPEN PACKS</a>
        </div>
        
        <div class="cards-grid">
            ${templates.map(template => {
              const power = template.metadata.attributes?.find(attr => attr.trait_type === 'Power')?.value || 'N/A';
              const position = template.metadata.attributes?.find(attr => attr.trait_type === 'Position')?.value || 'N/A';
              const type = template.metadata.attributes?.find(attr => attr.trait_type === 'Type')?.value || 'N/A';
              
              // Check if this card is sold out
              const isSoldOut = template.supply.minted >= template.supply.limit;
              const availabilityClass = isSoldOut ? 'sold-out' : 'available';
              const statusText = isSoldOut ? 'SOLD OUT' : 'AVAILABLE';
              
              return `
                <div class="card-container ${availabilityClass}">
     <img src="${template.metadata.image}" alt="${template.metadata.name}" loading="lazy" />
                    <div class="card-info">
                        <div class="card-name">${template.metadata.name}</div>
                        <div class="card-stats">Power: ${power} • ${position}</div>
                        <div class="card-type">${type}</div>
                        <div class="availability-badge ${isSoldOut ? 'sold-out-badge' : 'available-badge'}">${statusText}</div>
                    </div>
                    ${isSoldOut ? '<div class="sold-out-overlay">MINTED</div>' : ''}
                </div>
              `;
            }).join('')}
        </div>
    </div>
    
    <div style="text-align: center; padding: 60px 20px; margin-top: 80px; opacity: 0.7; border-top: 2px solid rgba(255,255,255,0.1); position: relative; z-index: 2;">
        <p>Available cards can still be pulled from packs</p>
        <p>Last updated: ${new Date().toLocaleString()}</p>
    </div>
</body>
</html>`;

    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(html);

  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ 
      error: 'Failed to load card gallery', 
      details: error.message 
    });
  }
}