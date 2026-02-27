import { useCallback, useContext, useEffect, useState } from "react";
import { SettingsContext } from "@/contexts/Settings";
import { defaultSettings } from "@/contexts/Settings/settingsDefaults";
import "./SettingsPage.css";
import { CopyTextButton } from "@/components/Buttons/CopyTextButton";
import { GlobalContext } from "@/contexts/Global";

enum ServerStatus {
	Untested,
	Checking,
	Bad,
	Ok,
}

export const SettingsPage = () => {
	const { settings, sessionData, setValue, resetValue } = useContext(SettingsContext);

	const { makeApiRequest } = useContext(GlobalContext);

	const [serverStatus, setServerStatus] = useState(ServerStatus.Untested);

	const [controller, setController] = useState<AbortController>();

	const handleTestServer = useCallback(async () => {
		setServerStatus(ServerStatus.Checking);

		const localController = new AbortController();
		setController(localController);

		const result = await makeApiRequest("/", { signal: localController.signal });

		setServerStatus(result ? ServerStatus.Ok : ServerStatus.Bad);
	}, [makeApiRequest]);

	useEffect(() => {
		if (controller === undefined) return;

		return () => {
			controller.abort();
		};
	}, [controller]);

	return (
		<section className="settings-page">
			<h1>Settings</h1>

			<div className="input-container">
				<form onSubmit={(e) => e.preventDefault()}>
					<label>
						<p>Server URL</p>

						<input
							type="text"
							value={settings.serverUrl}
							onChange={(e) => {
								setValue("serverUrl", e.target.value);
								setServerStatus(ServerStatus.Untested);
							}}
						/>
					</label>

					<div className="button-container">
						<button
							type="reset"
							disabled={settings.serverUrl === defaultSettings.serverUrl}
							onClick={() => resetValue("serverUrl")}
						>
							Reset
						</button>

						<button
							type="submit"
							disabled={serverStatus === ServerStatus.Checking}
							onClick={handleTestServer}
						>
							Test
						</button>

						<p className={`status ${ServerStatus[serverStatus]}`}>
							{ServerStatus[serverStatus]}
						</p>
					</div>

					<p>Endpoint to the Pantheon Community API.</p>
				</form>

				<div>
					<label>
						<p>Discord Client ID</p>

						<input
							value={settings.discordClientId}
							onChange={(e) => setValue("discordClientId", e.target.value)}
						/>
					</label>

					<div className="button-container">
						<button
							type="reset"
							disabled={settings.discordClientId === defaultSettings.discordClientId}
							onClick={() => resetValue("discordClientId")}
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
							onChange={(e) => setValue("redirectUri", e.target.value)}
						/>
					</label>

					<div className="button-container">
						<button
							type="reset"
							disabled={settings.redirectUri === defaultSettings.redirectUri}
							onClick={() => resetValue("redirectUri")}
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
							onChange={(e) => {
								const asNumber = Number(e.target.value);

								if (Number.isSafeInteger(asNumber) && asNumber >= 0) {
									setValue("maxRefreshMinutes", asNumber);
								}
							}}
							inputMode="numeric"
						/>
					</label>

					<div className="button-container">
						<button
							type="reset"
							disabled={
								settings.maxRefreshMinutes === defaultSettings.maxRefreshMinutes
							}
							onClick={() => resetValue("maxRefreshMinutes")}
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
						Currently: <b>{(settings.maxRefreshMinutes / 60).toLocaleString()}</b>{" "}
						hours.
					</p>
				</div>

				<div>
					<label>
						<p>Lower Refresh Threshold</p>

						<input
							value={settings.minRefreshSeconds.toString()}
							onChange={(e) => {
								const asNumber = Number(e.target.value);

								if (Number.isSafeInteger(asNumber) && asNumber >= 0) {
									setValue("minRefreshSeconds", asNumber);
								}
							}}
							inputMode="numeric"
						/>
					</label>

					<div className="button-container">
						<button
							type="reset"
							disabled={
								settings.minRefreshSeconds === defaultSettings.minRefreshSeconds
							}
							onClick={() => resetValue("minRefreshSeconds")}
						>
							Reset
						</button>
					</div>

					<p>
						If your current session expires in this many seconds or less, a refresh will
						never be attempted.
					</p>
				</div>
			</div>

			<h3>Advanced Stuff</h3>

			<div className="extra-container">
				<p>
					<span>OAuth Link</span>

					<CopyTextButton text={sessionData.oAuthLink} />
				</p>

				<pre>{sessionData.oAuthLink}</pre>

				<p>State</p>
				<pre>{sessionData.state}</pre>
			</div>
		</section>
	);
};
