import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="w-full">
      <>
        <div className="px-3 lg:px-20 py-3">
          <Outlet />
        </div>
      </>
    </div>
  );
};

export default AppLayout;
