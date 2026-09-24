import { createRemoteJWKSet, jwtVerify } from 'jose';

let jwks: ReturnType<typeof createRemoteJWKSet> | undefined;
let jwksIssuer: string | undefined;

export async function verifyCloudflareAccess(request: Request) {
  const teamDomain = process.env.CF_ACCESS_TEAM_DOMAIN;
  const audience = process.env.CF_ACCESS_AUD;
  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!teamDomain || !audience || !token) return null;

  try {
    const issuer = new URL(teamDomain).origin;
    if (!issuer.endsWith('.cloudflareaccess.com')) return null;
    if (!jwks || jwksIssuer !== issuer) {
      jwks = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`));
      jwksIssuer = issuer;
    }
    const { payload } = await jwtVerify(token, jwks, {
      issuer,
      audience,
      algorithms: ['RS256'],
    });
    return payload;
  } catch {
    return null;
  }
}
