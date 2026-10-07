/* global process, Request, Response, URL */

if (process.env.NEUSTAND_RESEND_MOCK === "1") {
  const nativeFetch = globalThis.fetch.bind(globalThis);

  globalThis.fetch = async (input, init) => {
    const url = new URL(
      input instanceof Request ? input.url : input instanceof URL ? input.href : input,
    );

    if (url.hostname !== "api.resend.com") {
      return nativeFetch(input, init);
    }

    if (url.pathname !== "/emails") {
      return Response.json(
        { name: "test_mock_rejected", message: "Unexpected Resend API path in test mode." },
        { status: 400 },
      );
    }

    let payload;
    try {
      payload = JSON.parse(init?.body?.toString() ?? "{}");
    } catch {
      return Response.json(
        { name: "test_mock_invalid_request", message: "Invalid local test payload." },
        { status: 400 },
      );
    }

    const firstName = /^Vorname: (.+)$/m.exec(payload.text ?? "")?.[1];
    if (firstName === "QA_RESEND_ACCEPT") {
      return Response.json({ id: "local-test-message-accepted" });
    }
    if (firstName === "QA_RESEND_REJECT") {
      return Response.json(
        { name: "controlled_test_rejection", message: "Local Resend rejection simulation." },
        { status: 422 },
      );
    }
    if (firstName === "QA_RESEND_NETWORK_ERROR") {
      throw new Error("Local Resend network failure simulation.");
    }

    return Response.json(
      { name: "test_mock_rejected", message: "No matching local Resend scenario." },
      { status: 400 },
    );
  };
}
