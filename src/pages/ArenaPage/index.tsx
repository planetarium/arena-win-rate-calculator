import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getArenaRanking } from "../../apiClient";
import { useQuery } from "@tanstack/react-query";
import { FiArrowLeft } from "react-icons/fi";
import NcLogo from "../../assets/images/nc-logo.png";
import { FiSearch } from "react-icons/fi";
import { Spinner } from "../../components/Spinner";
import { Routes } from "../../constants";
import { ArenaRankingList } from "./RankingList";
import { useArenaPage } from "./useArenaPage";

const ArenaPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const myAvatarAddress = searchParams.get("avatarAddress");
  const myAgentAddress = searchParams.get("agentAddress");
  const myArenaPageQuery = useArenaPage(myAvatarAddress ?? undefined);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchAddress, setSearchAddress] = useState(myAvatarAddress ?? "");

  const arenaRankingsQuery = useQuery({
    queryKey: ["arenaRankings", currentPage],
    queryFn: () => getArenaRanking(15, (currentPage - 1) * 15),
  });

  const isLoading = useMemo(
    () => myArenaPageQuery.isLoading || arenaRankingsQuery.isLoading,
    [myArenaPageQuery.isLoading, arenaRankingsQuery.isLoading]
  );
  const pages = useMemo(() => {
    return new Array(5).fill(0).map((_, i) => currentPage + i - 2);
  }, [currentPage]);

  useEffect(() => {
    myArenaPageQuery.data && setCurrentPage(myArenaPageQuery.data);
  }, [myArenaPageQuery.data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchAddress(e.target.value);
  };
  const handleInputSubmit = () => {};
  const handlePageChange = (page: number) => setCurrentPage(page);
  const handleBackButton = () => {
    navigate(`/${Routes.AVATAR}?agentAddress=${myAgentAddress}`);
  };

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
          <button className="px-2" onClick={handleInputSubmit}>
            <FiSearch size={20} />
          </button>
        </div>
      </div>
      <div className="flex justify-center gap-4 select-none">
        <button
          className={`flex items-center justify-center w-8 h-8 rounded-full ${
            currentPage === 1
              ? "text-neutral-500"
              : "bg-neutral-50 text-neutral-950"
          }`}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          «
        </button>
        {pages.map((page) => (
          <button
            key={page}
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentPage === page ? "bg-neutral-50 text-neutral-950" : ""
            }`}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </button>
        ))}
        <button
          className={`flex mb-4 items-center justify-center w-8 h-8 rounded-full ${
            false ? "text-neutral-500" : "bg-neutral-50 text-neutral-950"
          }`}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          »
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col flex-1">
      <header className="flex-shrink-0 h-80 bg-[url('/src/assets/images/nc-bg.png')] bg-cover relative">
        <div className="bg-neutral-950 bg-opacity-60 absolute w-full h-full flex flex-col justify-between p-8">
          <div className="flex justify-between">
            <a href="/">
              <img src={NcLogo} alt="NcLogo" className="h-6" />
            </a>
            <button
              onClick={handleBackButton}
              className="inline-flex h-8 w-8 rounded-full bg-neutral-50 justify-center items-center"
            >
              <FiArrowLeft className="stroke-neutral-950" size={20} />
            </button>
          </div>
          <div>
            <p className="text-xl">Comparing with</p>
            <h1 className="text-5xl font-black">
              #{myAvatarAddress?.slice(2, 6)}
            </h1>
          </div>
        </div>
      </header>
      <div className="flex-1 flex flex-col gap-8 py-4 mb-8">
        {isLoading ? (
          <Spinner className="py-4 self-center" />
        ) : (
          <ArenaRankingList
            selected={myAvatarAddress ?? undefined}
            arenaRankings={arenaRankingsQuery.data ?? []}
            myAvatarAddress={myAvatarAddress ?? undefined}
          />
        )}
      </div>
      <Controller />
    </div>
  );
};

export default ArenaPage;
