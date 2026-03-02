import { NextRequest, NextResponse } from "next/server";

function calculateCakePrice(specs: Record<string, string | string[]>) {
  const basePrices: Record<string, number> = {
    "0.5 kg": 399,
    "1 kg": 749,
    "1.5 kg": 1099,
    "2 kg": 1449,
    "3 kg": 2149,
    "5 kg": 3499,
  };

  const flavorMultipliers: Record<string, number> = {
    vanilla: 1.0,
    chocolate: 1.1,
    "red-velvet": 1.2,
    butterscotch: 1.05,
    "black-forest": 1.15,
    pineapple: 1.0,
    mango: 1.25,
    strawberry: 1.15,
    "coffee-mocha": 1.15,
    fruit: 1.1,
  };

  const frostingMultipliers: Record<string, number> = {
    buttercream: 1.0,
    fondant: 1.4,
    "whipped-cream": 0.9,
    ganache: 1.2,
    "cream-cheese": 1.15,
  };

  const shapeSurcharges: Record<string, number> = {
    round: 0,
    square: 50,
    heart: 100,
    rectangle: 50,
    "tiered-2": 500,
    "tiered-3": 1200,
  };

  const toppingPrices: Record<string, number> = {
    "fresh-fruits": 100,
    "chocolate-shavings": 50,
    sprinkles: 30,
    "edible-flowers": 150,
    nuts: 80,
    macarons: 200,
    "fondant-figures": 300,
    "gold-silver-leaf": 250,
  };

  const fillingPrices: Record<string, number> = {
    none: 0,
    "chocolate-ganache": 100,
    "fruit-compote": 120,
    caramel: 80,
    nutella: 150,
    cream: 50,
    jam: 60,
  };

  const basePrice = basePrices[specs.size as string] || 749;
  const flavorMul = flavorMultipliers[specs.flavor as string] || 1.0;
  const frostingMul = frostingMultipliers[specs.frostingType as string] || 1.0;
  const shapeSurcharge = shapeSurcharges[specs.shape as string] || 0;
  const fillingPrice = fillingPrices[specs.filling as string] || 0;

  const toppings = specs.toppings as string[] | undefined;
  let toppingsTotal = 0;
  if (toppings && toppings.length > 0) {
    toppingsTotal = toppings.reduce((sum, t) => sum + (toppingPrices[t] || 0), 0);
  }

  const photoSurcharge = specs.photoUploadUrl ? 200 : 0;

  const total = Math.round(
    basePrice * flavorMul * frostingMul + shapeSurcharge + fillingPrice + toppingsTotal + photoSurcharge
  );

  return {
    basePrice,
    flavorMultiplier: flavorMul,
    frostingMultiplier: frostingMul,
    shapeSurcharge,
    fillingPrice,
    toppingsTotal,
    photoSurcharge,
    total,
  };
}

export async function POST(request: NextRequest) {
  try {
    const { specifications } = await request.json();

    if (!specifications || !specifications.shape || !specifications.flavor || !specifications.frostingType) {
      return NextResponse.json(
        { success: false, message: "Missing required specifications" },
        { status: 400 }
      );
    }

    const pricing = calculateCakePrice(specifications);

    return NextResponse.json({
      success: true,
      data: pricing,
    });
  } catch (error) {
    console.error("Price calculation error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to calculate price" },
      { status: 500 }
    );
  }
}
