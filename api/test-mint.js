import { logMintActivity } from '../lib/logger';

export default async function handler(req, res) {
  try {
    // Just log fake activities without actually minting
    logMintActivity('TestPlayer1', 'Heat Check (2A1)');
    logMintActivity('PlayerABC', 'Speed Demon (15A)');
    logMintActivity('User123', 'Power Play (7A)');
    
    res.json({
      success: true,
      message: 'Test activities logged successfully - no actual minting'
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
}
