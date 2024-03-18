import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Routes } from "../../constants";
import NcLogo from "../../assets/images/nc-logo.png";

const AgentInputPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [agentAddress, setAgentAddress] = useState("");
  const useCache = searchParams.get("useCache");

  useEffect(() => {
    if (useCache !== "false") {
      const cachedAgentAddress = localStorage.getItem("agent");
      const cachedAvatarAddress = localStorage.getItem("avatar");

      if (cachedAvatarAddress !== null && cachedAgentAddress !== null) {
        navigate(
          `/${Routes.ARENA}?agentAddress=${cachedAgentAddress}&avatarAddress=${cachedAvatarAddress}`
        );
      } else if (cachedAgentAddress !== null) {
        navigate(`/${Routes.AVATAR}?agentAddress=${cachedAgentAddress}`);
      }
    }
  }, []);

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

    localStorage.setItem("network", "heimdall");
    localStorage.setItem("agent", agentAddress);
    navigate(`/${Routes.AVATAR}?agentAddress=${agentAddress}`);
  };

  return (
    <div className="flex flex-col flex-1">
      <header className="flex-1 max-h-80 bg-[url('/src/assets/images/nc-bg.png')] bg-cover relative">
        <div className="bg-neutral-950 bg-opacity-60 absolute w-full h-full flex flex-col justify-between p-8">
          <a href="/">
            <img src={NcLogo} alt="NcLogo" className="h-6" />
          </a>
          <div>
            <h1 className="text-5xl font-black">Ares</h1>
            <p className="text-xl text-neutral-500">
              Arena Win Rate Calculator
            </p>
          </div>
        </div>
      </header>
      <div className="flex-1 flex flex-col justify-between p-8">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-2">
            <label>Agent Address</label>
            <input
              type="text"
              placeholder="0x000000..."
              className="w-full bg-transparent outline-none placeholder:text-neutral-500 text-xl"
              value={agentAddress}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Planet</label>
            <div className="flex gap-3">
              <button className="flex-1 p-3 bg-neutral-950 rounded-full text-neutral-50 text-xl">
                Odin
              </button>
              <button className="flex-1 font-bold p-3 bg-neutral-50 rounded-full text-neutral-950 text-xl">
                Heimdall
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={handleSubmit}
          className="font-bold p-3 bg-neutral-50 rounded-full text-neutral-950 text-xl"
        >
          NEXT
        </button>
      </div>
    </div>
  );
};

export default AgentInputPage;
