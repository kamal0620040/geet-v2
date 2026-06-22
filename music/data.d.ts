type Image = {
  quality: string;
  url: string;
};

type Artist = {
  id: string;
  name: string;
  role: string;
  image: Image[];
  type: "artist";
  url: string;
};

type Album = {
  id: string;
  name: string;
  url: string;
};

type Artists = {
  primary: Artist[];
  featured: Artist[];
  all: Artist[];
};

type DownloadUrl = {
  quality: string;
  url: string;
};

export type Song = {
  id: string;
  name: string;
  type: "song";
  year: string;
  releaseDate: string | null;
  duration: number;
  label: string;
  explicitContent: boolean;
  playCount: number;
  language: string;
  hasLyrics: boolean;
  lyricsId: string | null;
  url: string;
  copyright: string;
  album: Album;
  artists: Artists;
  image: Image[];
  downloadUrl: DownloadUrl[];
};