import { CopyTextButton } from "@/components/Buttons/CopyTextButton/CopyTextButton";
import { BROWSER_STATE } from "@/constants/browserState";
import { usePantheonApi } from "@/contexts/PantheonApi/PantheonApiContext";
import type { Settings } from "@/contexts/Settings/Settings";
import { useSettingsFull } from "@/contexts/Settings/SettingsContext";
import { defaultSettings } from "@/contexts/Settings/settingsDefaults";
import { duration } from "@/utils/relativeTime";
import { useCallback } from "react";
import "./SettingsPage.css";

type StringKey = { [K in keyof Settings]: Settings[K] extends string ? K : never }[keyof Settings];

type NumberKey = { [K in keyof Settings]: Settings[K] extends number ? K : never }[keyof Settings];

export const SettingsPage: React.FC = () => {
    const { settings, setValue, resetValue } = useSettingsFull();

    const { loginUrl } = usePantheonApi();

    const makeTextChangeHandler = useCallback(
        <K extends StringKey>(key: K) => {
            return (e: React.ChangeEvent<HTMLInputElement>) => {
                setValue(key, e.target.value);
            };
        },
        [setValue],
    );

    const makeNumberChangeHandler = useCallback(
        <K extends NumberKey>(key: K) => {
            return (e: React.ChangeEvent<HTMLInputElement>) => {
                const asNumber = Number(e.target.value);

                if (Number.isSafeInteger(asNumber) && asNumber >= 0) {
                    setValue(key, asNumber);
                }
            };
        },
        [setValue],
    );

    const makeResetHandler = useCallback(
        <K extends keyof Settings>(key: K) => {
            return () => resetValue(key);
        },
        [resetValue],
    );

    return (
        <section className="settings-page">
            <h1>Settings</h1>

            <div className="input-container">
                <div>
                    <label>
                        <p>Server URL</p>

                        <input
                            type="text"
                            value={settings.serverUrl}
                            onChange={makeTextChangeHandler("serverUrl")}
                        />
                    </label>

                    <div className="button-container">
                        <button
                            type="reset"
                            disabled={settings.serverUrl === defaultSettings.serverUrl}
                            onClick={makeResetHandler("serverUrl")}
                        >
                            Reset
                        </button>
                    </div>

                    <p>Endpoint to the Pantheon Community API.</p>
                </div>

                <div>
                    <label>
                        <p>Discord Client ID</p>

                        <input
                            value={settings.discordClientId}
                            onChange={makeTextChangeHandler("discordClientId")}
                        />
                    </label>

                    <div className="button-container">
                        <button
                            type="reset"
                            disabled={settings.discordClientId === defaultSettings.discordClientId}
                            onClick={makeResetHandler("discordClientId")}
                        >
                            Reset
                        </button>
                    </div>

                    <p>Discord application ID for OAuth flows.</p>
                </div>

                <div>
                    <label>
                        <p>Redirect URI</p>

                        <input
                            value={settings.redirectUri}
                            onChange={makeTextChangeHandler("redirectUri")}
                        />
                    </label>

                    <div className="button-container">
                        <button
                            type="reset"
                            disabled={settings.redirectUri === defaultSettings.redirectUri}
                            onClick={makeResetHandler("redirectUri")}
                        >
                            Reset
                        </button>
                    </div>

                    <p>
                        URI to redirect to after Discord OAuth is completed.
                        <br />
                        This must exactly match a redirect URL of the Discord application.
                    </p>
                </div>

                <div>
                    <label>
                        <p>Upper Refresh Threshold</p>

                        <input
                            value={settings.maxRefreshMinutes.toString()}
                            onChange={makeNumberChangeHandler("maxRefreshMinutes")}
                            inputMode="numeric"
                        />
                    </label>

                    <div className="button-container">
                        <button
                            type="reset"
                            disabled={
                                settings.maxRefreshMinutes === defaultSettings.maxRefreshMinutes
                            }
                            onClick={makeResetHandler("maxRefreshMinutes")}
                        >
                            Reset
                        </button>
                    </div>

                    <p>
                        If your current session expires in this many minutes or less, a refresh will
                        be attempted.
                        <br />
                        Setting to 0 will disable background refreshes entirely.
                        <br />
                        Currently{" "}
                        <b>{duration(Date.now() + settings.maxRefreshMinutes * 60 * 1000)}</b>.
                    </p>
                </div>

                <div>
                    <label>
                        <p>Lower Refresh Threshold</p>

                        <input
                            value={settings.minRefreshSeconds.toString()}
                            onChange={makeNumberChangeHandler("minRefreshSeconds")}
                            inputMode="numeric"
                        />
                    </label>

                    <div className="button-container">
                        <button
                            type="reset"
                            disabled={
                                settings.minRefreshSeconds === defaultSettings.minRefreshSeconds
                            }
                            onClick={makeResetHandler("minRefreshSeconds")}
                        >
                            Reset
                        </button>
                    </div>

                    <p>
                        If your current session expires in this many seconds or less, a refresh will
                        never be attempted.
                        <br />
                        Currently <b>{duration(Date.now() + settings.minRefreshSeconds * 1000)}</b>.
                    </p>
                </div>
            </div>

            <h3>Advanced Stuff</h3>

            <div className="extra-container">
                <p>
                    <span>OAuth Link</span>

                    <CopyTextButton text={loginUrl} />
                </p>

                <pre>{loginUrl}</pre>

                <p>State</p>
                <pre>{BROWSER_STATE}</pre>
            </div>
        </section>
    );
};
