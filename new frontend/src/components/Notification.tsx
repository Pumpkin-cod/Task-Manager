import React from "react";
import toast, { Toaster } from "react-hot-toast";

type NotificationProps = {
    message: string;
    type?: "success" | "error" | "loading";
};

const Notification: React.FC<NotificationProps> = ({ message, type = "success" }) => {
    React.useEffect(() => {
        if (type === "success") {
            toast.success(message);
        } else if (type === "error") {
            toast.error(message);
        } else {
            toast.loading(message);
        }
    }, [message, type]);

    return <Toaster position="top-right" />;
};

export default Notification;