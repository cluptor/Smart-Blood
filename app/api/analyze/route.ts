import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Define the expected structure
interface BiomarkerResult {
    name: string;
    value: string;
    unit: string;
    status: 'normal' | 'low' | 'high';
    range: string;
    insight: string;
}

interface AnalysisResponse {
    summary: string;
    score: number;
    critical_items: number;
    results: BiomarkerResult[];
}

// Allow for longer processing times (Vercel specific)
export const maxDuration = 60;

export async function POST(request: NextRequest) {
    console.log('--- Analyze Request Started ---');

    try {
        // Check for API key
        const apiKey = process.env.GEMINI_API_KEY;
        console.log('API Key present:', !!apiKey);

        if (!apiKey) {
            console.error('Missing API Key');
            return NextResponse.json(
                { error: 'Gemini API key not configured. Please add GEMINI_API_KEY to your .env.local file.' },
                { status: 500 }
            );
        }

        // Initialize Gemini AI inside the handler
        const genAI = new GoogleGenerativeAI(apiKey);

        // Parse the form data
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            console.error('No file found in formData');
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        console.log(`File received: ${file.name}, Size: ${file.size}, Type: ${file.type}`);

        // Convert file to base64
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const base64Data = buffer.toString('base64');

        // Determine MIME type
        const mimeType = file.type || 'application/pdf';

        // Initialize Gemini model
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        // Create the prompt
        const prompt = `You are a medical AI assistant analyzing blood test reports. 

Analyze this blood test report and extract ALL biomarkers with their values.

For each biomarker found, provide:
1. Biomarker name (e.g., "Hemoglobin", "Vitamin D", "Total Cholesterol")
2. Measured value (just the number)
3. Unit of measurement (e.g., "g/dL", "ng/mL", "mg/dL")
4. Status: "normal", "low", or "high" based on the reference range
5. Reference range from the report
6. A brief health insight (one sentence explaining what this result means)
7. Category (e.g., "Hormones", "Liver", "Lipids", "Blood Count", "Vitamins", "Other")

Also provide:
- A comprehensive executive summary (2-3 sentences) highlighting key findings
- A health score from 0-100 (100 being perfect health)
- Count of critical items that need attention

Return your response in this EXACT JSON format (no markdown, just pure JSON):
{
  "summary": "text here",
  "score": 85,
  "critical_items": 2,
  "results": [
    {
      "name": "Hemoglobin",
      "value": "14.2",
      "unit": "g/dL",
      "status": "normal",
      "range": "13.2-16.6",
      "insight": "Optimal oxygen transport capacity.",
      "category": "Blood Count"
    }
  ]
}

IMPORTANT: Return ONLY the JSON, no additional text or markdown formatting.`;

        console.log('Sending to Gemini...');

        let result;

        try {
            // Attempt 1: Send PDF directly (Multimodal)
            result = await model.generateContent([
                {
                    inlineData: {
                        mimeType,
                        data: base64Data,
                    },
                },
                { text: prompt },
            ]);
        } catch (geminiError: any) {
            console.error('Gemini Multimodal Error:', geminiError);

            // Attempt 2: Fallback to Text Extraction (if it's a PDF)
            if (mimeType === 'application/pdf') {
                console.log('Falling back to text extraction...');
                try {
                    // Dynamic import to avoid issues if not needed
                    const pdf = await import('pdf-parse');
                    const pdfParse = pdf.default;
                    const pdfData = await pdfParse(buffer);

                    console.log('Text extracted length:', pdfData.text.length);

                    const textPrompt = `You are a medical AI assistant analyzing blood test reports.
                    
                    Here is the text extracted from a blood test report:
                    """
                    ${pdfData.text}
                    """
                    
                    Analyze this text and extract ALL biomarkers... (rest of prompt implied)
                    
                    Return your response in this EXACT JSON format (no markdown, just pure JSON):
                    {
                      "summary": "text here",
                      "score": 85,
                      "critical_items": 2,
                      "results": [
                        {
                          "name": "Hemoglobin",
                          "value": "14.2",
                          "unit": "g/dL",
                          "status": "normal",
                          "range": "13.2-16.6",
                          "insight": "Optimal oxygen transport capacity.",
                          "category": "Blood Count"
                        }
                      ]
                    }
                    
                    IMPORTANT: Return ONLY the JSON, no additional text or markdown formatting.`;

                    result = await model.generateContent(textPrompt);

                } catch (parseError) {
                    console.error('Text extraction failed:', parseError);
                    throw geminiError; // Throw the original error if fallback fails
                }
            } else {
                throw geminiError;
            }
        }

        const response = result.response;
        const text = response.text();
        console.log('Gemini Response received (first 100 chars):', text.substring(0, 100));

        // Try to parse the JSON response
        let analysisData: AnalysisResponse;

        try {
            // Remove any markdown code blocks if present
            const cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            analysisData = JSON.parse(cleanedText);
        } catch (parseError) {
            console.error('Failed to parse AI response:', text);

            // Return a fallback response
            return NextResponse.json({
                summary: "Unable to parse the blood report. Please ensure the file is a valid blood test report with clear biomarker data.",
                score: 0,
                critical_items: 0,
                results: [],
                rawResponse: text, // Include raw response for debugging
            });
        }

        return NextResponse.json(analysisData);

    } catch (error: any) {
        console.error('Error processing file:', error);

        return NextResponse.json(
            {
                error: 'Failed to process the file',
                details: error.message,
            },
            { status: 500 }
        );
    }
}


