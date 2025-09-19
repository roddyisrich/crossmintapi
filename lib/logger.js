// In-memory storage for Vercel serverless functions
let recentActivities = [];

export const logMintActivity = (playerId, cardMinted, walletAddress = null) => {
  const logEntry = {
    timestamp: new Date().toISOString(),
    playerId: playerId,
    cardMinted: cardMinted,
    walletAddress: walletAddress,
    type: 'MINT_ACTIVITY'
  };
  
  // Add to in-memory array
  recentActivities.unshift(logEntry); // Add to beginning
  
  // Keep only last 50 activities
  if (recentActivities.length > 50) {
    recentActivities = recentActivities.slice(0, 50);
  }
  
  console.log(`🎯 MINT: Player ${playerId} pulled ${cardMinted} at ${logEntry.timestamp}`);
};

export const getRecentMintActivities = (limit = 20) => {
  return recentActivities
    .filter(activity => activity && activity.type === 'MINT_ACTIVITY')
    .slice(0, limit);
};
