export interface LawSource {
  law_name: string;
  law_number: string;
  section: string;
  year: string;
  excerpt: string;
}

export interface QueryResponse {
  answer: string;
  sources: LawSource[];
  total_sources: number;
}
