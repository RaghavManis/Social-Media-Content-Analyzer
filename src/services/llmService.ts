const APP_ID = import.meta.env.VITE_APP_ID;
const API_URL = "https://api-integrations.appmedo.com/app-7snsyyhuslxd/api-rLob8RdzAOl9/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse";

interface Part {
  text?: string;
  inlineData?: {
    mimeType: string;
    data: string;
  };
}

interface Content {
  role: "user" | "model";
  parts: Part[];
}

interface LLMRequest {
  contents: Content[];
}

export async function extractTextFromImage(base64Image: string, mimeType: string): Promise<string> {
  const requestBody: LLMRequest = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: "Extract all text from this image. Return only the extracted text without any additional commentary or formatting. If there is no text, return 'No text found in image'."
          },
          {
            inlineData: {
              mimeType,
              data: base64Image
            }
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-App-Id": APP_ID
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    if (!reader) {
      throw new Error("Response body is not readable");
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const jsonStr = line.slice(6);
          if (jsonStr.trim() === "") continue;

          try {
            const data = JSON.parse(jsonStr);
            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
              fullText += data.candidates[0].content.parts[0].text;
            }
          } catch (e) {
            console.error("Error parsing JSON:", e);
          }
        }
      }
    }

    return fullText.trim() || "No text could be extracted from the image.";
  } catch (error) {
    console.error("Error extracting text from image:", error);
    throw new Error("Failed to extract text from image. Please try again.");
  }
}

export async function analyzeSocialMediaContent(text: string): Promise<string> {
  const requestBody: LLMRequest = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Analyze the following text as if it were a social media post and provide specific, actionable suggestions to improve engagement. Focus on:

1. Emoji recommendations (suggest specific emojis and where to place them)
2. Hashtag suggestions (provide 5-8 relevant hashtags)
3. Sentence structure improvements (suggest rewrites for better flow)
4. Call-to-action enhancements (suggest engaging CTAs)
5. Tone and voice optimization

Text to analyze:
${text}

Please format your response with clear sections and bullet points for easy reading.`
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-App-Id": APP_ID
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    if (!reader) {
      throw new Error("Response body is not readable");
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const jsonStr = line.slice(6);
          if (jsonStr.trim() === "") continue;

          try {
            const data = JSON.parse(jsonStr);
            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
              fullText += data.candidates[0].content.parts[0].text;
            }
          } catch (e) {
            console.error("Error parsing JSON:", e);
          }
        }
      }
    }

    return fullText.trim() || "Unable to generate suggestions at this time.";
  } catch (error) {
    console.error("Error analyzing content:", error);
    throw new Error("Failed to analyze content. Please try again.");
  }
}

export async function extractTextFromPDF(base64PDF: string): Promise<string> {
  const requestBody: LLMRequest = {
    contents: [
      {
        role: "user",
        parts: [
          {
            text: "Extract all text from this PDF document. Return only the extracted text without any additional commentary. Preserve paragraph breaks where appropriate."
          },
          {
            inlineData: {
              mimeType: "application/pdf",
              data: base64PDF
            }
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-App-Id": APP_ID
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullText = "";

    if (!reader) {
      throw new Error("Response body is not readable");
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const jsonStr = line.slice(6);
          if (jsonStr.trim() === "") continue;

          try {
            const data = JSON.parse(jsonStr);
            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
              fullText += data.candidates[0].content.parts[0].text;
            }
          } catch (e) {
            console.error("Error parsing JSON:", e);
          }
        }
      }
    }

    return fullText.trim() || "No text could be extracted from the PDF.";
  } catch (error) {
    console.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF. Please try again.");
  }
}
