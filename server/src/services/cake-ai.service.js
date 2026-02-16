const { fal } = require('@fal-ai/client');
const env = require('../config/env');

// Configure fal.ai client
fal.config({ credentials: env.FAL_KEY });

/**
 * Build a detailed prompt for cake image generation
 */
function buildCakePrompt(specs) {
  const shapeLabel = {
    round: 'round',
    square: 'square',
    heart: 'heart-shaped',
    rectangle: 'rectangular',
    'tiered-2': 'elegant 2-tier',
    'tiered-3': 'grand 3-tier',
  }[specs.shape] || specs.shape;

  const flavorLabel = {
    vanilla: 'vanilla',
    chocolate: 'rich chocolate',
    'red-velvet': 'red velvet',
    butterscotch: 'butterscotch',
    'black-forest': 'Black Forest',
    pineapple: 'pineapple',
    mango: 'fresh mango',
    strawberry: 'strawberry',
    'coffee-mocha': 'coffee mocha',
    fruit: 'mixed fruit',
  }[specs.flavor] || specs.flavor;

  const frostingLabel = {
    buttercream: 'smooth buttercream',
    fondant: 'pristine fondant',
    'whipped-cream': 'fluffy whipped cream',
    ganache: 'glossy chocolate ganache',
    'cream-cheese': 'tangy cream cheese',
  }[specs.frostingType] || specs.frostingType;

  const themeLabel = {
    birthday: 'birthday celebration',
    wedding: 'elegant wedding',
    anniversary: 'romantic anniversary',
    'baby-shower': 'adorable baby shower',
    graduation: 'graduation celebration',
    valentine: "Valentine's Day romantic",
    christmas: 'festive Christmas',
    diwali: 'festive Diwali celebration',
    'generic-celebration': 'joyful celebration',
  }[specs.theme] || specs.theme;

  const fillingDesc = specs.filling && specs.filling !== 'none'
    ? `The cake has a ${specs.filling.replace(/-/g, ' ')} filling visible in a cross-section hint.`
    : '';

  const toppingsDesc = specs.toppings && specs.toppings.length > 0
    ? `Decorated with ${specs.toppings.map((t) => t.replace(/-/g, ' ')).join(', ')} on top.`
    : '';

  const messageDesc = specs.message
    ? `The cake has "${specs.message}" written on it in elegant piped lettering.`
    : '';

  return `A professional bakery photograph of a ${shapeLabel} ${specs.size} ${flavorLabel} cake with ${frostingLabel} frosting in ${specs.frostingColor} color. ${fillingDesc} ${toppingsDesc} The theme is ${themeLabel}. ${messageDesc} The cake is placed on a white cake board on a clean marble surface with soft natural lighting. Shot from a 3/4 elevated angle. Professional food photography, warm tones, appetizing appearance. Highly detailed, photorealistic, 4K quality.`.trim();
}

/**
 * Generate a cake preview image using fal.ai Nano Banana (Gemini 2.5 Flash Image)
 */
async function generateCakePreview(specifications) {
  const prompt = buildCakePrompt(specifications);

  try {
    const result = await fal.subscribe('fal-ai/nano-banana', {
      input: {
        prompt,
        num_images: 1,
        aspect_ratio: '1:1',
        output_format: 'png',
      },
      logs: true,
      onQueueUpdate: (update) => {
        if (update.status === 'IN_PROGRESS' && update.logs) {
          update.logs.forEach((log) => console.log('[Cake AI]', log.message));
        }
      },
    });

    if (result.data && result.data.images && result.data.images.length > 0) {
      return {
        success: true,
        imageUrl: result.data.images[0].url,
        prompt,
      };
    }

    return { success: false, error: 'No image generated' };
  } catch (error) {
    console.error('Cake AI generation error:', error);

    // Fallback: return a helpful error
    return {
      success: false,
      error: error.message || 'Failed to generate cake preview',
      prompt,
    };
  }
}

/**
 * Calculate cake price based on specifications
 */
function calculateCakePrice(specs) {
  // Base prices by size (in INR)
  const basePrices = {
    '0.5 kg': 399,
    '1 kg': 749,
    '1.5 kg': 1099,
    '2 kg': 1449,
    '3 kg': 2149,
    '5 kg': 3499,
  };

  // Flavor multipliers
  const flavorMultipliers = {
    vanilla: 1.0,
    chocolate: 1.1,
    'red-velvet': 1.2,
    butterscotch: 1.05,
    'black-forest': 1.15,
    pineapple: 1.0,
    mango: 1.25,
    strawberry: 1.15,
    'coffee-mocha': 1.15,
    fruit: 1.1,
  };

  // Frosting type multipliers
  const frostingMultipliers = {
    buttercream: 1.0,
    fondant: 1.4,
    'whipped-cream': 0.9,
    ganache: 1.2,
    'cream-cheese': 1.15,
  };

  // Shape surcharges
  const shapeSurcharges = {
    round: 0,
    square: 50,
    heart: 100,
    rectangle: 50,
    'tiered-2': 500,
    'tiered-3': 1200,
  };

  // Topping prices
  const toppingPrices = {
    'fresh-fruits': 100,
    'chocolate-shavings': 50,
    sprinkles: 30,
    'edible-flowers': 150,
    nuts: 80,
    macarons: 200,
    'fondant-figures': 300,
    'gold-silver-leaf': 250,
  };

  // Filling prices
  const fillingPrices = {
    none: 0,
    'chocolate-ganache': 100,
    'fruit-compote': 120,
    caramel: 80,
    nutella: 150,
    cream: 50,
    jam: 60,
  };

  let basePrice = basePrices[specs.size] || 749;
  const flavorMul = flavorMultipliers[specs.flavor] || 1.0;
  const frostingMul = frostingMultipliers[specs.frostingType] || 1.0;
  const shapeSurcharge = shapeSurcharges[specs.shape] || 0;
  const fillingPrice = fillingPrices[specs.filling] || 0;

  let toppingsTotal = 0;
  if (specs.toppings && specs.toppings.length > 0) {
    toppingsTotal = specs.toppings.reduce((sum, t) => sum + (toppingPrices[t] || 0), 0);
  }

  // Photo print surcharge
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

module.exports = {
  generateCakePreview,
  calculateCakePrice,
  buildCakePrompt,
};
