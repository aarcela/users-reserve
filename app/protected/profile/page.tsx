import Profile from "@/components/patient/Profile";
import { createClient } from "@/utils/supabase/server";
import React from "react";

async function ProfilPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const { data: userData, error } = await supabase
        .from("patient")
        .select("*")
        .eq("id", user?.id)
        .single();

    return (
        <div>
            <Profile
                uid={userData.id}
                name={userData.name}
                lastName={userData.lastName}
                docId={userData.docId}
                email={userData.email}
                userType={userData.type}
                phone={user?.phone}
                location={userData?.location}
            />
        </div>
    );
}

export default ProfilPage;
