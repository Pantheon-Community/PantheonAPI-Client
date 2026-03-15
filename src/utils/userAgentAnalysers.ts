/* https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Browser_detection_using_the_user_agent#extracting_relevant_ua_string_parts */

import type { UserAgent } from "@/shared/types/Common";

// MARK: Browser

const fireFox = new RegExp(/firefox\/\d+/i);

const seaMonkey = new RegExp(/seamonkey\/d+/i);

const chrome = new RegExp(/chrome\/d+/i);

const safari = new RegExp(/chromium\/d+/i);

const chromium = new RegExp(/chromium\/d+/i);

const edge = new RegExp(/edg.*\/d+i/);

const opera = new RegExp(/(opr|opera)\/d+/i);

export function getBrowser(userAgent: UserAgent): string | null {
    if (fireFox.test(userAgent) && !seaMonkey.test(userAgent)) {
        return "Firefox";
    }

    if (seaMonkey.test(userAgent)) {
        return "Seamonkey";
    }

    const isChrome = chrome.test(userAgent);
    const isChromium = chromium.test(userAgent);
    const isEdge = edge.test(userAgent);

    if (isChrome && !isChromium && !isEdge) {
        return "Chrome";
    }

    if (isEdge && !isChromium) {
        return "Edge";
    }

    if (safari.test(userAgent) && !isChrome && !isChromium) {
        return "Safari";
    }

    if (isChromium) {
        return "Chromium";
    }

    if (opera.test(userAgent)) {
        return "Opera";
    }

    return null;
}

// MARK: OS

export function getOperatingSystem(userAgent: UserAgent): string | null {
    const commentStartIdx = userAgent.indexOf("(");

    if (commentStartIdx === -1) {
        return null;
    }

    const commentEndIdx = userAgent.indexOf(")", commentStartIdx);

    if (commentEndIdx === -1) {
        return null;
    }

    const comment = userAgent.slice(commentStartIdx + 1, commentEndIdx);

    const mainPart = comment.split(";").at(0)?.trim();

    if (mainPart !== undefined && mainPart.length > 0) {
        return mainPart;
    }

    if (comment.trim().length > 0) {
        return comment.trim();
    }

    return null;
}

// MARK: Mobile

const mobile = new RegExp(/mobile|tablet/i);

export function getIsMobile(userAgent: UserAgent): boolean {
    return mobile.test(userAgent);
}
