import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Routes } from "../../constants";
import { Avatar } from "../../types";

const AvatarInputPage = () => {
  const navigate = useNavigate();

  const [avatars, setAvatars] = useState<Array<Avatar>>([]);
  const [avatarIndex, setAvatarIndex] = useState<number>(0);
  const [searchParams] = useSearchParams();
  const agentAddress = searchParams.get("agentAddress");

  useEffect(() => {
    console.log(agentAddress);
    setAvatars([
      { name: "temp1", code: "0x1e1b572db70ab80bb02783a0d2c594a0ede6db28" },
      { name: "temp2", code: "0x2e1b572db70ab80bb02783a0d2c594a0ede6db28" },
      { name: "temp3", code: "0x3e1b572db70ab80bb02783a0d2c594a0ede6db28" },
    ]);
  }, []);

  const handleSubmit = () => {
    navigate(`/${Routes.ARENA}?avatarAddress=${avatars[avatarIndex].code}`);
  };

  const handleRadioChange = (i: number) => {
    setAvatarIndex(i);
  };

  return (
    <div className="flex-1 flex items-center">
      <div className="card w-full bg-neutral shadow-xl">
        <div className="card-body">
          <div className="flex items-center">
            <div className="w-full">
              {avatars.map((d, i) => (
                <div className="form-control" key={d.code}>
                  <label className="label cursor-pointer">
                    <span className="label-text">{d.name}</span>
                    <input
                      type="radio"
                      name="radio-10"
                      className="radio radio-primary"
                      checked={avatarIndex === i}
                      onChange={() => handleRadioChange(i)}
                    />
                  </label>
                </div>
              ))}
            </div>
            <button onClick={handleSubmit} className="btn btn-primary ml-2">
              Enter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarInputPage;
