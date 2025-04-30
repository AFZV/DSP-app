import { Logo } from "../Logo";
import { SideBarRoutes } from "../SideBarRoutes";

export function SideBar() {
  return (
    <div className="h-screen ">
      <div className="h-full flex flex-col border-r">
        <Logo />
        <SideBarRoutes />
      </div>
    </div>
  );
}
