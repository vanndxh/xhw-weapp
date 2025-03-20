export enum GachaTypeKey {
  ROLE = "ROLE",
  WEAPON = "WEAPON",
  PERMANENT = "PERMANENT",
}

export const GachaType = {
  [GachaTypeKey.ROLE]: {
    label: "角色",
    code: "301",
  },
  [GachaTypeKey.WEAPON]: {
    label: "武器",
    code: "302",
  },
  [GachaTypeKey.PERMANENT]: {
    label: "常驻",
    code: "200",
  },
};
