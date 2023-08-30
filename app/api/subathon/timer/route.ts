import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(duration);

export const runtime = "nodejs";

const OVERLAY_ID = process.env.OVERLAY_ID;
const API_KEY = process.env.API_KEY;

export async function GET(req: Request) {
  const timer = await fetch(
    `https://kvstore.streamelements.com/v2/channel/${OVERLAY_ID}/customWidget.marathon`,
    {
      headers: {
        accept: "application/json",
        authorization: `apikey ${API_KEY}`,
        "sec-ch-ua":
          '"Chromium";v="116", "Not)A;Brand";v="24", "Google Chrome";v="116"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "sec-gpc": "1",
        Referer: "https://streamelements.com/",
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: null,
      method: "GET",
    }
  );

  if (!timer.ok) {
    return new Response("Failed to fetch timer", {
      status: 500,
    });
  }

  const timerData = await timer.json();

  const end = dayjs(timerData.current);
  const start = dayjs();

  const formattedDuration = dayjs.duration(end.diff(start)).format("HH:mm:ss");

  return new Response(formattedDuration, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
