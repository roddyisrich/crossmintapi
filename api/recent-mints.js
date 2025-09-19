import { getRecentMintActivities } from '../lib/activity-logger';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('Trying to get recent mint activities...');
    const activities = getRecentMintActivities(20);
    console.log('Activities found:', activities.length);
    
    const formattedActivities = activities.map(activity => ({
      id: `${activity.timestamp}-${activity.playerId}`,
      userId: activity.playerId,
      cardPulled: activity.cardMinted,
      timestamp: activity.timestamp,
      walletAddress: activity.walletAddress
    }));

    res.status(200).json({
      success: true,
      count: formattedActivities.length,
      activities: formattedActivities,
      debug: {
        logFileExists: require('fs').existsSync('./logs/mint-activities.log'),
        currentDir: process.cwd(),
        logsDir: require('fs').existsSync('./logs')
      }
    });

  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ 
      error: 'Failed to fetch recent activities',
      details: error.message,
      stack: error.stack
    });
  }
}
