// /api/access-codes.js
let validCodes = new Set(['PACK-20250914-TEST']); // Initial test code
let usedCodes = new Set();

export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        // Get all codes or check specific code
        if (req.query.check) {
          const code = req.query.check.toUpperCase();
          const isValid = validCodes.has(code) && !usedCodes.has(code);
          return res.json({ valid: isValid, code });
        }
        
        // Return all codes for admin
        return res.json({
          validCodes: Array.from(validCodes),
          usedCodes: Array.from(usedCodes),
          stats: {
            total: validCodes.size,
            used: usedCodes.size,
            remaining: validCodes.size - usedCodes.size
          }
        });

      case 'POST':
        // Generate new codes or add manual code
        if (req.body.action === 'generate') {
          const { quantity = 5, prefix = 'PACK' } = req.body;
          const newCodes = [];
          
          for (let i = 0; i < quantity; i++) {
            const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
            const newCode = `${prefix}-${randomSuffix}`;
            validCodes.add(newCode);
            newCodes.push(newCode);
          }
          
          return res.json({ 
            success: true, 
            newCodes,
            message: `Generated ${quantity} new codes` 
          });
        }
        
        if (req.body.action === 'add') {
          const { code } = req.body;
          const upperCode = code.toUpperCase();
          
          if (validCodes.has(upperCode)) {
            return res.status(400).json({ error: 'Code already exists' });
          }
          
          validCodes.add(upperCode);
          return res.json({ 
            success: true, 
            message: `Code ${upperCode} added successfully` 
          });
        }
        
        if (req.body.action === 'use') {
          const { code } = req.body;
          const upperCode = code.toUpperCase();
          
          if (!validCodes.has(upperCode)) {
            return res.status(400).json({ error: 'Invalid code' });
          }
          
          if (usedCodes.has(upperCode)) {
            return res.status(400).json({ error: 'Code already used' });
          }
          
          usedCodes.add(upperCode);
          return res.json({ 
            success: true, 
            message: 'Code used successfully' 
          });
        }
        
        return res.status(400).json({ error: 'Invalid action' });

      case 'DELETE':
        // Clear codes
        if (req.body.action === 'clearUsed') {
          usedCodes.clear();
          return res.json({ success: true, message: 'Used codes cleared' });
        }
        
        if (req.body.action === 'clearAll') {
          validCodes.clear();
          usedCodes.clear();
          return res.json({ success: true, message: 'All codes cleared' });
        }
        
        return res.status(400).json({ error: 'Invalid action' });

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Access codes API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}