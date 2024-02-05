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
  const [isLoading, setIsLoading] = useState<boolean>(true); // 로딩 상태 추가
  const avatarAddress = searchParams.get("avatarAddress");
  const [searchAddress, setSearchAddress] = useState<string>("");
  const [arenaInfos, setArenaInfos] = useState<Array<ArenaInfo>>([]);
  const [currentPage, setCurrentPage] = useState<number>(-1);
  const [hasMoreData, setHasMoreData] = useState<boolean>(true);
  const limit = 10;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAddress(e.target.value);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && (hasMoreData || page < currentPage)) {
      setCurrentPage(page);
    }
  };

  const visiblePageNumbers = () => {
    const pages = [];
    const startPage = Math.max(1, currentPage - 2);
    let endPage = startPage + 4; // 시작 페이지에서 4를 더해 끝 페이지를 설정

    // 첫 페이지가 1이면 끝 페이지가 5가 되도록 설정
    if (startPage === 1) {
      endPage = 5;
    }

    // 만약 끝 페이지가 현재 페이지보다 작고, 더 이상 데이터가 없다면, 현재 페이지를 끝 페이지로 설정
    if (endPage < currentPage && !hasMoreData) {
      endPage = currentPage;
    }

    // 시작 페이지에서 끝 페이지까지 반복하여 페이지 번호 추가
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
          winRate: undefined, // 추후 구현할 수 있음
        }))
      );
      setHasMoreData(r.data.battleArenaRanking.length === limit);
      setIsLoading(false);
    });
  };

  const findPageWithAvatar = async (avatarAddress: string) => {
    let pageFound = false;
    let maxAttempts = 10;
    let tryCount = 1;

    const specificAvatarData = await getArenaIndex(1, 1, avatarAddress);
    let page = Number(
      Math.floor(specificAvatarData.data.battleArenaRanking[0].ranking / limit)
    );

    while (!pageFound && tryCount <= maxAttempts) {
      const offset = page * limit;
      const data = await getArenaIndex(limit, Math.floor(offset / 10) * 10); // API 호출에 avatarAddress 추가
      pageFound = data.data.battleArenaRanking.some(
        (d: any) => d.avatarAddress === avatarAddress
      );
      if (!pageFound) {
        tryCount += 1;
        page -= 1;
      }
      console.log(offset);
    }

    if (pageFound) {
      setCurrentPage(page + 1);
    } else {
      setCurrentPage(maxAttempts); // 아바타가 발견되지 않은 경우 마지막 검색된 페이지로 설정
    }
  };

  useEffect(() => {
    if (avatarAddress) {
      findPageWithAvatar(avatarAddress);
    }
  }, [avatarAddress]); // avatarAddress가 변경될 때도 반응

  useEffect(() => {
    if (currentPage != -1) fetchArenaInfos(currentPage);
  }, [currentPage]); // avatarAddress가 변경될 때도 반응

  return (
    <div className="px-4 flex flex-col flex-1 bg-neutral card shadow-xl">
      <div className="join w-full mt-4">
        <input
          className="input join-item w-full"
          placeholder="0x..."
          value={searchAddress}
          onChange={handleInputChange}
        />
        <button className="btn join-item">Search</button>
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
