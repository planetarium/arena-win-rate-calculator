const ArenaPage = () => {
  return (
    <div className="px-4 flex flex-col flex-1 bg-neutral card shadow-xl">
      <div className="join w-full mt-4">
        <div className="w-full">
          <div>
            <input
              className="input input-bordered join-item w-full"
              placeholder="0x..."
            />
          </div>
        </div>
        <div className="indicator">
          <button className="btn join-item">Search</button>
        </div>
      </div>

      <div className="mt-2 overflow-auto min-h-0 flex-grow flex-shrink basis-0">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>Info</th>
              <th>Score</th>
              <th>Win Rate</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-bold">zumic</div>
                    <div className="text-sm opacity-50">#c106</div>
                  </div>
                </div>
              </td>
              <td>3062</td>
              <td className="text-center">
                <div className="badge badge-primary">70%</div>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-bold">BH</div>
                    <div className="text-sm opacity-50">#c106</div>
                  </div>
                </div>
              </td>
              <td>3062</td>
              <td className="text-center">
                <span className="loading loading-spinner loading-sm"></span>
              </td>
            </tr>
            <tr>
              <td>2</td>
              <td>
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-bold">KING</div>
                    <div className="text-sm opacity-50">#c106</div>
                  </div>
                </div>
              </td>
              <td>3062</td>
              <td className="text-center">
                <div className="badge badge-secondary">5%</div>
              </td>
            </tr>
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
