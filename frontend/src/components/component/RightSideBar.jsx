import { useSelector } from "react-redux";
import SideBarUserSuggestedUser from "./SideBarUserSuggestedUser";
import SideBarUserSwitch from "./SideBarUserSwitch";

const RightSideBar = () => {
  const { suggestedUser } = useSelector(store => store.auth)

  return (
    <div className="w-full hidden lg:block sm:w-1/4  p-4 border rounded-lg bg-white">
      <SideBarUserSwitch />

      <div className="mt-6">
        <div className="flex justify-between items-center">
          <h1 className="text-sm font-bold text-gray-500">Suggested for You</h1>
          <button className="text-sm text-blue-600 hover:underline"></button>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {suggestedUser.map((suggestUser) => (
            <SideBarUserSuggestedUser key={suggestUser?.id} suggestUser={suggestUser} />
          ))}
        </div>
      </div>

      <div className="mt-9 text-xs p-3 text-gray-500">
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div>
            <h3 className="font-semibold text-gray-700">About</h3>
            <p><a href="#" className="hover:text-blue-600">Help</a></p>
            <p><a href="#" className="hover:text-blue-600">Press</a></p>
            <p><a href="#" className="hover:text-blue-600">API</a></p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Legal</h3>
            <p><a href="#" className="hover:text-blue-600">Privacy</a></p>
            <p><a href="#" className="hover:text-blue-600">Terms</a></p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-700">Info</h3>
            <p><a href="#" className="hover:text-blue-600">Locations</a></p>
            <p><a href="#" className="hover:text-blue-600">Language</a></p>
          </div>
        </div>
        <div className="mt-8 text-center">
          <p>Meta Verified</p>
          <p>© 2024 Instagram from Meta</p>
        </div>
      </div>
    </div>

  );
};

export default RightSideBar;
