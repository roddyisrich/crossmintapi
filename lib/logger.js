import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'logs', 'mint-activities.log');

const ensureLogDirectory = () => {
  const logDir = path.dirname(LOG_FILE);
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }
};

export const logMintActivity = (playerId, cardMinted, walletAddress = null) => {
  ensureLogDirectory();
  
  const logEntry = {
    timestamp: new Date().toISOString(),
    playerId: playerId,
    cardMinted: cardMinted,
    walletAddress: walletAddress,
    type: 'MINT_ACTIVITY'
  };
  
  const logLine = JSON.stringify(logEntry) + '\n';
  fs.appendFileSync(LOG_FILE, logLine);
  console.log(`🎯 MINT: Player ${playerId} pulled ${cardMinted} at ${logEntry.timestamp}`);
};

export const getRecentMintActivities = (limit = 20) => {
  ensureLogDirectory();
  
  try {
    if (!fs.existsSync(LOG_FILE)) {
      return [];
    }
    
    const logContent = fs.readFileSync(LOG_FILE, 'utf8');
    const logLines = logContent.trim().split('\n').filter(line => line);
    
    const activities = logLines
      .map(line => {
        try {
          return JSON.parse(line);
        } catch (e) {
          return null;
        }
      })
      .filter(activity => activity && activity.type === 'MINT_ACTIVITY')
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
    
    return activities;
    
  } catch (error) {
    console.error('Error reading log file:', error);
    return [];
  }
};
