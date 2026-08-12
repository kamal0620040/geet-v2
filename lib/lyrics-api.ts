interface GetLyricsResponse {
  lyrics: string;
  snippet: string | null;
}

export async function getSongLyrics(lyricsId: string): Promise<string> {
  const response = await fetch(`/api/lyrics?id=${encodeURIComponent(lyricsId)}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch lyrics: ${response.status}`);
  }

  const json = (await response.json()) as {
    success: boolean;
    data: GetLyricsResponse;
  };
  if (!json.success) {
    throw new Error("Failed to fetch lyrics");
  }

  return json.data.lyrics;
}