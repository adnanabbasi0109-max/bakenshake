import { NextRequest, NextResponse } from "next/server";
import { fal } from "@fal-ai/client";

fal.config({ credentials: process.env.FAL_KEY! });

function calculateCakePrice(specs: Record<string, string | string[]>) {
  const basePrices: Record<string, number> = {
    "0.5 kg": 399, "1 kg": 749, "1.5 kg": 1099, "2 kg": 1449, "3 kg": 2149, "5 kg": 3499,
  };
  const flavorMul: Record<string, number> = {
    vanilla: 1.0, chocolate: 1.1, "red-velvet": 1.2, butterscotch: 1.05, "black-forest": 1.15,
    pineapple: 1.0, mango: 1.25, strawberry: 1.15, "coffee-mocha": 1.15, fruit: 1.1,
  };
  const frostingMul: Record<string, number> = {
    buttercream: 1.0, fondant: 1.4, "whipped-cream": 0.9, ganache: 1.2, "cream-cheese": 1.15,
  };
  const shapeSur: Record<string, number> = {
    round: 0, square: 50, heart: 100, rectangle: 50, "tiered-2": 500, "tiered-3": 1200,
  };
  const toppingPrices: Record<string, number> = {
    "fresh-fruits": 100, "chocolate-shavings": 50, sprinkles: 30, "edible-flowers": 150,
    nuts: 80, macarons: 200, "fondant-figures": 300, "gold-silver-leaf": 250,
  };
  const fillingPrices: Record<string, number> = {
    none: 0, "chocolate-ganache": 100, "fruit-compote": 120, caramel: 80, nutella: 150, cream: 50, jam: 60,
  };

  const basePrice = basePrices[specs.size as string] || 749;
  const fm = flavorMul[specs.flavor as string] || 1.0;
  const frm = frostingMul[specs.frostingType as string] || 1.0;
  const ss = shapeSur[specs.shape as string] || 0;
  const fp = fillingPrices[specs.filling as string] || 0;
  const toppings = specs.toppings as string[] | undefined;
  const tt = toppings?.reduce((s, t) => s + (toppingPrices[t] || 0), 0) ?? 0;
  const ps = specs.photoUploadUrl ? 200 : 0;

  return {
    basePrice, flavorMultiplier: fm, frostingMultiplier: frm,
    shapeSurcharge: ss, fillingPrice: fp, toppingsTotal: tt, photoSurcharge: ps,
    total: Math.round(basePrice * fm * frm + ss + fp + tt + ps),
  };
}

function buildCakePrompt(specs: Record<string, string | string[]>) {
  const shapeLabel: Record<string, string> = {
    round: "round",
    square: "square",
    heart: "heart-shaped",
    rectangle: "rectangular",
    "tiered-2": "elegant 2-tier",
    "tiered-3": "grand 3-tier",
  };

  const flavorLabel: Record<string, string> = {
    vanilla: "vanilla",
    chocolate: "rich chocolate",
    "red-velvet": "red velvet",
    butterscotch: "butterscotch",
    "black-forest": "Black Forest",
    pineapple: "pineapple",
    mango: "fresh mango",
    strawberry: "strawberry",
    "coffee-mocha": "coffee mocha",
    fruit: "mixed fruit",
  };

  const frostingLabel: Record<string, string> = {
    buttercream: "smooth buttercream",
    fondant: "pristine fondant",
    "whipped-cream": "fluffy whipped cream",
    ganache: "glossy chocolate ganache",
    "cream-cheese": "tangy cream cheese",
  };

  const themeLabel: Record<string, string> = {
    birthday: "birthday celebration",
    wedding: "elegant wedding",
    anniversary: "romantic anniversary",
    "baby-shower": "adorable baby shower",
    graduation: "graduation celebration",
    valentine: "Valentine's Day romantic",
    christmas: "festive Christmas",
    diwali: "festive Diwali celebration",
    "generic-celebration": "joyful celebration",
  };

  const shape = shapeLabel[specs.shape as string] || specs.shape;
  const flavor = flavorLabel[specs.flavor as string] || specs.flavor;
  const frosting = frostingLabel[specs.frostingType as string] || specs.frostingType;
  const theme = themeLabel[specs.theme as string] || specs.theme;

  const fillingDesc =
    specs.filling && specs.filling !== "none"
      ? `The cake has a ${(specs.filling as string).replace(/-/g, " ")} filling visible in a cross-section hint.`
      : "";

  const toppings = specs.toppings as string[] | undefined;
  const toppingsDesc =
    toppings && toppings.length > 0
      ? `Decorated with ${toppings.map((t) => t.replace(/-/g, " ")).join(", ")} on top.`
      : "";

  const messageDesc = specs.message
    ? `The cake has "${specs.message}" written on it in elegant piped lettering.`
    : "";

  return `A professional bakery photograph of a ${shape} ${specs.size} ${flavor} cake with ${frosting} frosting in ${specs.frostingColor} color. ${fillingDesc} ${toppingsDesc} The theme is ${theme}. ${messageDesc} The cake is placed on a white cake board on a clean marble surface with soft natural lighting. Shot from a 3/4 elevated angle. Professional food photography, warm tones, appetizing appearance. Highly detailed, photorealistic, 4K quality.`.trim();
}

export async function POST(request: NextRequest) {
  try {
    const { specifications } = await request.json();

    if (
      !specifications ||
      !specifications.shape ||
      !specifications.flavor ||
      !specifications.frostingType
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required specifications (shape, flavor, frostingType)" },
        { status: 400 }
      );
    }

    const prompt = buildCakePrompt(specifications);
    const pricing = calculateCakePrice(specifications);

    const result = await fal.subscribe("fal-ai/nano-banana", {
      input: {
        prompt,
        num_images: 1,
        aspect_ratio: "1:1",
        output_format: "png",
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === "IN_PROGRESS" && update.logs) {
          update.logs.forEach((log) => console.log("[Cake AI]", log.message));
        }
      },
    });

    const images = (result.data as Record<string, unknown>)?.images as { url: string }[] | undefined;

    if (images && images.length > 0) {
      return NextResponse.json({
        success: true,
        data: {
          imageUrl: images[0].url,
          prompt,
          pricing,
        },
      });
    }

    return NextResponse.json(
      { success: false, message: "No image generated", pricing },
      { status: 500 }
    );
  } catch (error) {
    console.error("Cake AI generation error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Failed to generate cake preview",
      },
      { status: 500 }
    );
  }
}
