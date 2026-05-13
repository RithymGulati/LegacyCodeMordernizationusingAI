import { sanitizeAiOutputLine } from "../../utils/sanitizeAiOutput.js";

/**
 * Lightweight monospace syntax hints (no extra deps).
 * @param {{ line: string }} props
 */
export function HighlightedCodeLine({ line }) {
  const s = sanitizeAiOutputLine(line);
  if (!s.length) {
    return <span className="inline-block min-w-[1ch] text-[#484f58]"> </span>;
  }

  const KW =
    /\b(public|private|protected|static|final|class|interface|extends|implements|void|int|long|double|float|boolean|byte|short|char|if|else|for|while|do|switch|case|break|continue|return|new|import|package|try|catch|finally|throw|throws|def|elif|pass|None|True|False|and|or|not|in|is|lambda|from|as|with|print|self|IDENTIFICATION|DIVISION|PROGRAM-ID|DATA|PROCEDURE|SECTION|PERFORM|UNTIL|CALL|USING|GOBACK)\b/g;

  /** @type {{ type: 'code' | 'str', text: string }[]} */
  const chunks = [];
  let i = 0;

  while (i < s.length) {
    const ch = s[i];
    if (ch === '"' || ch === "'") {
      const q = ch;
      let j = i + 1;
      while (j < s.length) {
        if (s[j] === "\\") {
          j += 2;
          continue;
        }
        if (s[j] === q) {
          j += 1;
          break;
        }
        j += 1;
      }
      chunks.push({ type: "str", text: s.slice(i, j) });
      i = j;
    } else {
      let j = i;
      while (j < s.length && s[j] !== '"' && s[j] !== "'") j += 1;
      chunks.push({ type: "code", text: s.slice(i, j) });
      i = j;
    }
  }

  return (
    <span>
      {chunks.map((chunk, ci) => {
        if (chunk.type === "str") {
          return (
            <span key={ci} className="text-sky-300/90">
              {chunk.text}
            </span>
          );
        }
        const nodes = [];
        let last = 0;
        let m;
        const c = chunk.text;
        KW.lastIndex = 0;
        while ((m = KW.exec(c)) !== null) {
          if (m.index > last) {
            nodes.push(
              <span key={`${ci}-${last}-t`} className="text-[#e6edf3]">
                {c.slice(last, m.index)}
              </span>,
            );
          }
          nodes.push(
            <span key={`${ci}-${m.index}-k`} className="text-[#c678dd]">
              {m[0]}
            </span>,
          );
          last = m.index + m[0].length;
        }
        if (last < c.length) {
          nodes.push(
            <span key={`${ci}-${last}-e`} className="text-[#e6edf3]">
              {c.slice(last)}
            </span>,
          );
        }
        if (nodes.length === 0) {
          nodes.push(
            <span key={`${ci}-all`} className="text-[#e6edf3]">
              {c}
            </span>,
          );
        }
        return (
          <span key={ci}>
            {nodes}
          </span>
        );
      })}
    </span>
  );
}
