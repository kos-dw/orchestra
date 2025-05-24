import ENV from "app/shared/env/.server";

function incomingWebhooks(text: string) {
  fetch(ENV.SLACK_IW_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
    }),
  });
}

export { incomingWebhooks };
