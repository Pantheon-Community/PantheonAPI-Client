import { StatefulButton } from "@/components/Buttons/StatefulButton/StatefulButton";
import { useCurrentUser } from "@/contexts/CurrentUser/CurrentUserContext";
import { usePluginTokens } from "@/contexts/PluginTokens/PluginTokensContext";
import type { DiscordId, IsoString } from "@/shared/types/Common";
import {
    PLUGIN_TOKEN,
    PLUGIN_TOKEN_OBJECT,
    type PluginToken,
    type PluginTokenId,
} from "@/shared/types/PluginToken";
import { durationShort } from "@/utils/relativeTime";
import { useCallback, useEffect, useMemo, useState } from "react";
import "./TokensPage.css";

function preCreate(): boolean {
    return window.confirm("A new token will be created, you will only see the token itself once!");
}

function preDelete(): boolean {
    return window.confirm(
        "Are you sure you want to delete this token? Anything using it will stop working.",
    );
}

const RelativeTime: React.FC<{ id: DiscordId | null; iso: IsoString }> = ({ id, iso }) => {
    const { currentUser } = useCurrentUser();

    const title = useMemo(() => {
        return new Date(iso).toLocaleString("en-NZ");
    }, [iso]);

    const getRelativeTime = useCallback(() => {
        return durationShort(Date.now(), new Date(iso).getTime()) + " ago";
    }, [iso]);

    const [mainText, setMainText] = useState(getRelativeTime);

    useEffect(() => {
        const interval = setInterval(() => setMainText(getRelativeTime()), 1_000);

        return () => clearInterval(interval);
    }, [getRelativeTime]);

    const secondaryText = useMemo(() => {
        switch (id) {
            case null:
                return "";
            case currentUser?.user.id:
                return " (you)";
            default:
                return ` (${id})`;
        }
    }, [id, currentUser?.user.id]);

    return (
        <td title={title}>
            {mainText}
            {secondaryText}
        </td>
    );
};

export const TokensPage: React.FC = () => {
    const { tokens, tokenMap, shouldFetch, fetch, create, update, deleteFn, check } =
        usePluginTokens();

    useEffect(() => {
        if (!shouldFetch) return;

        const controller = new AbortController();

        void fetch(controller);

        return () => controller.abort();
    }, [fetch, shouldFetch]);

    useEffect(() => {
        const interval = setInterval(() => {
            const controller = new AbortController();

            void fetch(controller);

            return () => {
                clearInterval(interval);
                controller.abort();
            };
        }, 10_000);
    }, [fetch]);

    const doRefresh = useCallback(async () => {
        void fetch(new AbortController());
    }, [fetch]);

    const makeDeleteHandler = useCallback(
        (id: PluginTokenId) => {
            return async () => await deleteFn(id);
        },
        [deleteFn],
    );

    const makeRenameHandler = useCallback(
        (id: PluginTokenId) => {
            return async () => {
                const label = window.prompt("Enter the new name for this token")?.trim() ?? "";

                try {
                    PLUGIN_TOKEN_OBJECT.subValidators.label(label);
                } catch (error) {
                    window.alert(error);
                    return;
                }

                await update(id, { label });
            };
        },
        [update],
    );

    const doCreate = useCallback(async () => {
        const label = window.prompt("Please enter a name for this token.")?.trim() ?? "";

        try {
            PLUGIN_TOKEN_OBJECT.subValidators.label(label);
        } catch (error) {
            window.alert(error);
            return;
        }

        const createdToken = await create({ label });

        if (createdToken === null) {
            return;
        }

        window.alert(
            `Created token with ID ${createdToken.id}, the token value is ${createdToken.token}, be sure to copy it down somewhere as it will not be visible again!`,
        );

        console.log(`CREATED TOKEN`, createdToken);
    }, [create]);

    const doCheck = useCallback(async () => {
        const token = window.prompt("Please enter the token to check.")?.trim() ?? "";

        if (token.length === 0) {
            return;
        }

        try {
            PLUGIN_TOKEN.validate(token);
        } catch (error) {
            window.alert(error);
            return;
        }

        const result = await check(token as PluginToken);

        window.alert(
            result === null
                ? `This token is recognised, it may have been deleted.`
                : `This is the token for ID ${result} (${tokenMap.get(result)?.label ?? "unknown label"}).`,
        );
    }, [tokenMap, check]);

    return (
        <section className="tokens-page">
            <h1>
                <span>Tokens</span>

                <StatefulButton
                    type="button"
                    onClick={doRefresh}
                    textDo="Refresh"
                    textDoing="Refreshing..."
                    textDone="Refreshed!"
                />
            </h1>

            <p>
                These are tokens used by our plugins (e.g. Wall Street), bots, and generally any
                service not directly associated with a single user.
                <br />
                For security reasons, you'll never see the value of the tokens themselves here, but
                you can check if a token is valid using the "Check Existing Token" button below.
                <br />
                Try not to break anything by deleting in-use tokens unless it's absolutely necessary
                :)
                <br />
                This page will refresh every 10 seconds.
            </p>

            <table>
                <thead>
                    <tr>
                        <th align="left">ID</th>
                        <th align="left">Label</th>
                        <th align="right">Times Used</th>
                        <th align="left">Last Used</th>
                        <th align="left">Created</th>
                        <th align="left">Last Updated</th>
                    </tr>
                </thead>

                <tbody>
                    {tokens.map((token) => (
                        <tr key={token.id}>
                            <td>{token.id}</td>
                            <td className="label">
                                {token.label}{" "}
                                <StatefulButton
                                    type="button"
                                    onClick={makeRenameHandler(token.id)}
                                    textDo="Edit"
                                    textDoing="Editing..."
                                    textDone="Edited!"
                                />
                            </td>
                            <td align="right">{token.timesUsed.toLocaleString()}</td>
                            <RelativeTime id={null} iso={token.lastUsedAt} />
                            <RelativeTime id={token.createdBy} iso={token.createdAt} />
                            <RelativeTime id={token.lastUpdatedBy} iso={token.lastUpdatedAt} />
                            <td className="actions">
                                <StatefulButton
                                    type="button"
                                    onClick={makeDeleteHandler(token.id)}
                                    textDo="Delete"
                                    textDoing="Deleting..."
                                    textDone="Deleted!"
                                    preOnClick={preDelete}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="page-buttons">
                <StatefulButton
                    type="button"
                    onClick={doCreate}
                    textDo="Create New Token"
                    textDoing="Creating..."
                    textDone="Created!"
                    preOnClick={preCreate}
                />

                <StatefulButton
                    type="button"
                    onClick={doCheck}
                    textDo="Check Existing Token"
                    textDoing="Checking..."
                    textDone="Checked!"
                />
            </div>
        </section>
    );
};
