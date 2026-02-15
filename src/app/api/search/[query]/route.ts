
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

const GHOST_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
};

export async function GET(
    request: NextRequest,
    context: any
) {
    const params = await context.params;
    const { query } = params;

    try {
        const LOCAL_SERVER = 'https://sugoi-br-api.loca.lt';

        // 1. Tentar servidor local (Bypass 403 do Netlify)
        try {
            const localRes = await axios.get(`${LOCAL_SERVER}/api/search/${encodeURIComponent(query)}`, {
                headers: { 'Bypass-Tunnel-Reminder': 'true' },
                timeout: 5000
            });
            if (localRes.data && !localRes.data.error) {
                return NextResponse.json(localRes.data);
            }
        } catch (e) {
            console.log("Local search failed, trying direct...");
        }

        // 2. Fallback direta (pode falhar no Netlify)
        const url = `https://animesonlinecc.to/search/${encodeURIComponent(query)}/`;
        const response = await axios.get(url, {
            headers: GHOST_HEADERS,
            timeout: 5000
        });

        const $ = cheerio.load(response.data);
        const results: any[] = [];

        $('article').each((i, el) => {
            const anchor = $(el).find('div.poster > a');
            let image = $(el).find('div.poster > a > img').attr('src');

            if (image && image.startsWith('/')) {
                image = `https://animesonlinecc.to${image}`;
            }

            const rating = $(el).find('div.poster > div.rating').text().trim();
            const title = $(el).find('div.data > h3').text().trim();
            const href = anchor.attr('href') || '';
            const slug = href.split('/').filter(Boolean).pop();

            if (slug && title) {
                results.push({
                    title,
                    slug,
                    image,
                    rating: rating || '10.0',
                    category: 'Anime',
                    status: 'Online',
                    description: 'Resultado da busca global.',
                    type: href.includes('/anime/') ? 'serie' : 'movie'
                });
            }
        });

        return NextResponse.json({
            error: false,
            data: results
        });

    } catch (e: any) {
        return NextResponse.json({
            error: true,
            message: e.message
        }, { status: 500 });
    }
}
