import React from "react";
import TicketLogo from '../assets/icons8-ticket-100.png';
import { useNavigate } from "react-router-dom";
import Logo from "./Logo";

function GuestNavBar() {
    const navigate = useNavigate()
    const onClick = () => {
        navigate('/register')
    }

    return (
        <div className="flex justify-between items-center p-4">
            <div className="flex gap-1 items-center">
                <Logo />
            </div>
            <div className="flex gap-4">
                <a href="/login" className="text-gray-700 hover:text-purple-600 cursor-pointer">Login</a>
                <button onClick={onClick} className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700">Register</button>
            </div>
        </div>
    );
}

export default GuestNavBar;