
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
        return new NextResponse('Missing URL', { status: 400 });
    }

    try {
        const clientHeaders = Object.fromEntries(request.headers.entries());

        const headers: Record<string, string> = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Accept': clientHeaders['accept'] || '*/*',
            'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
            'Connection': 'keep-alive',
        };

        if (clientHeaders['range']) {
            headers['Range'] = clientHeaders['range'];
        }

        // Adaptive Referer/Origin with advanced anti-bot bypass
        if (url.includes('lightspeedst.net') || url.includes('animefire')) {
            headers['Referer'] = 'https://animefire.plus/';
            headers['Origin'] = 'https://animefire.plus';
            // Mimic Chrome on Windows to reduce bot detection
            headers['Sec-Ch-Ua'] = '"Not A(Brand";v="99", "Google Chrome";v="121", "Chromium";v="121"';
            headers['Sec-Ch-Ua-Mobile'] = '?0';
            headers['Sec-Ch-Ua-Platform'] = '"Windows"';
        } else if (url.includes('anilist.co')) {
            headers['Referer'] = 'https://anilist.co/';
        } else if (url.includes('animesonlinecc')) {
            headers['Referer'] = 'https://animesonlinecc.to/';
            headers['User-Agent'] = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36';
        } else {
            // Default referer based on URL domain
            try {
                const urlObj = new URL(url);
                headers['Referer'] = `${urlObj.protocol}//${urlObj.hostname}/`;
            } catch (e) { }
        }

        const response = await fetch(url, {
            headers,
        });

        if (!response.ok && response.status !== 206) {
            return new NextResponse(`Failed to fetch: ${response.statusText}`, { status: response.status });
        }

        const responseHeaders = new Headers();
        const contentType = response.headers.get('content-type');
        const contentLength = response.headers.get('content-length');
        const contentRange = response.headers.get('content-range');

        if (contentType) responseHeaders.set('Content-Type', contentType);
        if (contentLength) responseHeaders.set('Content-Length', contentLength);
        if (contentRange) responseHeaders.set('Content-Range', contentRange);

        responseHeaders.set('Access-Control-Allow-Origin', '*');
        responseHeaders.set('Accept-Ranges', 'bytes');
        responseHeaders.set('Cache-Control', 'public, max-age=86400'); // 24h cache

        return new NextResponse(response.body, {
            status: response.status,
            headers: responseHeaders,
        });

    } catch (error: any) {
        return new NextResponse(error.message, { status: 500 });
    }
}
