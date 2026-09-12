import groq from "./groq.service.js";

export async function generateRoadmap({
  targetRole,
  extractedSkills,
  missingSkills,
  atsScore,
  durationDays = 30,
}) {
  try {
    if (!missingSkills || missingSkills.length === 0) {
      console.log("No missing skills found.");

      return [];
    }

    const importantMissingSkills = missingSkills.slice(0, 8);
    const normalizedDuration = Math.max(
      30,
      Math.round(Number(durationDays) || 30),
    );
    const weekCount = Math.max(1, Math.floor(normalizedDuration / 7));
    const maxRoadmapTokens = Math.min(8000, 700 + weekCount * 280);
    const fallbackRoadmap = Array.from({ length: weekCount }, (_, index) => {
      const skill =
        importantMissingSkills[index % importantMissingSkills.length];
      return {
        week: `Week ${index + 1}`,
        tasks: [
          `Study ${skill} fundamentals`,
          `Practice ${skill} with a guided exercise`,
          `Apply ${skill} in a small project task`,
        ],
      };
    });

    const prompt = `
You are an expert Software Engineering Career Mentor.

Create a practical ${normalizedDuration}-day learning roadmap.

Candidate Role:
${targetRole}

Current ATS Score:
${atsScore}

Current Skills:
${extractedSkills.join(", ")}

Important Missing Skills:
${importantMissingSkills.join(", ")}

Return ONLY valid JSON.

The response must contain exactly ${weekCount} roadmap items.

Each item must contain:
- week
- tasks

Each week must contain exactly 3 short and practical tasks. Keep each task under 12 words so the full roadmap fits in the response.

The final week must include a practical project using some of the missing skills.

Use this JSON structure, including one item for every week from Week 1 through Week ${weekCount}:

{
    "roadmap": [
        {
            "week": "Week 1",
            "tasks": [
                "Task 1",
                "Task 2",
                "Task 3"
            ]
        },
        ...
    ]
}
`;

    const MAX_ATTEMPTS = 3;

    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        console.log(`Generating roadmap. Attempt ${attempt}...`);

        const response = await groq.chat.completions.create({
          model: "openai/gpt-oss-20b",

          temperature: 0,

          max_tokens: maxRoadmapTokens,

          response_format: {
            type: "json_object",
          },

          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
        });

        const content = response?.choices?.[0]?.message?.content;

        console.log("AI Roadmap Response:", content);

        if (!content) {
          console.error("AI returned an empty response.");

          continue;
        }

        let result;

        try {
          result = JSON.parse(content);
        } catch (error) {
          console.error("Could not parse roadmap JSON.");

          continue;
        }

        if (!Array.isArray(result.roadmap)) {
          console.error("Roadmap array not found.");

          continue;
        }

        // Require the number of weeks implied by the selected duration.
        if (result.roadmap.length < weekCount) {
          console.error(
            `AI returned ${result.roadmap.length} weeks; expected ${weekCount}.`,
          );

          continue;
        }

        // Normalize and keep only the requested number of weeks.
        const roadmap = result.roadmap
          .slice(0, weekCount)
          .map((item, index) => {
            const tasks = Array.isArray(item.tasks)
              ? item.tasks
                  .filter((task) => typeof task === "string")
                  .map((task) => task.trim())
                  .filter((task) => task.length > 0)
                  .slice(0, 3)
              : [];

            return {
              week: `Week ${index + 1}`,

              tasks,
            };
          });

        const isValid =
          roadmap.length === weekCount &&
          roadmap.every((item) => item.tasks.length === 3);

        if (!isValid) {
          console.error("Invalid roadmap structure.");

          console.log(roadmap);

          continue;
        }

        console.log("Roadmap generated successfully.");

        return roadmap;
      } catch (error) {
        console.error(
          `Roadmap attempt ${attempt} failed:`,
          error.response?.data || error.message,
        );
      }
    }

    console.error(
      "Could not generate a valid AI roadmap; using the full fallback roadmap.",
    );

    return fallbackRoadmap;
  } catch (error) {
    console.error("Roadmap Error:", error.response?.data || error.message);

    return [];
  }
}
