import { formatTimestamp } from "./time";

export interface TranscriptSegment {
  audioStart: number;
  audioEnd: number;
  transcript: string;
  finalized: boolean;
  beautified: boolean;
  id?: string; // Add unique identifier for tracking partial updates
}

export interface TranscriptBeautifyData {
  audioStart: number;
  audioEnd: number;
  transcript: string;
  segments: TranscriptSegment[];
}

export const handleTranscriptSegment = (
  prev: TranscriptSegment[],
  segment: TranscriptSegment
): TranscriptSegment[] => {
  if (segment.finalized) {
    // For finalized segments, remove any existing partial transcript and add the finalized one
    const filteredSegments = prev.filter((s) => s.finalized); // Remove partial transcripts
    return [
      ...filteredSegments,
      { ...segment, id: `${segment.audioStart}-${segment.audioEnd}` },
    ];
  } else {
    // For partial segments, replace any existing partial transcript
    const finalizedSegments = prev.filter((s) => s.finalized); // Keep only finalized segments
    return [
      ...finalizedSegments,
      {
        ...segment,
        id: "partial-current",
        audioStart: 999999999,
        audioEnd: 999999999,
      },
    ]; // Add current partial
  }
};

export const handleTranscriptBeautify = (
  prev: TranscriptSegment[],
  beautifyData: TranscriptBeautifyData
): TranscriptSegment[] => {
  // Filter out segments that fall within the beautified range
  const filteredSegments = prev.filter(
    (segment) =>
      segment.audioEnd <= beautifyData.audioStart ||
      segment.audioStart >= beautifyData.audioEnd
  );

  const beautifiedSegments = beautifyData.segments.map((segment) => ({
    audioStart: segment.audioStart,
    audioEnd: segment.audioEnd,
    transcript: segment.transcript,
    finalized: true,
    beautified: true,
  }));

  // Insert in chronological order
  const newSegments = [...filteredSegments, ...beautifiedSegments];
  return newSegments.sort((a, b) => a.audioStart - b.audioStart);
};

export const handleFormatTranscript = (transcriptSegments: TranscriptSegment[]): string => {
    return transcriptSegments.sort((a, b) => a.audioStart - b.audioStart)
    .map(segment => {
      let ret = '';
      
      // For partial transcripts, don't show timing (might not be meaningful)
      if (segment.finalized) {
        const startTime = formatTimestamp(segment.audioStart);
        const endTime = formatTimestamp(segment.audioEnd);
        ret = `[${startTime}-${endTime}]`;
      } else {
        ret = '[Live]'; // Show "Live" for partial transcripts
      }
      
      // Add status indicators
      if (segment.beautified) {
        ret += ' ✓'; // Beautified
      } else if (segment.finalized) {
        ret += ' *'; // Finalized but not beautified
      } else {
        ret += ' ~'; // Partial/interim transcript
      }
      
      ret += `\n${segment.transcript}`;

      return ret;
    })
    .join('\n\n');
};