export const LEGACY_JAVA = `public class InvoiceService {
  public double calculateTotal(List<Item> items) {
    double subtotal = 0;
    for (Item item : items) {
      subtotal += item.getPrice() * item.getQuantity();
    }
    return subtotal;
  }
}`;

export const AI_COMMENTED_JAVA = `public class InvoiceService {
  // Calculates full order amount for all items
  public double calculateTotal(List<Item> items) {
    double subtotal = 0;

    // Iterate over each line item and aggregate value
    for (Item item : items) {
      subtotal += item.getPrice() * item.getQuantity();
    }

    // Business note: subtotal excludes tax and discounts
    return subtotal;
  }

  // Modernization note:
  // Consider BigDecimal for financial precision
}`;

export const FEATURES = [
  {
    title: "AI Comment Generation",
    description:
      "Generate accurate, context-aware comments that explain what legacy code is doing and why—aligned to your vocabulary.",
    tag: "Documentation",
  },
  {
    title: "Business Logic Extraction",
    description:
      "Surface domain rules buried in procedural layers so teams migrate without guessing intent.",
    tag: "Domain",
  },
  {
    title: "Maintainability Analysis",
    description:
      "Quantify hotspots, duplication, and complexity so refactoring investment lands where ROI is highest.",
    tag: "Quality",
  },
  {
    title: "Modernization Recommendations",
    description:
      "Actionable modernization paths—from safe refactors to service boundaries—with risk-aware sequencing.",
    tag: "Roadmap",
  },
];

export const WORKFLOW_STEPS = [
  {
    title: "Paste Legacy Code",
    description: "Upload Java, COBOL, or service-layer snippets from enterprise systems.",
  },
  {
    title: "AI Understands Business Logic",
    description: "LegacyAI maps behavior, dependencies, and domain intent using glossaries and context.",
  },
  {
    title: "Get Modernization Insights",
    description: "Receive annotated samples, metrics, and next-step recommendations your team can trust.",
  },
];

export const TECH_STACK = [
  "React",
  "OpenRouter",
  "Tailwind",
  "Java",
  "Enterprise AI",
];

/** Shared insight tiles for Analyze + Workflow pages */
export const AI_INSIGHTS_ROWS = [
  { label: "Language Detected", value: "Java" },
  { label: "Maintainability Score", value: "72 / 100", accent: "emerald" },
  { label: "Risk Level", value: "Medium", accent: "amber" },
  {
    label: "Suggested Modernization",
    value:
      "Replace floating-point totals with BigDecimal for currency-safe arithmetic; extract line-item aggregation into a tested domain module; consolidate region surcharges behind a policy/strategy boundary.",
  },
  {
    label: "Business Logic Summary",
    value:
      "Computes invoice subtotal from unit price × quantity per line with optional regional compliance fees applied before VAT and consolidated billing.",
  },
];
