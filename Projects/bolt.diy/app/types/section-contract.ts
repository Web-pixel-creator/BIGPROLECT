export type SectionContract = {
  order: string[];
  labels: Record<string, string>;
  imageSections?: string[];
  imageMap?: Record<string, string[]>;
  imageMinCounts?: Record<string, number>;
};
