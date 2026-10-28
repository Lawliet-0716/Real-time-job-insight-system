export function getJobSkills(job) {
  const sources = [
    job?.skills,
    job?.technologies,
    job?.raw?.job_required_skills,
  ];

  return [
    ...new Set(
      sources
        .flatMap((source) =>
          Array.isArray(source)
            ? source
            : typeof source === "string"
              ? source.split(/[,;|]/)
              : [],
        )
        .filter((skill) => typeof skill === "string")
        .map((skill) => skill.trim())
        .filter(Boolean),
    ),
  ];
}
