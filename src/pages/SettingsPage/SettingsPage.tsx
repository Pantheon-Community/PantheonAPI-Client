import { defaultSettings } from "@/contexts/Settings/settingsDefaults";
import "./SettingsPage.css";
import { CopyTextButton } from "@/components/Buttons/CopyTextButton";
import { useBrowserSession } from "@/contexts/BrowserSession/BrowserSessionContext";
import { useSettingsFull } from "@/contexts/Settings/SettingsContext";
import { duration } from "@/utils/relativeTime";

export const SettingsPage = () => {
	const { settings, setValue, resetValue } = useSettingsFull();
	const { state, oAuthLink } = useBrowserSession();

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
							onChange={(e) => setValue("serverUrl", e.target.value)}
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
						Currently{" "}
						<b>{duration(Date.now() + settings.maxRefreshMinutes * 60 * 1000)}</b>.
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
						<br />
						Currently <b>{duration(Date.now() + settings.minRefreshSeconds * 1000)}</b>.
					</p>
				</div>
			</div>

			<h3>Advanced Stuff</h3>

			<div className="extra-container">
				<p>
					<span>OAuth Link</span>

					<CopyTextButton text={oAuthLink} />
				</p>

				<pre>{oAuthLink}</pre>

				<p>State</p>
				<pre>{state}</pre>
			</div>
		</section>
	);
};
