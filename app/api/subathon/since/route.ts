import dayjs from "dayjs";
import humanizeDuration from "humanize-duration";

export const runtime = "nodejs";

// Define the type for the translations object
interface Translations {
  [locale: string]: {
    [key: string]: string;
  };
}

// Translations for different languages
const translations: Translations = {
  en: {
    since: "It's been",
    sinceTheSubathonStarted: "since the subathon started.",
  },
  no: {
    since: "Det har gått",
    sinceTheSubathonStarted: "siden subathonet startet.",
  },
  // Add more languages here with their respective translations
};

export async function GET(req: Request) {
  const searchParams = new URL(req.url).searchParams;
  const started = searchParams.get("start");
  const ended = searchParams.get("end");
  const locale = searchParams.get("locale") || "en";

  if (!started) {
    return new Response("Missing required query parameter 'start'", {
      status: 400,
    });
  }

  const start = dayjs(started, "YYYY-MM-DDTHH:mm:ssZ");
  if (!start.isValid()) {
    return new Response("Invalid date format for query parameter 'start'", {
      status: 400,
    });
  }

  if (start.isAfter(dayjs())) {
    return new Response("The start date cannot be in the future", {
      status: 400,
    });
  }

  const end = ended ? dayjs(ended, "YYYY-MM-DDTHH:mm:ssZ") : dayjs();

  // Set the locale for localization
  dayjs.locale(locale);

  let formattedDuration = "";
  try {
    formattedDuration = humanizeDuration.humanizer({
      unitMeasures: {
        y: 31557600000,
        mo: 30 * 24 * 60 * 60 * 1000,
        w: 604800000,
        d: 86400000,
        h: 3600000,
        m: 60000,
        s: 1000,
        ms: 1,
      },
    })(end.diff(start), {
      largest: 4,
      round: true,
      language: locale,
    });
  } catch (e) {
    return new Response("Invalid locale", {
      status: 400,
    });
  }

  const translationsForLocale = translations[locale] || translations.en;

  const translatedString = `${translationsForLocale.since} ${formattedDuration} ${translationsForLocale.sinceTheSubathonStarted}`;

  return new Response(translatedString, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
