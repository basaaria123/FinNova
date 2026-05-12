import { createServerFn } from "@tanstack/react-start";

export interface AiTipInput {
  topCategory: string | null;
  topShare: number; // 0-1 share of top category in monthly total
  totalMonth: number;
  prevMonthTotal: number;
  predictedMonthEnd: number;
  budget: number;
}

export const getAiTip = createServerFn({ method: "POST" })
  .inputValidator((d: AiTipInput) => d)
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) return { tip: null as string | null, error: "missing-key" };

    const sys =
      "You are a concise personal finance coach for an Indian user. Respond with exactly one short, actionable tip under 22 words. No preface, no emojis, no markdown.";

    const ctx = `Top category: ${data.topCategory ?? "n/a"} (${Math.round(
      data.topShare * 100
    )}% of month). This month so far: ₹${Math.round(
      data.totalMonth
    )}. Last month: ₹${Math.round(
      data.prevMonthTotal
    )}. Predicted end-of-month: ₹${Math.round(
      data.predictedMonthEnd
    )}. Monthly budget: ₹${Math.round(data.budget)}.`;

    try {
      const resp = await fetch(
        "https://ai.gateway.lovable.dev/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              { role: "system", content: sys },
              { role: "user", content: ctx },
            ],
          }),
        }
      );
      if (!resp.ok) {
        if (resp.status === 429)
          return { tip: null, error: "rate-limit" };
        if (resp.status === 402)
          return { tip: null, error: "credits" };
        return { tip: null, error: `http-${resp.status}` };
      }
      const json = await resp.json();
      const tip: string | undefined =
        json?.choices?.[0]?.message?.content?.trim();
      return { tip: tip ?? null, error: null as string | null };
    } catch (e) {
      return { tip: null, error: "network" };
    }
  });
