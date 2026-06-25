import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.SECRET_KEY_JWT;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: { data: Record<string, unknown>; expires: number }) {
  return await new SignJWT(payload.data)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(payload.expires)
    .sign(key);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}
