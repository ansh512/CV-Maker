// app/api/huggingface/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.json();
    const { prompt } = body;
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const HF_API_TOKEN = process.env.HUGGINGFACE_API_KEY;
    if (!HF_API_TOKEN) {
      return NextResponse.json({ error: 'Hugging Face API key not configured' }, { status: 500 });
    }

    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${HF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { max_new_tokens: 100 },
        }),
      }
    );

    if (!response.ok) {
      return NextResponse.json({ error: 'Hugging Face API request failed' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}