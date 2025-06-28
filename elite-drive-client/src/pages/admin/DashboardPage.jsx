import React from 'react';


import MaintenanceStatus from "../../components/admin/MaintenanceStatus";


const DashboardPage = () => {
    return (
        <div>
            <div>
                <h1 className="h1 text-white font-semibold pl-4 md:pl-20 lg:pl-20">Dashboard</h1>
            </div>
            <div className="text-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">

                <MaintenanceStatus />
                etc etc
            </div>

        </div>
    );
}

export default DashboardPage;