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
  const avatarAddress = searchParams.get("avatarAddress");
  const [searchAddress, setSearchAddress] = useState<string>("");
  const [arenaInfos, setArenaInfos] = useState<Array<ArenaInfo>>([]);
  const [currentPage, setCurrentPage] = useState<number>(1); // 현재 페이지 상태
  const [totalPages, setTotalPages] = useState<number>(5); // 전체 페이지 수, 실제 API로부터 받아와야 할 수도 있음

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAddress(e.target.value);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page); // 페이지 번호 변경
  };

  const fetchArenaInfos = (page: number) => {
    const limit = 10;
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
      // setTotalPages(...) // 전체 페이지 수를 설정하는 로직 (API로부터 받아올 수 있음)
    });
  };

  useEffect(() => {
    fetchArenaInfos(currentPage);
  }, [currentPage]); // currentPage가 변경될 때마다 데이터를 불러옴

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
              <tr key={d.avatar.code}>
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
      </div>

      <div className="join w-full flex justify-center mt-4 mb-2">
        <button
          className={`join-item btn btn-xs ${currentPage === 1 ? "btn-disabled" : ""}`}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          «
        </button>
        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={`join-item btn btn-xs ${currentPage === idx + 1 ? "btn-active" : ""}`}
            onClick={() => handlePageChange(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}
        <button
          className={`join-item btn btn-xs ${currentPage === totalPages ? "btn-disabled" : ""}`}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          »
        </button>
      </div>
    </div>
  );
};

export default ArenaPage;
