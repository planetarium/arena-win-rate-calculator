import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getArenaIndex, getArenaRanking } from "../../apiClient";

export const useArenaPage = (address?: string) => {
  const [page, setPage] = useState<number | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const arenaRankings = useQuery({
    queryKey: ["arenaRankings", page],
    queryFn: () =>
      page !== null ? getArenaRanking(15, (page - 1) * 15) : null,
  });

  useEffect(() => {
    if (!address) return;
    setIsFetching(true);
    setPage(null);
    getArenaIndex(address).then((ranking) =>
      setPage(Math.floor(ranking / 15) + 1)
    );
  }, [address]);

  useEffect(() => {
    if (!isFetching) return;
    if (!arenaRankings.data) return;

    if (arenaRankings.data.length < 15) {
      return setIsFetching(false);
    }
    if (arenaRankings.data.length === 0) {
      setPage((prev) => (prev || 2) - 1);
      return setIsFetching(false);
    }

    const isExisting = arenaRankings.data.some(
      (ranking) => ranking.address === address?.toLowerCase()
    );
    if (isExisting) return setIsFetching(false);
    setPage((prev) => (prev || 1) + 1);
  }, [isFetching, arenaRankings.data, address]);

  if (!address) return { data: 1, isLoading: false, isError: false };
  if (isFetching) return { data: null, isLoading: true, isError: false };

  return { data: page, isLoading: false, isError: false };
};
