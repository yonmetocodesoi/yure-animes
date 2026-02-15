
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
    const { id } = params;

    try {
        const LOCAL_SERVER = 'https://sugoi-br-api.loca.lt';

        // 1. Tentar servidor local
        try {
            const localRes = await axios.get(`${LOCAL_SERVER}/api/details/${id}`, {
                headers: { 'Bypass-Tunnel-Reminder': 'true' },
                timeout: 5000
            });
            if (localRes.data && !localRes.data.error) {
                return NextResponse.json(localRes.data);
            }
        } catch (e) {
            console.log("Local details failed, trying direct...");
        }

        const url = `https://animesonlinecc.to/anime/${id}`;
        const response = await axios.get(url, {
            headers: GHOST_HEADERS,
            timeout: 5000
        });

        const $ = cheerio.load(response.data);

        const seasons: any[] = [];

        $('.se-c').each((i, seasonEl) => {
            const seasonNumber = $(seasonEl).find('.title').text().trim();
            const episodes: any[] = [];

            $(seasonEl).find('.episodes li').each((j, epEl) => {
                const epAnchor = $(epEl).find('.poster a');
                const epHref = epAnchor.attr('href') || '';
                const epSlug = epHref.split('/').filter(Boolean).pop();
                const epImage = $(epEl).find('.poster img').attr('src');
                const epDate = $(epEl).find('.metadata .date').text().trim();

                if (epSlug) {
                    episodes.push({
                        slug: epSlug,
                        image: epImage,
                        date: epDate
                    });
                }
            });

            seasons.push({
                seasonNumber,
                episodes
            });
        });

        return NextResponse.json({
            error: false,
            data: {
                title: $('.data h1').text().trim(),
                image: $('.poster img').attr('src'),
                synopsis: $('.resumotemp p').text().trim(),
                rating: $('.dt_rating_vgs').text().trim(),
                seasons
            }
        });

    } catch (e: any) {
        return NextResponse.json({
            error: true,
            message: e.message
        }, { status: 500 });
    }
}
