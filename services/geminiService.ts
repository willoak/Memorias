import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini Client
// Ensure API key is present in environment
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

/**
 * Fetches current weather context using Google Search Grounding.
 */
export const fetchWeatherContext = async (lat: number, lng: number): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    // Added timestamp to prevent caching and explicit instruction to find nearest city if needed
    const response = await ai.models.generateContent({
      model,
      contents: `Use o Google Search para encontrar o clima atual exato (temperatura e condições) para a localização: latitude ${lat}, longitude ${lng}. Se as coordenadas exatas não retornarem resultados, use a cidade ou localidade mais próxima. Responda de forma concisa em Português. (Timestamp: ${Date.now()})`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    
    return response.text || "Dados climáticos indisponíveis";
  } catch (error) {
    console.error("Error fetching weather:", error);
    return "Dados climáticos indisponíveis";
  }
};

/**
 * Analyzes the memory text and weather context to generate structured enrichment data.
 */
export const enrichMemory = async (text: string, weatherContext: string, dateStr: string) => {
  try {
    const model = 'gemini-2.5-flash';
    
    const prompt = `
      Analise esta memória do usuário criada em ${dateStr}.
      Texto do Usuário: "${text}"
      Contexto do Clima: "${weatherContext}"
      
      Por favor, gere um JSON com o seguinte (RESPONDA EM PORTUGUÊS DO BRASIL):
      1. mood: Uma palavra descrevendo a emoção.
      2. colorHex: Um código de cor hex representando o sentimento.
      3. musicVibe: Um gênero ou descrição de música específica que combine com o momento (ex: "Lo-fi Melancólico", "Rock Anos 80").
      4. tags: Array de 3-5 palavras-chave em Português.
      5. poeticSummary: Uma única frase bonita e poética resumindo a essência desta memória em Português.
      6. weatherParsed: Extraia uma string simples do clima do contexto em Português (ex: "24°C, Ensolarado").
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            mood: { type: Type.STRING },
            colorHex: { type: Type.STRING },
            musicVibe: { type: Type.STRING },
            tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            poeticSummary: { type: Type.STRING },
            weatherParsed: { type: Type.STRING }
          },
          required: ["mood", "colorHex", "musicVibe", "tags", "poeticSummary", "weatherParsed"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error enriching memory:", error);
    // Fallback default
    return {
      mood: "Reflexivo",
      colorHex: "#64748b",
      musicVibe: "Ambiente",
      tags: ["memória"],
      poeticSummary: "Um momento congelado no tempo.",
      weatherParsed: weatherContext.slice(0, 20) || "N/A"
    };
  }
};

/**
 * Generates a visual representation of the memory using Imagen.
 */
export const generateMemoryImage = async (text: string, mood: string, weather: string) => {
  try {
    const prompt = `
      Uma imagem artística de alta qualidade, levemente abstrata e nostálgica representando esta memória.
      Descrição da cena (baseada no texto original): ${text}
      Atmosfera: ${mood}, ${weather}.
      Estilo: Cinematográfico, iluminação suave, como um sonho vívido ou fotografia de diário high-end.
      Sem texto na imagem.
    `;

    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        aspectRatio: '4:3',
        outputMimeType: 'image/jpeg'
      }
    });

    const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (base64ImageBytes) {
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    return undefined;
  } catch (error) {
    console.error("Error generating image:", error);
    // Return placeholder if generation fails
    return `https://picsum.photos/800/600?blur=2`;
  }
};