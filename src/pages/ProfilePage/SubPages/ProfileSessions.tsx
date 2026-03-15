import { StatefulButton } from "@/components/Buttons/StatefulButton/StatefulButton";
import { SessionCard } from "@/components/SessionCard/SessionCard";
import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";
import { useUserSessions } from "@/contexts/UserSessions/UserSessionsContext";
import type { AuthResponse } from "@/shared/types/Responses/AuthResponse";
import type { UserSessionBasic } from "@/shared/types/UserSession";
import { useCallback, useEffect, useMemo } from "react";
import "./ProfileSessions.css";

export const ProfileSessions: React.FC<{ currentUser: AuthResponse }> = () => {
    const { currentUser } = useCurrentUser();

    const { userSessions, deleteSession, fetch } = useUserSessions();

    useEffect(() => {
        if (userSessions !== null) return;

        const controller = new AbortController();

        void fetch(controller);

        return () => controller.abort();
    }, [fetch, userSessions]);

    const { thisSession, otherSessions } = useMemo(() => {
        if (userSessions === null) {
            return { thisSession: null, otherSessions: [] };
        }

        if (currentUser?.sessionId === undefined) {
            return { thisSession: null, otherSessions: userSessions };
        }

        const idx = userSessions.findIndex((x) => x.id === currentUser.sessionId);

        if (idx === -1) {
            return { thisSession: null, otherSessions: userSessions };
        }

        const others = [...userSessions];

        return { thisSession: others.splice(idx, 1)[0], otherSessions: others };
    }, [userSessions, currentUser?.sessionId]);

    const refresh = useCallback(() => fetch(), [fetch]);

    const makeDeleteHandler = useCallback(
        (session: UserSessionBasic) => {
            return async () => await deleteSession(session.id);
        },
        [deleteSession],
    );

    if (userSessions === null) {
        return <p>Loading sessions...</p>;
    }

    return (
        <div className="profile-sessions">
            <h3>Current Session</h3>

            {thisSession ? (
                <SessionCard session={thisSession} />
            ) : (
                <p className="bad">
                    <b>Current Session Not Found</b>
                    <br />
                    <br />
                    This appears to be an error...
                </p>
            )}

            <h3>
                <span>Other Sessions ({otherSessions.length})</span>

                <StatefulButton
                    onClick={refresh}
                    textDo="Refresh"
                    textDoing="Refreshing..."
                    textDone="Refreshed!"
                />
            </h3>

            {otherSessions.length > 0 ? (
                otherSessions.map((session) => (
                    <SessionCard
                        key={session.id}
                        session={session}
                        onDelete={makeDeleteHandler(session)}
                    />
                ))
            ) : (
                <p>No other sessions found.</p>
            )}
        </div>
    );
};
