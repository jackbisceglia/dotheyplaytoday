import type { Topic } from "@dtpt/core/modules/topics/schema";

export type TeamCatalogEntry = {
  id: Topic["id"];
  name: string;
};

export const teamCatalog: readonly TeamCatalogEntry[] = [
  {
    id: "43faff24-2807-5743-8bf7-49cfc122d24d" as Topic["id"],
    name: "Atlanta Hawks",
  },
  {
    id: "b0c826c3-fc93-541f-a68d-de4d98e5a7e5" as Topic["id"],
    name: "Boston Celtics",
  },
  {
    id: "cf677706-646c-5bd2-bf4e-e6bcbb900f90" as Topic["id"],
    name: "Brooklyn Nets",
  },
  {
    id: "f4108dd1-89bb-5398-9768-4e86303f86d4" as Topic["id"],
    name: "Charlotte Hornets",
  },
  {
    id: "5c554e26-44c9-51f5-92c8-075a0dfad8ca" as Topic["id"],
    name: "Chicago Bulls",
  },
  {
    id: "de3aa568-f0c7-505d-9e81-2dec3a69e3e1" as Topic["id"],
    name: "Cleveland Cavaliers",
  },
  {
    id: "3793b1b6-aa14-5223-be64-0171612040f4" as Topic["id"],
    name: "Dallas Mavericks",
  },
  {
    id: "c0541843-e32b-5766-81e8-ab7832c54997" as Topic["id"],
    name: "Denver Nuggets",
  },
  {
    id: "90e07746-3e98-5dfc-b1e0-2802e140f96a" as Topic["id"],
    name: "Detroit Pistons",
  },
  {
    id: "830d920d-7663-5213-883c-33f24b004346" as Topic["id"],
    name: "Golden State Warriors",
  },
  {
    id: "a474630b-ea56-56bb-85ca-f5f2a9030c9d" as Topic["id"],
    name: "Houston Rockets",
  },
  {
    id: "eaa130d5-9e5e-5ed5-be89-0260cc796089" as Topic["id"],
    name: "Indiana Pacers",
  },
  {
    id: "6fb8b7a8-81e0-56bd-a38d-55720f4ba749" as Topic["id"],
    name: "LA Clippers",
  },
  {
    id: "937b5996-ea91-5036-8a8c-ea58f8697704" as Topic["id"],
    name: "Los Angeles Lakers",
  },
  {
    id: "9d05a150-e307-58fd-8666-616e6f1a7289" as Topic["id"],
    name: "Memphis Grizzlies",
  },
  {
    id: "bbb3c9be-7910-55ba-9fa1-e43cdbd6ea10" as Topic["id"],
    name: "Miami Heat",
  },
  {
    id: "33e09e90-b71e-5172-be6f-f02bb508c84c" as Topic["id"],
    name: "Milwaukee Bucks",
  },
  {
    id: "d375733b-7002-5245-81b7-8a8fe15e0f57" as Topic["id"],
    name: "Minnesota Timberwolves",
  },
  {
    id: "909fbd37-3c12-56e3-a59d-6ce68d4744a4" as Topic["id"],
    name: "New Orleans Pelicans",
  },
  {
    id: "40fd6996-e273-51d3-b12e-865da5d11543" as Topic["id"],
    name: "New York Knicks",
  },
  {
    id: "76a77cdc-e1dd-5636-90e3-dc416f4c708e" as Topic["id"],
    name: "Oklahoma City Thunder",
  },
  {
    id: "d2797fef-2997-5a80-96ec-bdf977299e93" as Topic["id"],
    name: "Orlando Magic",
  },
  {
    id: "d528dc30-8b78-5e7f-a4cc-a556641199be" as Topic["id"],
    name: "Philadelphia 76ers",
  },
  {
    id: "b6fd4d20-e156-5b3e-bb92-32ffff661476" as Topic["id"],
    name: "Phoenix Suns",
  },
  {
    id: "da209235-6b42-56c7-a0a1-0bc1d84ab1a1" as Topic["id"],
    name: "Portland Trail Blazers",
  },
  {
    id: "87ea29f5-f985-5d65-8cac-e4476c764b92" as Topic["id"],
    name: "Sacramento Kings",
  },
  {
    id: "dafbd2d7-78ea-5f05-8672-3eae44bcdbd0" as Topic["id"],
    name: "San Antonio Spurs",
  },
  {
    id: "259c28d7-7236-57f6-ab05-6d5258f4309c" as Topic["id"],
    name: "Toronto Raptors",
  },
  {
    id: "f28b281d-4cdc-5bfd-afe8-1c9de46bbf97" as Topic["id"],
    name: "Utah Jazz",
  },
  {
    id: "16ef4d00-b9fe-50a3-8572-5d55653baec1" as Topic["id"],
    name: "Washington Wizards",
  },
];
