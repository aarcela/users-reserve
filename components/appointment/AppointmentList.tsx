import React from "react";

interface Props {
    appointmentList: {
        appointment_date: Date;
        count: number;
        appointment_type: string;
        patient: any;
    }[];
}

function AppointmentList({ appointmentList }: Props) {
    return (
        <div className="bg-muted rounded-md p-6 my-6 relative">
            <ul>
                {appointmentList!.map(
                    ({ appointment_date, appointment_type, count, patient }, index) => (
                        <div key={index}>
                            <h2>{appointment_type?.toUpperCase()}</h2>
                            <h3>{appointment_date.toString()}</h3>
                            <h3>
                                {patient?.name.toString()} {patient?.lastName.toString()}
                            </h3>
                            {/* <h4> {count}/20 </h4> */}
                        </div>
                    )
                )}
            </ul>
        </div>
    );
}

export default AppointmentList;
