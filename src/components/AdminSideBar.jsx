import React from "react";
import Logo from "../assets/icons8-ticket-100.png"
import Avatar from "./Avatar";
import { useSelector } from "react-redux";
import { LayoutDashboardIcon, UsersRoundIcon } from "lucide-react";
import usersIcon from "../assets/icons/icons8-users-24.png";
import dashIcon from "../assets/icons/icons8-dashboard-layout-24.png"
import calendarIcon from"../assets/icons/icons8-calendar-30.png";
import analyticsIcon from "../assets/icons/icons8-statistics-30.png";

function AdminSideBar() {
    const currentUser = useSelector((state) => state.auth.currentUser);
    return (
        <div className="h-screen w-1/6 text-black">
            <nav className="h-full flex flex-col border-r shadow-sm">
                <div className="flex p-4 overflow-hidden">
                    <img src={Logo} className="w-12 h-12"/>
                    <h2 className="text-purple-600 text-4xl ">Ticksy</h2>
                </div>
                 <div className="flex-1 px-3">
                    <div className="flex">
                        <img src={dashIcon}/>
                        <p>Dashboard</p>
                    </div>
                    <div className="flex">
                        <img src={ usersIcon }/>
                        <p>Users</p>
                    </div>
                    <div className="flex">
                        <img src={calendarIcon}/>
                        <p>Events</p>
                    </div>
                    <div className="flex">
                        <img src={analyticsIcon}/>
                        <p>Analytics</p>
                    </div>
                 </div>


                <div className="border-t flex p-3">
                    <Avatar />
                    <div className="flex justify-between items-center w-52 ml-3">
                        <div className="leading-4 flex flex-col">
                            <a href={`/${currentUser?.role}/${currentUser?.id}/profile`} className="font-semibold">{currentUser?.first_name} {currentUser?.last_name}</a>
                            <span className="text-xs text-gray-600 capitalize">{currentUser?.role}</span>
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default AdminSideBar;