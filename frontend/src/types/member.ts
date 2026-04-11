export interface Member {
  name: string;
  nameKana: string;
  generation: string;
  isGraduated: boolean;
  birthday?: string;
}

export type MembersData = Record<string, Member>;