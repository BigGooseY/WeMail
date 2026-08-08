import { afterEach, describe, expect, it, vi } from "vitest";

import { ADMIN_COMMERCIAL_REQUEST_TIMEOUT_MS, fetchAdminCommercial } from "../features/admin/api";

describe("admin commercial API", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it("aborts a commercial summary request that exceeds the client timeout", async () => {
    vi.useFakeTimers();
    vi.spyOn(globalThis, "fetch").mockImplementation((_input, init) => {
      return new Promise<Response>((_, reject) => {
        init?.signal?.addEventListener("abort", () => {
          reject(new DOMException("The request was aborted", "AbortError"));
        });
      });
    });

    const request = fetchAdminCommercial();
    const assertion = expect(request).rejects.toMatchObject({ name: "AbortError" });
    await vi.advanceTimersByTimeAsync(ADMIN_COMMERCIAL_REQUEST_TIMEOUT_MS);

    await assertion;
  });
});
