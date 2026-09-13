import groq from "./groq.service.js";
import AppError from "../../utils/appError.js";

const RATE_LIMIT_RETRY_DELAY = 17000;

function getRetryDelay(error) {
  const retryAfter = error?.headers?.get?.("retry-after");
  const retryAfterSeconds = Number(retryAfter);

  return Number.isFinite(retryAfterSeconds)
    ? Math.min(Math.max(retryAfterSeconds * 1000, 1000), 30000)
    : RATE_LIMIT_RETRY_DELAY;
}

function isRateLimitError(error) {
  return error?.status === 429 || error?.statusCode === 429;
}

export async function extractResumeSkills(resumeText) {
  try {
    if (!resumeText || !resumeText.trim()) {
      console.error("❌ Resume text is empty");
      return [];
    }

    const prompt = `
You are an expert ATS Resume Analyzer.

Extract ONLY technical and professional skills from the resume.

Rules:

1. Return ONLY a JSON object.
2. The JSON object must contain exactly one key: "skills".
3. "skills" must be an array of strings.
4. No markdown.
5. No explanation.
6. Remove duplicate skills.
7. Ignore soft skills.
8. Extract every distinct technical or professional skill explicitly present, up to 100 skills.
9. Preserve the skill's original name, including punctuation and separators such as CI/CD, Node.js, and C++.
10. Include:
   - Programming Languages
   - Frameworks
   - Libraries
   - Databases
   - Cloud Platforms
   - DevOps Tools
   - Software
   - AI/ML Tools
   - Testing Tools
   - Security Technologies
   - Professional technical skills

Resume:

${resumeText}

Return exactly this format:

{
    "skills": [
        "Java",
        "Spring Boot",
        "Node.js"
    ]
}
`;

    const request = {
      model: "openai/gpt-oss-120b",
      temperature: 0,
      reasoning_effort: "low",
      max_completion_tokens: 1200,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    };

    let completion;
    try {
      completion = await groq.chat.completions.create(request);
    } catch (error) {
      if (!isRateLimitError(error)) throw error;
      await new Promise((resolve) => setTimeout(resolve, getRetryDelay(error)));
      completion = await groq.chat.completions.create(request);
    }

    const message = completion?.choices?.[0]?.message;
    const content = message?.content || message?.reasoning;

    console.log("\n========== AI RESUME RESPONSE ==========");

    console.log(content);

    console.log("Finish reason:", completion?.choices?.[0]?.finish_reason);

    console.log("========================================\n");

    if (!content) {
      console.error("❌ AI returned an empty response");

      return [];
    }

    // ---------------------------------------
    // 1. Remove Qwen <think>...</think>
    // ---------------------------------------

    let jsonText = content.trim();

    jsonText = jsonText.replace(/<think>[\s\S]*?<\/think>/gi, "");

    jsonText = jsonText.trim();

    // ---------------------------------------
    // 2. Remove markdown code fences
    // ---------------------------------------

    jsonText = jsonText
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    // ---------------------------------------
    // 3. Find the FIRST JSON object
    // ---------------------------------------

    const jsonMatch = jsonText.match(/\{\s*"skills"\s*:\s*\[[\s\S]*?\]\s*\}/);

    if (!jsonMatch) {
      const skillsStart = jsonText.indexOf('"skills"');
      const partialSkills =
        skillsStart === -1
          ? []
          : [...jsonText.slice(skillsStart).matchAll(/"((?:\\.|[^"\\])*)"/g)]
              .slice(1)
              .map((match) => {
                try {
                  return JSON.parse(`"${match[1]}"`);
                } catch {
                  return "";
                }
              })
              .filter(Boolean);

      if (partialSkills.length > 0) {
        console.warn(
          `⚠️ AI response was truncated; recovered ${partialSkills.length} skills`,
        );
        return [...new Set(partialSkills)];
      }

      console.error("❌ No valid skills JSON found in AI response");
      console.error("Cleaned response:", jsonText);
      return [];
    }

    jsonText = jsonMatch[0];

    console.log("✅ JSON extracted successfully");

    // ---------------------------------------
    // 4. Parse JSON
    // ---------------------------------------

    let result;

    try {
      result = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("❌ Could not parse AI JSON");

      console.error("JSON:", jsonText);

      return [];
    }

    // ---------------------------------------
    // 5. Validate skills array
    // ---------------------------------------

    if (!Array.isArray(result.skills)) {
      console.error("❌ AI JSON does not contain skills array");

      return [];
    }

    // ---------------------------------------
    // 6. Clean and remove duplicates
    // ---------------------------------------

    const skills = [
      ...new Set(
        result.skills
          .filter((skill) => typeof skill === "string")
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0),
      ),
    ];

    // ---------------------------------------
    // 7. Log extracted skills
    // ---------------------------------------

    console.log("✅ Extracted Resume Skills:");

    console.log(skills);

    console.log(`✅ Total Skills: ${skills.length}`);

    return skills;
  } catch (error) {
    console.error("❌ Resume Skill Extraction Error");

    console.error(error.response?.data || error.message);

    if (isRateLimitError(error)) {
      throw new AppError(
        "Resume analysis is temporarily rate-limited. Please try again shortly.",
        429,
      );
    }

    return [];
  }
}
