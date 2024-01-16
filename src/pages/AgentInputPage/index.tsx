import { Link } from "react-router-dom";
import { Routes } from "../../constants";

const AgentInputPage = () => {
  return (
    <div className="flex-1 flex items-center">
      <div className="card w-full bg-neutral shadow-xl">
        <div className="card-body items-center">
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="label-text text-lg">Type your agent address</span>
            </div>
            <div className="flex">
              <input
                type="text"
                placeholder="0x..."
                className="input input-bordered w-full max-w-xs"
              />
              <Link to={`/${Routes.AVATAR}`} className="btn btn-primary ml-2">Enter</Link>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AgentInputPage;
