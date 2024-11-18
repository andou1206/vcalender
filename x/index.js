const fetch = require('node-fetch');
const { TwitterApi } = require('twitter-api-v2');

module.exports = async function (context, myTimer) {
    const csvUrl = 'https://vcalender.blob.core.windows.net/testdata/マスタ.csv';
    const formattedDate = new Date().toISOString().slice(0, 10).replace(/-/g, '/');

    // Twitter API クライアント
    const twitterClient = new TwitterApi({
        appKey: 'fH4SDztHcPqFv7IlwU3XJsiU1',
        appSecret: 'CEouDs3cmIRrbcF2dNcRtAEz9fg3uBhYWFfQMJQ1pJxBgUkuAs',
        accessToken: '1855610904093827072-YjKsmqVfqBk61KJvSvImzG6siIg5nO',
        accessSecret: 'F1jNyepDWWjgESqCHG6HyVWWBUFNtU711Gx6OMXp97FPs',
    });

    try {
        // CSV データの取得
        const response = await fetch(csvUrl);
        const csvText = await response.text();
        const rows = csvText.split('\n').map(row => row.split(','));

        let postMessages = [];
        rows.forEach(row => {
            if (!row[0] || !row[1]) return;

            // 当日イベント処理
            if (row[0] === formattedDate) {
                postMessages.push(`🎉 本日は ${row[1]} 様のお誕生日です！おめでとうございます！🎂`);
            }

            // 記念日イベント処理
            if (row[5]) {
                const [year, month, day] = row[5].split('/').map(Number);
                const today = new Date();
                if (month === today.getMonth() + 1 && day === today.getDate()) {
                    const yearsSince = today.getFullYear() - year;
                    postMessages.push(`✨ ${row[1]} 様の${yearsSince}周年をお祝いしましょう！`);
                }
            }
        });

        // Twitter 投稿
        for (const message of postMessages) {
            await twitterClient.v1.tweet(message);
            context.log(`Tweeted: ${message}`);
        }
    } catch (error) {
        context.log('Error:', error);
    }
};

