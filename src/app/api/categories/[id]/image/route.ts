import { NextRequest, NextResponse } from 'next/server';

interface Params {
    id: string;
}

const API_URL = process.env.API_URL;

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<Params> }
) {
    const { id } = await params;

    const res = await fetch(`${API_URL}/categories/${id}/image`, { next: { revalidate: 3600 }});

    if (!res.ok) {
        return NextResponse.json({ error: 'Image not found' }, { status: res.status });
    }

    const imageBuffer = await res.arrayBuffer();
    
    const contentType = res.headers.get('content-type') || 'image/jpeg';

    return new NextResponse(imageBuffer, {
        status: 200,
        headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000',
        },
    });
}