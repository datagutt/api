export const runtime = "edge";
export async function GET(req: Request) {
  return new Response(
    "I turned myself into an API, Morty! Boom!\r\nBig reveal: I'm an API.\r\nWhat do you think about that? I turned myself into an API! W-what are you just staring at me for, bro.\r\nI turned myself into an API, Morty!"
  );
}
