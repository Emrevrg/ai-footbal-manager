
export enum Position {
  GK = "Kaleci (GK)",
  CB = "Stoper (CB)",
  LB = "Sol Bek (LB)",
  RB = "Sağ Bek (RB)",
  CDM = "Defansif Orta Saha (CDM)",
  CM = "Merkez Orta Saha (CM)",
  CAM = "Ofansif Orta Saha (CAM)",
  LW = "Sol Kanat (LW)",
  RW = "Sağ Kanat (RW)",
  ST = "Forvet (ST)",
}

export interface Player {
  id: string;
  name: string;
  position: Position;
  strengths: string;
  weaknesses: string;
  isCaptain?: boolean;
}

export type Formation = "4-4-2" | "4-3-3" | "3-5-2" | "4-2-3-1";

export interface JerseyDesign {
    prompt: string;
    imageUrl: string;
}
