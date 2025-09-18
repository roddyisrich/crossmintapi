import { logMintActivity } from '../lib/logger';

export default async function handler(req, res) {
  try {
    // Create some test log entries
    logMintActivity('TestPlayer1', 'Heat Check (2A1)');
    logMintActivity('PlayerABC', 'Speed Demon (15A)');
    logMintActivity('User123', 'Power Play (7A)');
    
    res.json({
      success: true,
      message: 'Test activities logged successfully'
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      stack: error.stack 
    });
  }
}
