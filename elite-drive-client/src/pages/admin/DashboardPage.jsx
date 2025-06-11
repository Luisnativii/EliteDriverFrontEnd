import React from 'react';

import DailyReservations from "../../components/admin/DailyReservations";
import CalendarSection from "../../components/admin/CalendarSection";
import MaintenanceStatus from "../../components/admin/MaintenanceStatus";
import CustomersCard from "../../components/admin/CustomersCard";


const DashboardPage = () => {
    return (
        <div>
            <div>
                <h1 className="text-h1 font-semibold pl-4 md: pl-20 lg:pl-20">Dashboard</h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                <DailyReservations />
                <CalendarSection />
                <MaintenanceStatus />
                <CustomersCard /> </div>
        </div>
    );
}

export default DashboardPage;