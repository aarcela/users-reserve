import { FormMessage, Message } from "@/components/form-message";
import SignupClient from "@/components/auth/SignupClient";

export default async function Signup(props: { searchParams: Promise<Message> }) {
    const searchParams = await props.searchParams;
    console.log(searchParams);
    return (
        <>
            {"message" in searchParams ? (
                <div className="w-full flex-1 flex items-center h-screen sm:max-w-md justify-center gap-2 p-4">
                    <FormMessage message={searchParams} />
                </div>
            ) : (
                <SignupClient />
            )}
        </>
    );
}
