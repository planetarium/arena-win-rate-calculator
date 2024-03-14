import { FC } from "react";
import { ArenaRanking } from "../../types";
import { ArenaRankingListItem } from "./RankingListItem";

type Props = {
  arenaRankings: ArenaRanking[];
  selected?: string;
  myAvatarAddress?: string;
  handleInquireWinRate?: (index: number) => void;
};
export const ArenaRankingList: FC<Props> = ({
  arenaRankings,
  selected,
  myAvatarAddress,
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
      {arenaRankings.map((ranking) => (
        <ArenaRankingListItem
          ranking={ranking}
          isFocused={ranking.address.toLowerCase() === selected?.toLowerCase()}
          myAvatarAddress={myAvatarAddress}
        />
      ))}
    </div>
  );
};
