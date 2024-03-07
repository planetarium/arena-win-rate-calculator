import { BASE_URL } from "./constants";

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
): Promise<any> {
  return fetchAPI<any>(`arena/ranking?limit=${limit}&offset=${offset}`);
}

export async function getArenaIndex(
  avatarAddress: string,
): Promise<any> {
  return fetchAPI<number>(`arena/ranking/${avatarAddress}/rank`);
}
