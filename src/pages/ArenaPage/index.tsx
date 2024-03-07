import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Avatar } from "../../types";
import { getArenaIndex, getArenaRanking, getWinRate } from "../../apiClient";
import NcLogo from "../../assets/images/nc-logo.png";

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
    getArenaRanking(limit, offset).then((r) => {
      console.log(r);
      setArenaInfos(
        r.map((d: any) => ({
          rank: d.rank,
          avatar: {
            name: d.avatar.avatarName,
            code: d.avatar.avatarAddress,
          },
          score: d.score,
          cp: d.cp,
          winRate: undefined,
        }))
      );
      setHasMoreData(r.length === limit);
      setIsLoading(false);
    });
  };

  const findPageWithAvatar = async (targetAvatarAddress: string) => {
    setIsLoading(true);

    const maxAttempts = 10;
    let pageFound = false;
    let attempts = 0;

    const targetAvatarIndex = await getArenaIndex(targetAvatarAddress);
    if (!targetAvatarIndex) {
      setIsLoading(false);
      setCurrentPage(1);
      return;
    }

    let page = Math.ceil(targetAvatarIndex / limit);

    while (!pageFound && attempts < maxAttempts) {
      const offset = (page - 1) * limit;
      const data = await getArenaRanking(limit, offset);
      console.log(data);

      const avatarEntry = data.find(
        (d: any) => d.avatarAddress === targetAvatarAddress
      );

      if (avatarEntry) {
        pageFound = true;
        setCurrentPage(page);
      } else {
        const minRankingInResponse = Math.min(...data.map((d: any) => d.rank));
        const maxRankingInResponse = Math.max(...data.map((d: any) => d.rank));

        if (minRankingInResponse == maxRankingInResponse) {
          page += 1;
        } else if (targetAvatarIndex <= minRankingInResponse) {
          page -= 1;
        } else if (targetAvatarIndex >= maxRankingInResponse) {
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

  const Controller = () => (
    <div>
      <div className="mb-10">
        <div className="flex gap-4 w-full py-3 pl-6 pr-4 rounded-full bg-neutral-50 text-neutral-500">
          <input
            className="flex-1 bg-transparent"
            placeholder="0x..."
            value={searchAddress}
            onChange={handleInputChange}
          />
          <button className="px-2">?</button>
        </div>
      </div>
      <div className="flex justify-center gap-4">
        <button
          className={`flex items-center justify-center w-8 h-8 rounded-full ${currentPage === 1 ? "" : "bg-neutral-50 text-neutral-950"}`}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          «
        </button>
        {visiblePageNumbers().map((page) => (
          <button
            key={page}
            className={`flex items-center justify-center w-8 h-8 rounded-full ${currentPage === page ? "bg-neutral-50 text-neutral-950" : ""}`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className={`flex mb-4 items-center justify-center w-8 h-8 rounded-full ${currentPage === 1 ? "" : "bg-neutral-50 text-neutral-950"}`}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          »
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1">
        <header className="flex-shrink-0 h-80 bg-[url('/src/assets/images/nc-bg.png')] bg-cover relative">
          <div className="bg-neutral-950 bg-opacity-60 absolute w-full h-full flex flex-col justify-between p-8">
            <a href="/">
              <img src={NcLogo} alt="NcLogo" className="h-6" />
            </a>
            <div>
              <p className="text-xl">Comparing with</p>
              <h1 className="text-5xl font-black">
                #{myAvatarAddress?.slice(2, 6)}
              </h1>
            </div>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 text-neutral-800 animate-spin fill-neutral-50"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
        <Controller />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      <header className="flex-shrink-0 h-80 bg-[url('/src/assets/images/nc-bg.png')] bg-cover relative">
        <div className="bg-neutral-950 bg-opacity-60 absolute w-full h-full flex flex-col justify-between p-8">
          <a href="/">
            <img src={NcLogo} alt="NcLogo" className="h-6" />
          </a>
          <div>
            <p className="text-xl">Comparing with</p>
            <h1 className="text-5xl font-black">
              #{myAvatarAddress?.slice(2, 6)}
            </h1>
          </div>
        </div>
      </header>
      <div className="flex-1 flex flex-col gap-8 py-4 mb-8">
        <div className="flex-1">
          <div className="px-8 pt-4 pb-1 border-b border-neutral-700 flex gap-3 text-neutral-700 text-sm">
            <div className="flex-shrink-0 flex-grow-0 w-8">#</div>
            <div className="flex-shrink-0 flex-1">Avatar</div>
            <div className="flex-shrink-0 flex-grow-0 w-16 text-center">
              Score
            </div>
            <div className="flex-shrink-0 flex-grow-0 w-16">Win Rate</div>
          </div>
          {arenaInfos.map((arena) => (
            <div
              className={`px-8 py-4 border-b border-neutral-700 flex gap-3 items-center ${arena.avatar.code === avatarAddress ? "bg-neutral-800" : ""}`}
            >
              <div className="flex-shrink-0 flex-grow-0 w-8">{arena.rank}</div>
              <div className="flex-shrink-0 flex-1">
                <p>
                  <span>{arena.avatar.name}</span>
                  <span className="text-neutral-500">
                    #{arena.avatar.code.slice(0, 4)}
                  </span>
                </p>
                <p className="text-sm text-neutral-500 font-semibold">
                  CP {arena.cp}
                </p>
              </div>
              <div className="flex-shrink-0 flex-grow-0 w-16 font-bold text-center">
                {arena.score}
              </div>
              <div className="flex-shrink-0 flex-grow-0 w-16">??%</div>
            </div>
          ))}
        </div>
      </div>
      <Controller />
    </div>
  );

  // return (
  //   <div className="px-4 flex flex-col flex-1 bg-neutral card shadow-xl">
  //     <div className="join w-full mt-4">
  //       <input
  //         className="input join-item w-full"
  //         placeholder="0x..."
  //         value={searchAddress}
  //         onChange={handleInputChange}
  //       />
  //       <button className="btn join-item" onClick={handleInputSubmit}>
  //         Search
  //       </button>
  //     </div>

  //     <div className="mt-2 overflow-auto min-h-0 flex-grow flex-shrink basis-0">
  //       {isLoading ? (
  //         <div className="flex justify-center items-center">
  //           <span className="loading loading-dots loading-lg"></span>{" "}
  //         </div>
  //       ) : (
  //         <table className="table table-sm">
  //           <thead>
  //             <tr>
  //               <th>Rank</th>
  //               <th>Info</th>
  //               <th>Score</th>
  //               <th className="text-center">Win Rate</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {arenaInfos.map((d, i) => (
  //               <tr
  //                 key={d.avatar.code}
  //                 className={`${
  //                   d.avatar.code === avatarAddress ? "bg-base-100" : ""
  //                 }`}
  //               >
  //                 <td className="text-xs text-center">{d.rank}</td>
  //                 <td>
  //                   <div className="flex flex-col gap-1">
  //                     <div className="flex gap-1">
  //                       <div className="text-xs font-bold">{d.avatar.name}</div>
  //                       <div
  //                         className="text-xs opacity-30 hover:bg-base-200 hover:cursor-pointer"
  //                         onClick={() => {
  //                           navigator.clipboard.writeText(d.avatar.code);
  //                           alert(`Copy ${d.avatar.code}`);
  //                         }}
  //                       >
  //                         #{d.avatar.code.slice(0, 4)}
  //                       </div>
  //                     </div>
  //                     <div className="text-xs">CP {d.cp}</div>
  //                   </div>
  //                 </td>
  //                 <td className="text-xs">{d.score}</td>
  //                 <td className="text-center">
  //                   {d.winRate === undefined || d.winRate === null ? (
  //                     <button
  //                       className="btn btn-xs"
  //                       onClick={() => handleWinRateClick(i)}
  //                     >
  //                       {d.winRate === undefined ? (
  //                         "?"
  //                       ) : (
  //                         <span className="loading loading-xs loading-spinner"></span>
  //                       )}
  //                     </button>
  //                   ) : (
  //                     <div
  //                       className={`badge ${
  //                         d.winRate < 30 ? "badge-primary" : "badge-secondary"
  //                       }`}
  //                     >
  //                       {d.winRate}%
  //                     </div>
  //                   )}
  //                 </td>
  //               </tr>
  //             ))}
  //           </tbody>
  //         </table>
  //       )}
  //     </div>

  //     <div className="join w-full flex justify-center mt-4 mb-2">
  //       <button
  //         className={`join-item btn btn-xs ${
  //           currentPage === 1 ? "btn-disabled" : ""
  //         }`}
  //         onClick={() => handlePageChange(currentPage - 1)}
  //       >
  //         «
  //       </button>
  //       {visiblePageNumbers().map((page) => (
  //         <button
  //           key={page}
  //           className={`join-item btn btn-xs ${
  //             currentPage === page ? "btn-active" : ""
  //           }`}
  //           onClick={() => handlePageChange(page)}
  //         >
  //           {page}
  //         </button>
  //       ))}
  //       <button
  //         className={`join-item btn btn-xs ${
  //           !hasMoreData ? "btn-disabled" : ""
  //         }`}
  //         onClick={() => handlePageChange(currentPage + 1)}
  //       >
  //         »
  //       </button>
  //     </div>
  //   </div>
  // );
};

export default ArenaPage;
