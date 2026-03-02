function plural(this: string, count: number): string {
	return `${count.toLocaleString()} ${this}${count === 1 ? "" : "s"}`;
}

const toSeconds = plural.bind("second");
const toMinutes = plural.bind("minute");
const toHours = plural.bind("hour");
const toDays = plural.bind("day");
const toWeeks = plural.bind("week");
const toMonths = plural.bind("month");
const toYears = plural.bind("year");

// I'm aware dayjs exists, but I dislike how imprecise it is. I'm also aware configuration
// threholds exist for this exact case, however their parameters are almost completely undocumented
// and don't seem to work. If you can get it working then feel free to replace this function :)
export function duration(a: number, b: number = Date.now(), join = " and "): string {
	let seconds = Math.floor(Math.abs(a - b) / 1000);

	// less than a minute

	if (seconds < 60) {
		return toSeconds(seconds);
	}

	// less than an hour

	let minutes = Math.floor(seconds / 60);

	if (minutes < 60) {
		seconds %= 60;

		const minutesStr = toMinutes(minutes);

		if (seconds !== 0) {
			return `${minutesStr}${join}${toSeconds(seconds)}`;
		}

		return minutesStr;
	}

	// less than a day

	let hours = Math.floor(minutes / 60);

	if (hours < 24) {
		minutes %= 60;

		const hoursStr = toHours(hours);

		if (minutes !== 0) {
			return `${hoursStr}${join}${toMinutes(minutes)}`;
		}

		return hoursStr;
	}

	// less than a week

	let days = Math.floor(hours / 24);

	if (days < 7) {
		hours %= 24;

		const daysStr = toDays(days);

		if (hours !== 0) {
			return `${daysStr}${join}${toHours(hours)}`;
		}

		return daysStr;
	}

	// less than a month (approx. 4 weeks)

	const weeks = Math.floor(days / 7);

	if (weeks <= 4) {
		days %= 7;

		const weeksStr = toWeeks(weeks);

		if (days !== 0) {
			return `${weeksStr}${join}${toDays(days)}`;
		}

		return weeksStr;
	}

	// less than a year (approx. 30 days);

	let months = Math.floor(days / 30);

	if (months < 12) {
		days %= 30;

		const monthsStr = toMonths(months);

		if (days !== 0) {
			return `${monthsStr}${join}${toDays(days)}`;
		}

		return monthsStr;
	}

	// X years

	const yearsStr = toYears(Math.floor(months / 12));

	months %= 12;

	if (months !== 0) {
		return `${yearsStr}${join}${toMonths(months)}`;
	}

	return yearsStr;
}
