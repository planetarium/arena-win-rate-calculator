import { BASE_URL } from "./constants";
import { ArenaRanking } from "./types";

const defaultHeaders: HeadersInit = {
  "Content-Type": "application/json",
};

interface FetchOptions<TBody = undefined> {
  method?: "GET" | "POST";
  body?: TBody;
  headers?: HeadersInit;
}

async function fetchAPI<TResponse, TBody = undefined>(
  endpoint: string,
  options: FetchOptions<TBody> = {}
): Promise<TResponse> {
  try {
    const { method = "GET", body, headers } = options;

    const config: RequestInit = {
      method,
      headers: { ...defaultHeaders, ...headers },
      body: body ? JSON.stringify(body) : null,
    };

    const url = `${BASE_URL}${endpoint}`;

    const response = await fetch(url, config);

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return (await response.json()) as TResponse;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

export async function getWinRate(
  myAvatarAddress: string,
  enemyAvatarAddress: string
): Promise<any> {
  if (!myAvatarAddress.startsWith("0x")) myAvatarAddress = "0x" + myAvatarAddress;
  if (!enemyAvatarAddress.startsWith("0x")) enemyAvatarAddress = "0x" + enemyAvatarAddress;

  const body = {
    myAvatarAddress,
    enemyAvatarAddress,
  };
  return fetchAPI<any>(`arena/simulate`, {
    method: "POST",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    body,
  });
}

export async function getAvatars(agentAddress: string): Promise<any> {
  return fetchAPI<any>(`agent/${agentAddress}/avatars`);
}

export async function getArenaRanking(
  limit: number,
  offset: number,
): Promise<ArenaRanking[]> {
  const rankings = await fetchAPI<any[]>(`arena/ranking?limit=${limit}&offset=${offset}`);

  return rankings.map((ranking: any) => ({
    address: '0x' + ranking.avatarAddress.toLowerCase(),
    code: ranking.avatarAddress.toUpperCase().slice(0, 4),
    name: ranking.avatar.avatarName,
    ranking: ranking.rank,
    score: ranking.score,
    cp: ranking.cp,
  }));
}

export async function getArenaIndex(
  avatarAddress: string,
): Promise<number> {
  if (avatarAddress.startsWith("0x")) avatarAddress = avatarAddress.slice(2)
  return fetchAPI<number>(`arena/ranking/${avatarAddress}/rank`);
}
