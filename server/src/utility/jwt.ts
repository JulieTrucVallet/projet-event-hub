import jwt, { type Secret, type SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "";
if (!JWT_SECRET) throw new Error("Missing JWT_SECRET");

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "1h";
const JWT_2FA_EXPIRES_IN = process.env.JWT_2FA_EXPIRES_IN ?? "5m";

type Pending2faPayload = { sub: string; purpose: "2fa_pending" };
type AccessPayload = { sub: string; purpose: "access" };

const secret: Secret = JWT_SECRET;

function sign(payload: object, expiresIn: NonNullable<SignOptions["expiresIn"]>) {
  return jwt.sign(payload, secret, { expiresIn });
}

export function signAccessToken(userId: string) {
  const payload: AccessPayload = { sub: userId, purpose: "access" };
  return sign(payload, JWT_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>);
}

export function signPending2faToken(userId: string) {
  const payload: Pending2faPayload = { sub: userId, purpose: "2fa_pending" };
  return sign(payload, JWT_2FA_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>);
}

export function verifyPending2faToken(token: string): string {
  const decoded = jwt.verify(token, secret) as Pending2faPayload;
  if (decoded?.purpose !== "2fa_pending" || !decoded?.sub) {
    throw new Error("Invalid pending token");
  }
  return decoded.sub;
}

export function verifyAccessToken(token: string): string {
  const decoded = jwt.verify(token, secret) as AccessPayload;
  if (decoded?.purpose !== "access" || !decoded?.sub) {
    throw new Error("Invalid access token");
  }
  return decoded.sub;
}