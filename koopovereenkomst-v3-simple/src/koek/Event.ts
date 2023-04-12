
export interface Event {
  aggregateId: string;
  id: string;
  seq: number;
  type: string;
  actor: string;
  label: string;
  newLabel?: string;
  time: string;
  template?: string;
  kadastraalObjectId?: string;
  koopprijs?: number;
  datumVanLevering?: string;
}
