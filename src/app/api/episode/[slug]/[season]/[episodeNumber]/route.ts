
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
    'Sec-Ch-Ua': '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"',
    'Sec-Ch-Ua-Mobile': '?0',
    'Sec-Ch-Ua-Platform': '"Windows"',
    'Sec-Fetch-Dest': 'document',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-Site': 'none',
    'Sec-Fetch-User': '?1',
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
                timeout: 5000 // Timeout curto para não travar a função da Netlify
            });

            // Se retornar JSON direto (comum no AnimeFire novo)
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
    const url = `https://animesonlinecc.to/episodio/${slug}-episodio-${episode}`;
    try {
        const response = await axios.get(url, {
            headers: GHOST_HEADERS,
            timeout: 5000
        });

        const $ = cheerio.load(response.data);
        const iframeSrc = $('iframe').attr('src');

        if (iframeSrc) {
            // Se for um link relativo do próprio site
            const finalIframe = iframeSrc.startsWith('//') ? `https:${iframeSrc}` : iframeSrc;
            return { error: false, searched_endpoint: url, episode: finalIframe };
        }
    } catch (e: any) {
        // Tentar modo filme se falhar modo episódio
        try {
            const movieUrl = `https://animesonlinecc.to/filme/${slug}`;
            const movieRes = await axios.get(movieUrl, { headers: GHOST_HEADERS, timeout: 4000 });
            const $m = cheerio.load(movieRes.data);
            const mIframe = $m('iframe').attr('src');
            if (mIframe) return { error: false, searched_endpoint: movieUrl, episode: mIframe };
        } catch (err) { }
    }
    return { error: true, searched_endpoint: url, episode: null };
}

export async function GET(
    request: NextRequest,
    context: any
) {
    const params = await context.params;
    const { slug, season, episodeNumber } = params;

    // Usando race/settled com limites para garantir que a Netlify responda antes do timeout de 10s
    const results_promises = [
        searchAnimeFire(slug, season, episodeNumber),
        searchAnimesOnlineCC(slug, season, episodeNumber)
    ];

    const [fire, online] = await Promise.all(results_promises.map(p => p.catch(e => ({ error: true, episode: null }))));

    const results = [
        {
            name: 'Anime Fire',
            slug: 'anime-fire',
            has_ads: false,
            is_embed: false,
            episodes: [fire]
        },
        {
            name: 'Animes Online CC',
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
            message: "Conteúdo não disponível nos servidores (Bloqueio de IP da Hospedagem)",
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
