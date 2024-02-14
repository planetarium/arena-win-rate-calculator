import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Avatar } from "../../types";
import { getArenaIndex, getWinRate } from "../../apiClient";

interface ArenaInfo {
  rank: number;
  avatar: Avatar;
  score: number;
  cp: number;
  winRate: number | null | undefined;
}

const ArenaPage = () => {
  const [searchParams] = useSearchParams();
  const myAvatarAddress = searchParams.get("avatarAddress");

  const [searchAddress, setSearchAddress] = useState<string>("");
  const [avatarAddress, setAvatarAddress] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [arenaInfos, setArenaInfos] = useState<Array<ArenaInfo>>([]);
  const [currentPage, setCurrentPage] = useState<number>(-1);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const limit = 15;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAddress(e.target.value);
  };

  const handleInputSubmit = () => {
    if (searchAddress.length < 42 || !searchAddress.startsWith("0x")) {
      alert(
        "Please enter a valid agent address. It should start with '0x' and be at least 42 characters long."
      );
      return;
    }

    setAvatarAddress(searchAddress);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && (hasMoreData || page < currentPage)) {
      setCurrentPage(page);
    }
  };

  const handleWinRateClick = (index: number) => {
    setArenaInfos((prevAreaInfos) =>
      prevAreaInfos.map((v, i) => {
        if (i === index) {
          return {
            ...v,
            winRate: null,
          };
        }
        return v;
      })
    );

    if (myAvatarAddress) {
      getWinRate(myAvatarAddress, arenaInfos[index].avatar.code).then((r) => {
        setArenaInfos((prevAreaInfos) =>
          prevAreaInfos.map((v, i) => {
            if (i === index) {
              return {
                ...v,
                winRate: Math.round(r.winRate * 100),
              };
            }
            return v;
          })
        );
      });
    }
  };

  const visiblePageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    let endPage = startPage + 4;

    if (startPage === 1) {
      endPage = 5;
    }

    if (endPage < currentPage && !hasMoreData) {
      endPage = currentPage;
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const fetchArenaInfos = (page: number) => {
    setIsLoading(true);

    const offset = (page - 1) * limit;
    getArenaIndex(limit, offset).then((r) => {
      setArenaInfos(
        r.data.battleArenaRanking.map((d: any) => ({
          rank: d.ranking,
          avatar: {
            name: d.name,
            code: d.avatarAddress,
          },
          score: d.score,
          cp: d.cp,
          winRate: undefined,
        }))
      );
      setHasMoreData(r.data.battleArenaRanking.length === limit);
      setIsLoading(false);
    });
  };

  const findPageWithAvatar = async (targetAvatarAddress: string) => {
    setIsLoading(true);

    const maxAttempts = 10;
    let pageFound = false;
    let attempts = 0;

    const initialData = await getArenaIndex(1, 0, targetAvatarAddress);
    if (initialData.data.battleArenaRanking.length === 0) {
      setIsLoading(false);
      setCurrentPage(1);
      return;
    }

    const initialRanking = initialData.data.battleArenaRanking[0].ranking;
    let page = Math.ceil(initialRanking / limit);

    while (!pageFound && attempts < maxAttempts) {
      const offset = (page - 1) * limit;
      const data = await getArenaIndex(limit, offset);

      const avatarEntry = data.data.battleArenaRanking.find(
        (d: any) => d.avatarAddress === targetAvatarAddress
      );

      if (avatarEntry) {
        pageFound = true;
        setCurrentPage(page);
      } else {
        const minRankingInResponse = Math.min(
          ...data.data.battleArenaRanking.map((d: any) => d.ranking)
        );
        const maxRankingInResponse = Math.max(
          ...data.data.battleArenaRanking.map((d: any) => d.ranking)
        );

        if (minRankingInResponse == maxRankingInResponse) {
          page += 1;
        } else if (initialRanking <= minRankingInResponse) {
          page -= 1;
        } else if (initialRanking >= maxRankingInResponse) {
          page += 1;
        }

        attempts += 1;
      }
    }

    if (!pageFound) {
      setCurrentPage(page);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    if (avatarAddress) {
      findPageWithAvatar(avatarAddress);
    }
  }, [avatarAddress]);

  useEffect(() => {
    if (myAvatarAddress) setAvatarAddress(myAvatarAddress);
  }, []);

  useEffect(() => {
    if (currentPage != -1) fetchArenaInfos(currentPage);
  }, [currentPage]);

  return (
    <div className="px-4 flex flex-col flex-1 bg-neutral card shadow-xl">
      <div className="join w-full mt-4">
        <input
          className="input join-item w-full"
          placeholder="0x..."
          value={searchAddress}
          onChange={handleInputChange}
        />
        <button className="btn join-item" onClick={handleInputSubmit}>
          Search
        </button>
      </div>

      <div className="mt-2 overflow-auto min-h-0 flex-grow flex-shrink basis-0">
        {isLoading ? (
          <div className="flex justify-center items-center">
            <span className="loading loading-dots loading-lg"></span>{" "}
          </div>
        ) : (
          <table className="table table-sm">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Info</th>
                <th>Score</th>
                <th className="text-center">Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {arenaInfos.map((d, i) => (
                <tr
                  key={d.avatar.code}
                  className={`${
                    d.avatar.code === avatarAddress ? "bg-base-100" : ""
                  }`}
                >
                  <td className="text-xs text-center">{d.rank}</td>
                  <td>
                    <div className="flex flex-col gap-1">
                      <div className="flex gap-1">
                        <div className="text-xs font-bold">{d.avatar.name}</div>
                        <div
                          className="text-xs opacity-30 hover:bg-base-200 hover:cursor-pointer"
                          onClick={() => {
                            navigator.clipboard.writeText(
                              d.avatar.code
                            );
                            alert(`Copy ${d.avatar.code}`);
                          }}
                        >
                          #{d.avatar.code.slice(0, 4)}
                        </div>
                      </div>
                      <div className="text-xs">CP {d.cp}</div>
                    </div>
                  </td>
                  <td className="text-xs">{d.score}</td>
                  <td className="text-center">
                    {d.winRate === undefined || d.winRate === null ? (
                      <button
                        className="btn btn-xs"
                        onClick={() => handleWinRateClick(i)}
                      >
                        {d.winRate === undefined ? (
                          "?"
                        ) : (
                          <span className="loading loading-xs loading-spinner"></span>
                        )}
                      </button>
                    ) : (
                      <div
                        className={`badge ${
                          d.winRate < 30 ? "badge-primary" : "badge-secondary"
                        }`}
                      >
                        {d.winRate}%
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="join w-full flex justify-center mt-4 mb-2">
        <button
          className={`join-item btn btn-xs ${
            currentPage === 1 ? "btn-disabled" : ""
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          «
        </button>
        {visiblePageNumbers().map((page) => (
          <button
            key={page}
            className={`join-item btn btn-xs ${
              currentPage === page ? "btn-active" : ""
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className={`join-item btn btn-xs ${
            !hasMoreData ? "btn-disabled" : ""
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default ArenaPage;
