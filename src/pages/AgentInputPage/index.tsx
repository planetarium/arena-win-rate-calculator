import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Routes } from "../../constants";

const AgentInputPage = () => {
  const navigate = useNavigate();
  const [agentAddress, setAgentAddress] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgentAddress(e.target.value);
  };

  const handleSubmit = () => {
    if (agentAddress.length < 42 || !agentAddress.startsWith("0x")) {
      alert(
        "Please enter a valid agent address. It should start with '0x' and be at least 42 characters long."
      );
      return;
    }

    navigate(`/${Routes.AVATAR}?agentAddress=${agentAddress}`);
  };

  return (
    <div className="flex-1 flex items-center">
      <div className="card w-full bg-neutral shadow-xl">
        <div className="card-body items-center">
          <label className="form-control w-full max-w-xs">
            <div className="flex justify-between items-center">
              <div className="label">
                <span className="label-text text-lg">
                  Type your agent address
                </span>
              </div>

              <select className="select select-ghost select-xs max-w-xs">
                <option selected>Odin</option>
                <option>Heimdall</option>
              </select>
            </div>
            <div className="flex">
              <input
                type="text"
                placeholder="0x..."
                className="input input-bordered w-full max-w-xs"
                value={agentAddress}
                onChange={handleInputChange}
              />
              <button onClick={handleSubmit} className="btn btn-primary ml-2">
                Enter
              </button>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AgentInputPage;
