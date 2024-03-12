import { FC } from "react";
import { ArenaRanking } from "../../types";
import { FiDownload } from "react-icons/fi";
import { Spinner } from "../../components/Spinner";

type Props = {
  arenaRankings: ArenaRanking[];
  selected?: string;
  handleInquireWinRate?: (index: number) => void;
};
export const ArenaRankingList: FC<Props> = ({
  selected,
  arenaRankings,
  handleInquireWinRate,
}) => {
  if (!arenaRankings.length) {
    return <div className="text-center py-4">No data</div>;
  }

  return (
    <div className="flex-1">
      <div className="px-8 pt-4 pb-1 border-b border-neutral-700 flex gap-3 text-neutral-700 text-sm">
        <div className="flex-shrink-0 flex-grow-0 w-12">#</div>
        <div className="flex-shrink-0 flex-1">Avatar</div>
        <div className="flex-shrink-0 flex-grow-0 w-16 text-center">Score</div>
        <div className="flex-shrink-0 flex-grow-0 w-16 text-center">
          Win Rate
        </div>
      </div>
      {arenaRankings.map((arena, index) => (
        <div
          className={`px-8 py-4 border-b border-neutral-700 flex gap-3 items-center ${arena.address.toLowerCase() === selected?.toLowerCase() ? "bg-neutral-900" : ""}`}
        >
          <div className="flex-shrink-0 flex-grow-0 w-12">{arena.ranking}</div>
          <div className="flex-shrink-0 flex-1">
            <p>
              <span className="font-semibold">{arena.name}</span>
              <span className="text-neutral-500">#{arena.code}</span>
            </p>
            <p className="text-sm text-neutral-500 font-semibold">
              {arena.cp ? `CP ${arena.cp}` : ""}
            </p>
          </div>
          <div className="flex-shrink-0 flex-grow-0 w-16 font-bold text-center">
            {arena.score}
          </div>
          <div className="flex-shrink-0 flex-grow-0 w-16 text-center">
            {arena.winRate === undefined && (
              <button
                className="inline-flex h-8 w-8 rounded-full bg-neutral-50 justify-center items-center"
                onClick={() => handleInquireWinRate?.(index)}
              >
                <FiDownload className="stroke-neutral-950" size={20} />
              </button>
            )}
            {arena.winRate === null && (
              <div className="flex justify-center">
                <Spinner />
              </div>
            )}
            {typeof arena.winRate === "number" && <div>{arena.winRate}%</div>}
          </div>
        </div>
      ))}
    </div>
  );
};
