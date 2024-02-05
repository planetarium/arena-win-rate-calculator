import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Avatar } from "../../types";
import { getArenaIndex } from "../../apiClient";

interface ArenaInfo {
  rank: number;
  avatar: Avatar;
  score: number;
  winRate: number | null | undefined;
}

const ArenaPage = () => {
  const [searchParams] = useSearchParams();
  let myAvatarAddress = searchParams.get("avatarAddress");

  const [searchAddress, setSearchAddress] = useState<string>("");
  const [avatarAddress, setAvatarAddress] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [arenaInfos, setArenaInfos] = useState<Array<ArenaInfo>>([]);
  const [currentPage, setCurrentPage] = useState<number>(-1);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const limit = 10;

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
          winRate: undefined,
        }))
      );
      setHasMoreData(r.data.battleArenaRanking.length === limit);
      setIsLoading(false);
    });
  };

  const findPageWithAvatar = async (targetAvatarAddress: string) => {
    setIsLoading(true);

    let pageFound = false;
    let maxAttempts = 5;
    let tryCount = 1;

    const specificAvatarData = await getArenaIndex(1, 1, targetAvatarAddress);
    let page = Number(
      Math.floor(specificAvatarData.data.battleArenaRanking[0].ranking / limit)
    );

    while (!pageFound && tryCount <= maxAttempts) {
      const offset = page * limit;
      const data = await getArenaIndex(limit, Math.floor(offset / 10) * 10);

      pageFound = data.data.battleArenaRanking.some(
        (d: any) => d.avatarAddress === targetAvatarAddress
      );
      if (!pageFound) {
        tryCount += 1;
        page -= 1;
      }
    }

    setCurrentPage(page + 1);
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
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>Info</th>
                <th>Score</th>
                <th className="text-center">Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {arenaInfos.map((d) => (
                <tr
                  key={d.avatar.code}
                  className={`${
                    d.avatar.code === avatarAddress ? "bg-base-100" : ""
                  }`}
                >
                  <td>{d.rank}</td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-bold">{d.avatar.name}</div>
                        <div className="text-sm opacity-50">
                          #{d.avatar.code.slice(0, 4)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>{d.score}</td>
                  <td className="text-center">
                    {!d.winRate ? (
                      <button className="btn btn-xs">
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
