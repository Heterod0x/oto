/**
 * Props for FormattedDate component
 */
interface FormattedDateProps {
  /** Seconds since Unix epoch */
  secsSinceEpoch: number;
}

/**
 * FormattedDate component that displays a formatted date string
 * Converts Unix timestamp to a human-readable date format
 *
 * @param props - Component props containing the timestamp
 * @returns React component displaying formatted date
 */
export default function FormattedDate({ secsSinceEpoch }: FormattedDateProps) {
  const formattedDate = new Date(secsSinceEpoch * 1000).toLocaleDateString(
    "en-us",
    {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    },
  );

  return <p>{formattedDate}</p>;
}
