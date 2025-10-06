import { GoogleGenAI } from "@google/genai";
import { Player, Formation } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const model = "gemini-2.5-flash";
const imageModel = "imagen-4.0-generate-001";

const playerToString = (p: Player) => 
  `- ${p.name} (${p.position})${p.isCaptain ? ' [KAPTAN]' : ''}: Güçlü Yönleri: ${p.strengths}. Zayıf Yönleri: ${p.weaknesses}.`;

export const generateStrategy = async (
  team: Player[],
  formation: Formation,
  opponentTeam?: Player[]
): Promise<string> => {
  try {
    const teamPrompt = team.map(playerToString).join("\n");
    const opponentPrompt = opponentTeam && opponentTeam.length > 0
      ? `Rakip Takım:\n${opponentTeam.map(playerToString).join("\n")}`
      : "Rakip takım bilgisi yok.";

    const prompt = `
      Sen uzman bir futbol koçusun. Görevin, sağlanan bilgilere dayanarak ayrıntılı bir maç stratejisi oluşturmak.

      Benim Takımım:
      ${teamPrompt}

      ${opponentPrompt}

      İstenen Diziliş: ${formation}

      Lütfen aşağıdaki başlıkları içeren kapsamlı bir strateji raporu oluştur:
      1.  **Genel Maç Planı:** Maçın temposunu nasıl kontrol edeceğimiz, topa sahip olma hedefimiz ve genel yaklaşımımız.
      2.  **Hücum Taktikleri:** Gol pozisyonları yaratmak için kilit oyuncular kimler olacak? Kanatları nasıl kullanmalıyız? Duran top organizasyonları için öneriler.
      3.  **Savunma Taktikleri:** Rakibi nasıl karşılamalıyız? Pres zamanlaması nasıl olmalı? Kilit rakip oyunculara karşı özel önlemler.
      4.  **Oyuncu Rolleri ve Talimatları:** ${formation} dizilişine göre her oyuncunun sahada ne yapması gerektiğini kısaca açıkla.
      5.  **Önemli Notlar ve İkinci Yarı Planı:** Maçın gidişatına göre yapılabilecek değişiklikler ve olası oyuncu değişiklikleri için öneriler.

      Cevabını Markdown formatında, başlıkları belirgin şekilde yaz.
    `;
    
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating strategy:", error);
    return "Strateji oluşturulurken bir hata oluştu. Lütfen API anahtarınızı kontrol edin veya daha sonra tekrar deneyin.";
  }
};

export const generateAutomaticStrategy = async (
  team: Player[],
  opponentTeam?: Player[]
): Promise<string> => {
  try {
    const teamPrompt = team.map(playerToString).join("\n");
    const opponentPrompt = opponentTeam && opponentTeam.length > 0
      ? `Rakip Takım:\n${opponentTeam.map(playerToString).join("\n")}`
      : "Rakip takım bilgisi yok.";

    const prompt = `
      Sen elit seviyede bir futbol taktik dehasısın. Görevin, sağlanan oyuncu kadrolarını analiz ederek en uygun dizilişi ve kapsamlı bir maç stratejisini oluşturmak.

      Benim Takımım:
      ${teamPrompt}

      ${opponentPrompt}

      Lütfen aşağıdaki başlıkları içeren kapsamlı bir strateji raporu oluştur:
      1.  **Kadro Analizi ve En Uygun Diziliş:** Her iki takımı da analiz et. Takımımın güçlü ve zayıf yönlerine göre en uygun dizilişi (örn: 4-3-3, 4-2-3-1) öner. Bu dizilişi neden seçtiğini açıkla. Önerini "En Uygun Diziliş: X-X-X" formatında açıkça belirt.
      2.  **Genel Maç Planı:** Önerdiğin dizilişe göre maçın temposunu nasıl kontrol edeceğimiz, topa sahip olma hedefimiz ve genel yaklaşımımız.
      3.  **Hücum Taktikleri:** Gol pozisyonları yaratmak için kilit oyuncular kimler olacak? Kanatları nasıl kullanmalıyız? Duran top organizasyonları için öneriler.
      4.  **Savunma Taktikleri:** Rakibi nasıl karşılamalıyız? Pres zamanlaması nasıl olmalı? Kilit rakip oyunculara karşı özel önlemler.
      5.  **Oyuncu Rolleri ve Talimatları:** Önerdiğin dizilişe göre her oyuncunun sahada ne yapması gerektiğini kısaca açıkla.
      6.  **Önemli Notlar ve İkinci Yarı Planı:** Maçın gidişatına göre yapılabilecek değişiklikler ve olası oyuncu değişiklikleri için öneriler.

      Cevabını Markdown formatında, başlıkları belirgin şekilde yaz.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating automatic strategy:", error);
    return "Otomatik strateji oluşturulurken bir hata oluştu. Lütfen API anahtarınızı kontrol edin veya daha sonra tekrar deneyin.";
  }
};


export const comparePlayers = async (player1: Player, player2: Player): Promise<string> => {
   try {
    const prompt = `
      Sen uzman bir futbol gözlemcisisin. İki oyuncuyu karşılaştır ve detaylı bir analiz sun.

      Oyuncu A: ${playerToString(player1)}
      Oyuncu B: ${playerToString(player2)}

      Lütfen aşağıdaki kriterlere göre bir karşılaştırma yap:
      - **Genel Değerlendirme:** İki oyuncunun profillerini özetle.
      - **Hücum Katkısı:** Hangisi hücumda daha etkilidir? Neden?
      - **Savunma Katkısı:** Hangisi savunmada daha güvenilirdir? Neden?
      - **Fiziksel Özellikler:** Hız, dayanıklılık ve güç açısından karşılaştır.
      - **Taktiksel Uygunluk:** Hangi oyuncu hangi oyun sistemine daha uygun?
      - **Sonuç ve Öneri:** Hangi oyuncunun ilk 11'de başlaması gerektiği veya maçın hangi anlarında birbirlerinin yerine oynamaları gerektiği konusunda bir tavsiye ver.

      Cevabını Markdown formatında, başlıkları belirgin şekilde yaz.
    `;
    
    const response = await ai.models.generateContent({ model, contents: prompt });
    return response.text;
  } catch (error) {
    console.error("Error comparing players:", error);
    return "Oyuncuları karşılaştırırken bir hata oluştu.";
  }
};


export const generateJerseyImages = async (prompt: string): Promise<{ front: string | null; back: string | null }> => {
  try {
    const originalityClause = "Create a completely unique and original football jersey design. Do not copy any existing real-world club or national team jerseys. The design should be imaginative and modern.";

    const frontPrompt = `professional photo of the FRONT VIEW of a football jersey based on the following description: ${prompt}. ${originalityClause}. The jersey should be displayed flat on a clean surface. high detail, 8k.`;
    const backPrompt = `professional photo of the BACK VIEW of the SAME football jersey from the previous prompt, based on the following description: ${prompt}. The back should correspond to the front design. ${originalityClause}. The jersey should be displayed flat on a clean surface. high detail, 8k.`;

    const generate = async (p: string) => {
        const response = await ai.models.generateImages({
            model: imageModel,
            prompt: p,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1',
            },
        });
        if (response.generatedImages && response.generatedImages.length > 0) {
          const base64ImageBytes = response.generatedImages[0].image.imageBytes;
          return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        return null;
    }

    const [frontResult, backResult] = await Promise.all([
        generate(frontPrompt),
        generate(backPrompt)
    ]);

    return { front: frontResult, back: backResult };

  } catch (error) {
    console.error("Error generating jersey images:", error);
    return { front: null, back: null };
  }
};
