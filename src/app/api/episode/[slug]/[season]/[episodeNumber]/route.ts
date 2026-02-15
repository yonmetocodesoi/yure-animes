
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

// Configuração de headers para simular um navegador real perfeitamente
const GHOST_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Upgrade-Insecure-Requests': '1'
};

async function searchAnimeFire(slug: string, season: string, episode: string) {
    const domains = ['https://animefire.plus', 'https://animefire.net', 'https://animefire.io'];
    for (const domain of domains) {
        const url = `${domain}/video/${slug}/${episode}`;
        try {
            const response = await axios.get(url, {
                headers: {
                    ...GHOST_HEADERS,
                    'Referer': `${domain}/`
                },
                timeout: 5000
            });

            if (response.data && response.data.data && Array.isArray(response.data.data)) {
                return { error: false, searched_endpoint: url, episode: response.data.data[0].src };
            }

            const $ = cheerio.load(response.data);
            const videoSrc = $('#video_player_html5_api source').attr('src') || $('video source').attr('src');

            if (videoSrc) {
                return { error: false, searched_endpoint: url, episode: videoSrc };
            }
        } catch (e: any) {
            continue;
        }
    }
    return { error: true, searched_endpoint: 'AnimeFire All Domains', episode: null };
}

async function searchAnimesOnlineCC(slug: string, season: string, episode: string) {
    // Try multiple patterns
    const urls = [
        `https://animesonlinecc.to/episodio/${slug}-episodio-${episode}`,
        `https://animesonlinecc.to/episodio/${slug}`, // Generic slug
        `https://animesonlinecc.to/filme/${slug}`
    ];

    for (const url of urls) {
        try {
            const response = await axios.get(url, {
                headers: GHOST_HEADERS,
                timeout: 5000
            });

            const $ = cheerio.load(response.data);

            // Logic inspired by the provided API: look for metaframe rptss
            const iframes: string[] = [];
            $('iframe.metaframe.rptss').each((i, el) => {
                const src = $(el).attr('src');
                if (src) iframes.push(src.startsWith('//') ? `https:${src}` : src);
            });

            if (iframes.length > 0) {
                // If there are multiple, usually [0] is dubbed and [1] is sub, or vice versa
                // We'll return the one that likely matches or just the primary one
                return { error: false, searched_endpoint: url, episode: iframes[iframes.length > 1 ? 1 : 0], all_options: iframes };
            }

            // Fallback to any iframe if special one not found
            const anyIframe = $('iframe').attr('src');
            if (anyIframe) {
                const final = anyIframe.startsWith('//') ? `https:${anyIframe}` : anyIframe;
                return { error: false, searched_endpoint: url, episode: final };
            }
        } catch (e: any) {
            continue;
        }
    }
    return { error: true, searched_endpoint: urls[0], episode: null };
}

export async function GET(
    request: NextRequest,
    context: any
) {
    const params = await context.params;
    const { slug, season, episodeNumber } = params;

    const [fire, online] = await Promise.all([
        searchAnimeFire(slug, season, episodeNumber).catch(() => ({ error: true, episode: null })),
        searchAnimesOnlineCC(slug, season, episodeNumber).catch(() => ({ error: true, episode: null }))
    ]);

    const results = [
        {
            name: 'VIP MASTER [BRASIL] 1',
            slug: 'anime-fire',
            has_ads: false,
            is_embed: false,
            episodes: [fire]
        },
        {
            name: 'VIP MASTER [BRASIL] 2',
            slug: 'animes-online-cc',
            has_ads: false,
            is_embed: true,
            episodes: [online]
        }
    ];

    const found = results.some(r => r.episodes.some(e => e && !e.error));

    if (!found) {
        return NextResponse.json({
            error: true,
            message: "Not Found",
            status: 404
        }, { status: 404 });
    }

    return NextResponse.json({
        error: false,
        message: "Success",
        status: 200,
        data: results
    });
}
