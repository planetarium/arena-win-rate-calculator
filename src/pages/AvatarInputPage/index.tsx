import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { RadioGroup } from "@headlessui/react";
import { Routes } from "../../constants";
import { Avatar } from "../../types";
import { getAvatars } from "../../apiClient";
import NcLogo from "../../assets/images/nc-logo.png";

const AvatarInputPage = () => {
  const navigate = useNavigate();

  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [avatarIndex, setAvatarIndex] = useState<number>(0);
  const [searchParams] = useSearchParams();
  const agentAddress = searchParams.get("agentAddress");

  useEffect(() => {
    if (agentAddress) {
      getAvatars(agentAddress).then((r) => {
        setAvatars(
          r.avatars.map((d: any) => ({
            name: d.avatarName,
            code: d.avatarAddress,
          }))
        );
      });
    }
  }, []);

  const handleSubmit = () => {
    navigate(`/${Routes.ARENA}?avatarAddress=${avatars[avatarIndex].code}`);
  };

  const handleRadioChange = (i: number) => {
    setAvatarIndex(i);
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
        <div className="flex flex-col gap-2">
          <RadioGroup
            value={avatarIndex}
            onChange={handleRadioChange}
            className="flex flex-col gap-6"
          >
            {avatars.map((avatar, index) => (
              <RadioGroup.Option value={index}>
                {({ checked }) => (
                  <button
                    className={`p-3 w-full rounded-full text-xl text-center ${checked ? "bg-neutral-50 text-neutral-950 font-bold" : "bg-neutral-950 text-neutral-50"}`}
                  >
                    {avatar.name}
                  </button>
                )}
              </RadioGroup.Option>
            ))}
          </RadioGroup>
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

export default AvatarInputPage;
