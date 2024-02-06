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

export async function getArenaIndex(
  limit: number,
  offset: number,
  avatarAddress: string | undefined = undefined
): Promise<any> {
  const graphqlQuery = {
    operationName: "GetArenaRanking",
    query: `query GetArenaRanking($offset: Int! $limit: Int!, $avatarAddress: String) {
        battleArenaRanking(
          championshipId: 0
          round: 9
          offset: $offset
          limit: $limit
          avatarAddress: $avatarAddress
        ) {
          blockIndex
          agentAddress
          avatarAddress
          name
          cp
          round
          score
          ticket
          ranking
          timeStamp
        }
      }`,
    variables: {
      offset,
      limit,
      avatarAddress,
    },
  };

  return fetchAPI<any>("dp", {
    method: "POST",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    body: graphqlQuery,
  });
}
