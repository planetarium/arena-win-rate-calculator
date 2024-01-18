import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Avatar } from "../../types";

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAddress(e.target.value);
  };

  useEffect(() => {
    console.log(avatarAddress);
    setArenaInfos([
      {
        rank: 1,
        avatar: {
          name: "temp1",
          code: "0x1e1b572db70ab80bb02783a0d2c594a0ede6db28",
        },
        score: 3062,
        winRate: null,
      },
      {
        rank: 2,
        avatar: {
          name: "temp2",
          code: "0x1e1b572db70ab80bb02783a0d2c594a0ede6db28",
        },
        score: 3062,
        winRate: undefined,
      },
      {
        rank: 3,
        avatar: {
          name: "temp3",
          code: "0x1e1b572db70ab80bb02783a0d2c594a0ede6db28",
        },
        score: 3061,
        winRate: 20,
      },
      {
        rank: 4,
        avatar: {
          name: "temp4",
          code: "0x1e1b572db70ab80bb02783a0d2c594a0ede6db28",
        },
        score: 3061,
        winRate: 70,
      },
    ]);
  }, []);

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
              <tr>
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
        <button className="join-item btn btn-xs">«</button>
        <button className="join-item btn btn-xs">1</button>
        <button className="join-item btn btn-xs">2</button>
        <button className="join-item btn btn-xs btn-disabled">...</button>
        <button className="join-item btn btn-xs btn-active">23</button>
        <button className="join-item btn btn-xs">24</button>
        <button className="join-item btn btn-xs">25</button>
        <button className="join-item btn btn-xs">»</button>
      </div>
    </div>
  );
};

export default ArenaPage;
