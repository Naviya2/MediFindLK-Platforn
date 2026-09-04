const ANTHROPIC_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-haiku-4-5-20251001";
const TIMEOUT_MS = 8000;

function parseSuggestions(text) {
  try {
    const match = text.match(/\[[\s\S]*\]/);
    const parsed = JSON.parse(match ? match[0] : text);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((s) => typeof s === "string" && s.trim())
        .map((s) => s.trim())
        .slice(0, 3);
    }
  } catch {
    // Not valid JSON — fall back to splitting on lines/commas below.
  }

  return text
    .split(/\n|,/)
    .map((s) => s.replace(/^[-*\d.)\s]+/, "").trim())
    .filter(Boolean)
    .slice(0, 3);
}

// POST /api/ai/suggest — public. { medicine: "name" } -> { suggestions: [...] }
// Never throws: any failure (missing key, timeout, bad response) resolves to
// a graceful { suggestions: [], fallback: true } instead of a 5xx, so the
// Search page always has something sensible to render.
exports.suggest = async (req, res) => {
  const name = String(req.body?.medicine || "").trim();
  if (!name) {
    return res.status(400).json({ error: "medicine is required" });
  }

  if (!process.env.AI_API_KEY) {
    return res.json({ suggestions: [], fallback: true });
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const prompt =
      `A patient searched for the medicine "${name}" but it wasn't available at any nearby ` +
      `pharmacy. List 2-3 common generic names or common alternative/substitute medicines for ` +
      `"${name}" that a pharmacist might suggest. Respond with ONLY a JSON array of strings and ` +
      `nothing else, e.g. ["Paracetamol", "Acetaminophen"]. If you don't recognise the medicine, ` +
      `respond with [].`;

    const response = await fetch(ANTHROPIC_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.AI_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 200,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`AI API responded with ${response.status}`);
    }

    const data = await response.json();
    const text = data?.content?.[0]?.text || "";
    const suggestions = parseSuggestions(text);

    res.json({ suggestions });
  } catch {
    res.json({ suggestions: [], fallback: true });
  } finally {
    clearTimeout(timeout);
  }
};
