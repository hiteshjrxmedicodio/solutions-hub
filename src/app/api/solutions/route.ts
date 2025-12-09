import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import SolutionCard from '@/models/SolutionCard';

export async function GET() {
  try {
    await connectDB();

    const cards = await SolutionCard.find({})
      .sort({ id: 1 })
      .lean()
      .exec();

    return NextResponse.json(
      {
        success: true,
        data: cards,
        count: cards.length,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching solution cards:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch solution cards',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

