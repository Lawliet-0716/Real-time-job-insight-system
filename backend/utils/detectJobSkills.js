const SKILL_PATTERNS = [
  ["JavaScript", ["JavaScript"]],
  ["TypeScript", ["TypeScript"]],
  ["Python", ["Python"]],
  ["Java", ["Java"]],
  ["C++", ["C++"]],
  ["C#", ["C#"]],
  ["Ruby", ["Ruby"]],
  ["PHP", ["PHP"]],
  ["Swift", ["Swift"]],
  ["Kotlin", ["Kotlin"]],
  ["Scala", ["Scala"]],
  ["Rust", ["Rust"]],
  ["Dart", ["Dart"]],
  ["Bash", ["Bash", "Shell scripting"]],
  ["PowerShell", ["PowerShell"]],
  ["React", ["React", "React.js"]],
  ["Next.js", ["Next.js"]],
  ["Angular", ["Angular"]],
  ["Vue.js", ["Vue", "Vue.js"]],
  ["Svelte", ["Svelte"]],
  ["Node.js", ["Node.js"]],
  ["Express.js", ["Express", "Express.js"]],
  ["NestJS", ["NestJS"]],
  ["Spring Boot", ["Spring Boot"]],
  ["Django", ["Django"]],
  ["Flask", ["Flask"]],
  ["FastAPI", ["FastAPI"]],
  [".NET", [".NET"]],
  ["ASP.NET", ["ASP.NET"]],
  ["Laravel", ["Laravel"]],
  ["Ruby on Rails", ["Ruby on Rails"]],
  ["GraphQL", ["GraphQL"]],
  ["REST API", ["REST API", "REST APIs", "RESTful API", "RESTful APIs"]],
  ["gRPC", ["gRPC"]],
  ["HTML", ["HTML"]],
  ["CSS", ["CSS"]],
  ["Tailwind CSS", ["Tailwind CSS"]],
  ["SQL", ["SQL"]],
  ["MySQL", ["MySQL"]],
  ["PostgreSQL", ["PostgreSQL", "Postgres"]],
  ["MongoDB", ["MongoDB"]],
  ["Redis", ["Redis"]],
  ["Elasticsearch", ["Elasticsearch"]],
  ["DynamoDB", ["DynamoDB"]],
  ["Cassandra", ["Cassandra"]],
  ["SQLite", ["SQLite"]],
  ["Oracle", ["Oracle Database"]],
  ["Firebase", ["Firebase"]],
  ["AWS", ["AWS", "Amazon Web Services"]],
  ["Azure", ["Microsoft Azure", "Azure"]],
  ["Google Cloud", ["Google Cloud", "GCP"]],
  ["Docker", ["Docker"]],
  ["Kubernetes", ["Kubernetes", "K8s"]],
  ["Terraform", ["Terraform"]],
  ["Jenkins", ["Jenkins"]],
  ["GitHub Actions", ["GitHub Actions"]],
  ["Git", ["Git"]],
  ["CI/CD", ["CI/CD"]],
  ["Linux", ["Linux"]],
  ["Pandas", ["Pandas"]],
  ["NumPy", ["NumPy"]],
  ["PyTorch", ["PyTorch"]],
  ["TensorFlow", ["TensorFlow"]],
  ["scikit-learn", ["scikit-learn", "scikit learn"]],
  ["Machine Learning", ["Machine Learning"]],
  ["NLP", ["Natural Language Processing", "NLP"]],
  ["Apache Kafka", ["Apache Kafka", "Kafka"]],
  ["Apache Spark", ["Apache Spark", "Spark"]],
  ["Airflow", ["Airflow"]],
  ["Jest", ["Jest"]],
  ["Cypress", ["Cypress"]],
  ["Playwright", ["Playwright"]],
  ["Selenium", ["Selenium"]],
  ["JUnit", ["JUnit"]],
];

const MAX_SKILLS = 25;

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function detectJobSkills(title = "", description = "") {
  const text = `${String(title)}\n${String(description)}`;
  const matches = [];

  for (const [skill, aliases] of SKILL_PATTERNS) {
    const indexes = aliases
      .map((alias) => {
        const pattern = new RegExp(
          `(^|[^a-z0-9])${escapeRegex(alias)}(?=$|[^a-z0-9])`,
          "i",
        );
        return pattern.exec(text)?.index;
      })
      .filter((index) => index !== undefined);

    if (indexes.length > 0) {
      matches.push({ skill, index: Math.min(...indexes) });
    }
  }

  return matches
    .sort((left, right) => left.index - right.index)
    .slice(0, MAX_SKILLS)
    .map(({ skill }) => skill);
}
