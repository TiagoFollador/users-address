export function loader() {
  // Return a harmless JSON body for probes from browsers or devtools.
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

export default function WellKnown() {
  // This route is only here to satisfy probes; render nothing client-side.
  return null;
}
