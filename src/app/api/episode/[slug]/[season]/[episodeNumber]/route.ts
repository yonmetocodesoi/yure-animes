
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';

const GHOST_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
};

async function searchAnimeFire(slug: string, season: string, episode: string) {
    const url = `https://animefire.plus/video/${slug}/${episode}`;
    try {
        const response = await axios.get(url, { headers: GHOST_HEADERS, timeout: 5000 });
        const $ = cheerio.load(response.data);
        const videoSrc = $('#video_player_html5_api source').attr('src') || $('video source').attr('src');
        if (videoSrc) return { error: false, episode: videoSrc };
    } catch (e) { }
    return { error: true, episode: null };
}

async function searchAnimesOnlineCC(slug: string, season: string, episode: string) {
    const url = `https://animesonlinecc.to/episodio/${slug}-episodio-${episode}`;
    try {
        const response = await axios.get(url, { headers: GHOST_HEADERS, timeout: 5000 });
        const $ = cheerio.load(response.data);
        const embed = $('iframe.metaframe.rptss').attr('src') || $('iframe').attr('src');
        if (embed) return { error: false, episode: embed.startsWith('//') ? `https:${embed}` : embed };
    } catch (e) { }
    return { error: true, episode: null };
}

async function searchGoGoAnime(slug: string, episode: string) {
    try {
        const url = `https://gogoanime3.co/${slug}-episode-${episode}`;
        const response = await axios.get(url, { headers: GHOST_HEADERS, timeout: 5000 });
        const $ = cheerio.load(response.data);
        const embed = $('.vidstreaming a').attr('data-video') || $('iframe').attr('src');
        if (embed) return { error: false, episode: embed.startsWith('//') ? `https:${embed}` : embed };
    } catch (e) { }
    return { error: true, episode: null };
}

export async function GET(request: NextRequest, context: any) {
    const params = await context.params;
    const { slug, season, episodeNumber } = params;
    const { searchParams } = new URL(request.url);
    const tmdbId = searchParams.get('tmdbId');

    const [fire, online, gogo] = await Promise.all([
        searchAnimeFire(slug, season, episodeNumber),
        searchAnimesOnlineCC(slug, season, episodeNumber),
        searchGoGoAnime(slug, episodeNumber)
    ]);

    const results = [
        { name: 'VIP MASTER 1 [BRASIL]', slug: 'fire', episodes: [fire] },
        { name: 'VIP MASTER 2 [BRASIL]', slug: 'online', episodes: [online] },
        { name: 'VIP MASTER Retro [BR]', slug: 'gogo', episodes: [gogo] }
    ];

    if (tmdbId) {
        results.push({
            name: 'VIP MASTER Turbo [BR]',
            slug: 'vidsrc',
            episodes: [{ error: false, episode: `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&sea=${season}&ep=${episodeNumber}` }]
        });
    }

    const filtered = results.filter(r => r.episodes[0] && !r.episodes[0].error);

    return NextResponse.json({
        error: filtered.length === 0,
        data: filtered
    });
}
