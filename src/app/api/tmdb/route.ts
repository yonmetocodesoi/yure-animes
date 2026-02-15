
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const type = searchParams.get('type') || 'multi';

    if (!query) {
        return NextResponse.json({ error: true, message: 'Missing query' }, { status: 400 });
    }

    try {
        const apiKey = '15d1a9983d3246a1adb2a4d048497274';
        const url = `https://api.themoviedb.org/3/search/${type}?api_key=${apiKey}&query=${encodeURIComponent(query)}&language=pt-BR`;

        const res = await fetch(url);
        const data = await res.json();

        const result = data.results?.[0];
        if (result) {
            return NextResponse.json({
                error: false,
                id: result.id,
                title: result.title || result.name,
                type: result.media_type || (type === 'tv' ? 'tv' : 'movie')
            });
        }

        // Try without language if PT-BR fails
        const urlEn = `https://api.themoviedb.org/3/search/${type}?api_key=${apiKey}&query=${encodeURIComponent(query)}`;
        const resEn = await fetch(urlEn);
        const dataEn = await resEn.json();
        const resultEn = dataEn.results?.[0];

        if (resultEn) {
            return NextResponse.json({
                error: false,
                id: resultEn.id,
                title: resultEn.title || resultEn.name,
                type: resultEn.media_type || (type === 'tv' ? 'tv' : 'movie')
            });
        }

        return NextResponse.json({ error: true, message: 'Not found' }, { status: 404 });
    } catch (e: any) {
        return NextResponse.json({ error: true, message: e.message }, { status: 500 });
    }
}
