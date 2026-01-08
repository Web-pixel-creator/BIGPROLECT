import fetch from 'node-fetch';

const apiKey = process.env.MODELSCOPE_API_KEY?.trim();
const url = 'https://api-inference.modelscope.cn/v1/chat/completions';

async function testConnection() {
    if (!apiKey || apiKey.length < 10) {
        console.error('Missing MODELSCOPE_API_KEY environment variable.');
        process.exit(1);
    }

    console.log('Testing ModelScope API with key:', `${apiKey.slice(0, 3)}...${apiKey.slice(-3)}`);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'iic/QwenLong-L1.5-30B-A3B',
                messages: [
                    { role: 'user', content: 'Hello, are you working?' }
                ],
                max_tokens: 100
            })
        });

        console.log('Status:', response.status);
        console.log('Status Text:', response.statusText);

        const text = await response.text();
        console.log('Response Body:', text);

    } catch (error) {
        console.error('Error:', error);
    }
}

testConnection();
