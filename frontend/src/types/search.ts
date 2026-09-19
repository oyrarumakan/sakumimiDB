export interface SearchConditions {
  member1: string;
  member2: string;
  episode: string;
  year: string;
  caption: string;
}

export interface GroupedMembers {
  group: string;
  members: string[];
}

export type SortOrder = "asc" | "desc";
