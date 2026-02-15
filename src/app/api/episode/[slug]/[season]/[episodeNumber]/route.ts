
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

const GHOST_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
};

// --- Busca TMDB ID automaticamente pelo titulo ---
async function resolveTmdbId(title: string): Promise<string | null> {
    try {
        // Limpar titulo para busca
        const cleanTitle = title
            .replace(/-dublado|-dub|-legendado/gi, '')
            .replace(/-/g, ' ')
            .trim();

        // Usar a API gratuita do TMDB (v3) 
        const searchUrl = `https://api.themoviedb.org/3/search/tv?query=${encodeURIComponent(cleanTitle)}&language=pt-BR&api_key=d56e51fb77b081a9cb5192571b7c672d`;
        const res = await axios.get(searchUrl, { timeout: 3000 });
        if (res.data.results && res.data.results.length > 0) {
            return res.data.results[0].id.toString();
        }
        // Tentar como filme
        const movieUrl = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(cleanTitle)}&language=pt-BR&api_key=d56e51fb77b081a9cb5192571b7c672d`;
        const movieRes = await axios.get(movieUrl, { timeout: 3000 });
        if (movieRes.data.results && movieRes.data.results.length > 0) {
            return movieRes.data.results[0].id.toString();
        }
    } catch (e) { }
    return null;
}

async function searchAnimeFire(slug: string, season: string, episode: string) {
    const domains = ['https://animefire.plus', 'https://animefire.net'];
    for (const domain of domains) {
        try {
            const url = `${domain}/video/${slug}/${episode}`;
            const response = await axios.get(url, {
                headers: { ...GHOST_HEADERS, 'Referer': `${domain}/` },
                timeout: 5000
            });

            if (response.data?.data?.[0]?.src) {
                return { error: false, episode: response.data.data[0].src };
            }
            const $ = cheerio.load(response.data);
            const videoSrc = $('video source').attr('src');
            if (videoSrc) return { error: false, episode: videoSrc };
        } catch (e) { }
    }
    return { error: true, episode: null };
}

async function searchAnimesOnlineCC(slug: string, season: string, episode: string) {
    const urls = [
        `https://animesonlinecc.to/episodio/${slug}-episodio-${episode}`,
        `https://animesonlinecc.to/episodio/${slug}`,
    ];
    for (const url of urls) {
        try {
            const response = await axios.get(url, { headers: GHOST_HEADERS, timeout: 5000 });
            const $ = cheerio.load(response.data);
            const embed = $('iframe.metaframe.rptss').attr('src') || $('iframe').attr('src');
            if (embed) return { error: false, episode: embed.startsWith('//') ? `https:${embed}` : embed };
        } catch (e) { }
    }
    return { error: true, episode: null };
}

export async function GET(request: NextRequest, context: any) {
    const params = await context.params;
    const { slug, season, episodeNumber } = params;
    const { searchParams } = new URL(request.url);
    let tmdbId = searchParams.get('tmdbId') || '';
    const type = searchParams.get('type') || 'serie';
    const isMovie = type === 'movie';

    // 1. Tentar resolver TMDB ID se não foi fornecido
    if (!tmdbId) {
        const resolved = await resolveTmdbId(slug);
        if (resolved) tmdbId = resolved;
    }

    // 2. Buscar nos scrapers BR (em paralelo)
    const [fire, online] = await Promise.all([
        searchAnimeFire(slug, season, episodeNumber).catch(() => ({ error: true, episode: null })),
        searchAnimesOnlineCC(slug, season, episodeNumber).catch(() => ({ error: true, episode: null })),
    ]);

    const results: any[] = [];

    // Adicionar scrapers que encontraram algo
    if (fire && !fire.error && fire.episode) {
        results.push({ name: 'VIP MASTER 1 [BRASIL]', slug: 'fire', is_embed: false, episodes: [fire] });
    }
    if (online && !online.error && online.episode) {
        results.push({ name: 'VIP MASTER 2 [BRASIL]', slug: 'online', is_embed: true, episodes: [online] });
    }

    // 3. SEMPRE adicionar servidores de embed (não dependem de scraping)
    if (tmdbId) {
        results.push({
            name: 'VIP MASTER Play [BR]',
            slug: 'smashy',
            is_embed: true,
            episodes: [{
                error: false,
                episode: isMovie
                    ? `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}`
                    : `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}&season=${season}&episode=${episodeNumber}`
            }]
        });
        results.push({
            name: 'VIP MASTER 4K [BR]',
            slug: 'vidsrc-pm',
            is_embed: true,
            episodes: [{
                error: false,
                episode: isMovie
                    ? `https://vidsrc.pm/embed/movie/${tmdbId}`
                    : `https://vidsrc.pm/embed/tv/${tmdbId}/${season}/${episodeNumber}`
            }]
        });
        results.push({
            name: 'Global Play (HD)',
            slug: 'vidsrc-me',
            is_embed: true,
            episodes: [{
                error: false,
                episode: isMovie
                    ? `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`
                    : `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&sea=${season}&ep=${episodeNumber}`
            }]
        });
    }

    // SEMPRE retornar 200 com o que tiver (nunca 404)
    return NextResponse.json({
        error: results.length === 0,
        message: results.length > 0 ? 'Success' : 'No sources found',
        tmdbId: tmdbId || null,
        data: results
    });
}
