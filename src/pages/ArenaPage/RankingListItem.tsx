import { useQuery } from "@tanstack/react-query";
import { FC, useState } from "react";
import { FiCpu } from "react-icons/fi";
import { ArenaRanking } from "../../types";
import { Spinner } from "../../components/Spinner";
import { getWinRate } from "../../apiClient";

export const ArenaRankingListItem: FC<{
  ranking: ArenaRanking;
  isFocused?: boolean;
  myAvatarAddress?: string;
}> = ({ ranking, isFocused, myAvatarAddress }) => {
  const [fetched, setFetched] = useState(false);
  const winRateQuery = useQuery({
    queryKey: ["winRate", fetched ? ranking.address : null, myAvatarAddress],
    queryFn: async (key) => {
      const [, address, myAvatarAddress] = key.queryKey;
      if (!address || !myAvatarAddress) return null;
      const { winRate } = await getWinRate(myAvatarAddress, address);
      return Math.floor(winRate * 100);
    },
    refetchOnWindowFocus: false,
  });

  return (
    <div
      className={`px-8 py-4 border-b border-neutral-700 flex gap-3 items-center ${isFocused ? "bg-neutral-900" : ""}`}
    >
      <div className="flex-shrink-0 flex-grow-0 w-12">{ranking.ranking}</div>
      <div className="flex-shrink-0 flex-1">
        <p>
          <span className="font-semibold">{ranking.name}</span>
          <span className="text-neutral-500">#{ranking.code}</span>
        </p>
        <p className="text-sm text-neutral-500 font-semibold">
          {ranking.cp ? `CP ${ranking.cp}` : ""}
        </p>
      </div>
      <div className="flex-shrink-0 flex-grow-0 w-16 font-bold text-center">
        {ranking.score}
      </div>
      <div className="flex-shrink-0 flex-grow-0 w-16 text-center">
        {!fetched ? (
          <button
            className="inline-flex h-8 w-8 rounded-full bg-neutral-50 justify-center items-center"
            onClick={() => setFetched(true)}
          >
            <FiCpu className="stroke-neutral-950" size={20} />
          </button>
        ) : winRateQuery.isLoading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : winRateQuery.isError || winRateQuery === null ? (
          <div>ERROR</div>
        ) : (
          <div>{winRateQuery.data}%</div>
        )}
      </div>
    </div>
  );
};
