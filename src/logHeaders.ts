export async function logHeaders(response: Response) {
  for (const h of response.headers.entries()) console.log(h[0], h[1]);
  console.log(await response.text());
}
