const MARKET_URL = "https://snipework.com/api/market";

export async function GET() {
  try {
    const response = await fetch(MARKET_URL, { next: { revalidate: 300 } });
    const payload = await response.json();

    if (!response.ok) {
      return Response.json(
        { message: "Market data provider returned an error." },
        { status: response.status },
      );
    }

    return Response.json(payload);
  } catch {
    return Response.json(
      { message: "Unable to load live market data." },
      { status: 502 },
    );
  }
}
