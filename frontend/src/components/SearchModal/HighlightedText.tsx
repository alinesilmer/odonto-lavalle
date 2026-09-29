import { splitOnMatch } from "@/utils/text";

interface HighlightedTextProps {
  text: string;
  query: string;
}

/** Wraps the matching part of `text` in <mark>, accent-insensitively. */
const HighlightedText = ({ text, query }: HighlightedTextProps) => (
  <>
    {splitOnMatch(text, query).map((segment, index) =>
      segment.match ? <mark key={index}>{segment.text}</mark> : segment.text,
    )}
  </>
);

export default HighlightedText;
