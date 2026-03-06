// 文件路径: weather-app/api/weather.js

export default async function handler(req, res) {
    // 1. 密钥现在安全地藏在服务器后端，前端绝对看不到！
    const CHANNEL_ID = '3288396'; 
    const READ_API_KEY = 'JUDMG2J8A59TGVI0';
    const url = `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${READ_API_KEY}&results=1`;

    try {
        // 后端服务器去向 ThingSpeak 索要数据
        const response = await fetch(url);
        const data = await response.json();

        if (data.feeds && data.feeds.length > 0) {
            let t = parseFloat(data.feeds[0].field1);
            let h = parseFloat(data.feeds[0].field2);

            // 2. 将“繁重”的计算逻辑转移到后端服务器执行
            let feelsLike = t > 25 ? t + (h - 40) * 0.05 : (t < 15 ? t - (h * 0.02) : t);
            
            let statusDesc = "😊 气候适宜";
            if (t >= 30) statusDesc = "🥵 酷热难耐";
            else if (t <= 15) statusDesc = "🥶 寒气袭人";

            // 3. 将处理得干干净净的数据，打包发送给前端网页
            res.status(200).json({
                success: true,
                temperature: t,
                humidity: h,
                feels_like: feelsLike.toFixed(1),
                description: statusDesc,
                server_time: new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
            });
        } else {
            res.status(404).json({ success: false, message: "未找到传感器数据" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "服务器内部错误" });
    }
}