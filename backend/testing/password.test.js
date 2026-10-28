import assert from "node:assert/strict";
import test from "node:test";
import { comparePassword, hashPassword } from "../utils/hashPassword.js";

test("hashed passwords can be verified without exposing the original value", async () => {
  const password = "correct horse battery staple";
  const hashedPassword = await hashPassword(password);

  assert.notEqual(hashedPassword, password);
  assert.equal(await comparePassword(password, hashedPassword), true);
  assert.equal(await comparePassword("incorrect password", hashedPassword), false);
});
