const axios = require('axios');

async function aio(url) {
    try {
        if (!url || !url.includes('https://')) throw new Error('URL tidak valid');

        const { data } = await axios.post('https://auto-download-all-in-one.p.rapidapi.com/v1/social/autolink', 
            { url },
            {
                headers: {
                    'content-type': 'application/json',
                    'x-rapidapi-host': 'auto-download-all-in-one.p.rapidapi.com',
                    'x-rapidapi-key': '1dda0d29d3mshc5f2aacec619c44p16f219jsn99a62a516f98'
                }
            }
        );

        return data;
    } catch (error) {
        throw new Error(error?.response?.data?.message || error.message);
    }
}

module.exports = aio;
