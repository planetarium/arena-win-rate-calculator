import { Link } from "react-router-dom";
import { Routes } from "../../constants";

const AvatarInputPage = () => {
  return (
    <div className="flex-1 flex items-center">
      <div className="card w-full bg-neutral shadow-xl">
        <div className="card-body">
          <div className="flex items-center">
            <div className="w-full">
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Avatar 1</span>
                  <input
                    type="radio"
                    name="radio-10"
                    className="radio radio-primary"
                    checked
                  />
                </label>
              </div>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text">Avatar 2</span>
                  <input
                    type="radio"
                    name="radio-10"
                    className="radio radio-primary"
                  />
                </label>
              </div>
            </div>
            <Link to={`/${Routes.ARENA}`} className="btn btn-primary ml-2">
              Enter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AvatarInputPage;
