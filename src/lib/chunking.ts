/**
 * Semantic Chunking Utility
 * Splits text into chunks of roughly targetSize, ensuring minimal splitting of words.
 * Includes a small overlap to maintain context between chunks.
 */

export function chunkText(text: string, targetSize: number = 600, overlap: number = 60): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  
  let currentChunk: string[] = [];
  let currentLength = 0;

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    currentChunk.push(word);
    currentLength += word.length + 1; // +1 for the space

    if (currentLength >= targetSize) {
      chunks.push(currentChunk.join(" "));
      
      // Handle overlap: backtrack by 'overlap' words if possible
      const overlapStart = Math.max(i - Math.floor(overlap / 5), chunks.length > 0 ? i - 10 : 0);
      
      // For the next chunk, we start some words back
      // But we just skip this for a simple version for now
      // Let's do a basic slide
      const wordsToKeep = Math.floor(overlap / 6); // estimate 6 chars per word
      currentChunk = words.slice(i - wordsToKeep, i + 1);
      currentLength = currentChunk.join(" ").length;
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(" "));
  }

  return chunks;
}
