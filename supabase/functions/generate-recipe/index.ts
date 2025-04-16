import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  Deno.env.get('https://yghaowgxepubfpbimqgq.supabase.co')!,
  Deno.env.get('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnaGFvd2d4ZXB1YmZwYmltcWdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ4Mjg2MTEsImV4cCI6MjA2MDQwNDYxMX0.-ulksx2yX1yA8Wf_5la19ssxgjNgHqZjadGSM3wOLh0')!

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { ingredients } = await req.json();

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Invalid ingredients provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('OPENROUTER_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'OpenRouter API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `Generate a recipe using some or all of these ingredients: ${ingredients.join(', ')}. 
Return the response as a JSON object with the following structure:
{
  "title": "Recipe name",
  "description": "Brief description",
  "ingredients": ["list", "of", "ingredients", "with", "quantities"],
  "instructions": ["step 1", "step 2", "etc"],
  "cookingTime": number (in minutes),
  "servings": number,
  "mealType": "breakfast" | "lunch" | "dinner" | "snack",
  "dietaryTags": ["vegan" | "vegetarian" | "keto" | "gluten-free" | "dairy-free" | "paleo"]
}`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://yourdomain.com', // optional but required for some APIs
        'X-Title': 'MunchMap-AI', // optional but nice to include
      },
      body: JSON.stringify({
        model: 'openrouter/claude-3-haiku', // fast and smart
        messages: [
          { role: 'system', content: 'You are a professional chef who creates recipes based on available ingredients.' },
          { role: 'user', content: prompt }
        ],
        response_format: 'json', // for structured output
      }),
    });

    const data = await response.json();

    const content = data?.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('No valid response from OpenRouter');
    }

    const recipe = JSON.parse(content);

    const enhancedRecipe = {
      ...recipe,
      id: crypto.randomUUID(),
      imageUrl: `https://source.unsplash.com/featured/?${encodeURIComponent(recipe.title)}`,
      authorId: 'ai-chef',
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    return new Response(
      JSON.stringify(enhancedRecipe),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Recipe generation failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
