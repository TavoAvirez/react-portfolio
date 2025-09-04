import { useEffect, useState } from "react";

function ClockDemo() {

    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        let id: number | null = null;

        const start = () => {
            if (id === null) {
                id = window.setInterval(() => setNow(new Date()), 1000);
            }
        }

        const stop = () => {
            if (id !== null) {
                clearInterval(id);
                id = null;
            }
        }

        const onVisibility = () => (document.hidden ? stop() : start());
        
        start();
        document.addEventListener("visibilitychange", onVisibility);

        return () => {
            stop();
            document.removeEventListener("visibilitychange", onVisibility);
        }
    }, []);

    const time = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "America/Monterrey",
    });

    const date = now.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "2-digit",
        timeZone: "America/Monterrey",
    });

    return (
        <div style={{ padding: 16 }}>
            <h2>Clock Demo ⏰</h2>
            <p>
              This live clock displays the current local time and date for the Monterrey, Mexico timezone. The display updates every second and automatically pauses when the tab is inactive to save resources.
            </p>
            <div style={{ fontSize: 48, lineHeight: 1.2 }}>{time}</div>
            <div style={{ opacity: 0.7, marginTop: 8 }}>{date}</div>
        </div>
    );
}

export default ClockDemo;