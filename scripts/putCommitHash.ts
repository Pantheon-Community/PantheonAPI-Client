import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Attempts to get the current git commit hash.
 *
 * @example "8336a7b"
 */
function getCommitHash(): string | null {
    try {
        return (
            execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] })
                .toString()
                .trim() || null
        );
    } catch {
        return null;
    }
}

const commitHash = getCommitHash();

if (commitHash !== null) {
    const script = `
        <script>
            window.GIT_COMMIT_HASH = '${commitHash}'
        </script>
    `;

    const contents = readFileSync(join(__dirname, "..", "dist", "index.html"), "utf-8");

    const scriptIdx = contents.lastIndexOf("</script>");

    if (scriptIdx === -1) {
        throw new Error("Could not find a closing <script> tag");
    }

    const newContents =
        contents.slice(0, scriptIdx + "</script>".length) +
        script +
        contents.slice(scriptIdx + "</script>".length);

    writeFileSync(join(__dirname, "..", "dist", "index.html"), newContents, "utf-8");

    console.log("Done!");
}
