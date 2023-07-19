import { NextRequest, NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";

const parser = new XMLParser();

export async function GET(req: NextRequest) {
  try {
    const feed = await fetch('https://trends.google.com/trends/trendingsearches/daily/rss?geo=US');

    const feedData = await feed.text();

    // Parse the XML to JSON
    let jObj = parser.parse(feedData);

    return NextResponse.json(jObj);
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
