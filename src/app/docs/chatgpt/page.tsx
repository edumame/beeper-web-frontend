import Link from "next/link";

export const metadata = {
  title: "Beeper in ChatGPT — Docs",
  description:
    "Add Beeper as a custom MCP connector in ChatGPT Developer Mode.",
};

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="font-code-sm text-code-sm bg-surface-container px-1.5 py-0.5 rounded border border-outline-variant text-on-surface">
      {children}
    </code>
  );
}

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-label-caps text-label-caps text-on-surface-variant uppercase tracking-widest mt-stack-md mb-stack-sm">
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-body-sm text-body-sm font-semibold text-on-surface mt-stack-md mb-2">
      {children}
    </h3>
  );
}

function Pre({ children }: { children: React.ReactNode }) {
  return (
    <pre
      className="font-code-sm text-code-sm bg-surface-container-high border border-outline-variant rounded-md p-stack-sm overflow-x-auto my-stack-sm text-on-surface"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      {children}
    </pre>
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="border-l-[3px] border-primary bg-primary-container/40 px-stack-sm py-stack-sm rounded-md my-stack-md font-body-sm text-body-sm text-on-primary-container"
      style={{ boxShadow: "var(--shadow-sm)" }}
    >
      {children}
    </div>
  );
}

export default function ChatGPTGuide() {
  return (
    <main className="flex-grow px-container-margin max-w-3xl mx-auto w-full pt-4 md:pt-8 pb-stack-md">
      <p className="mb-stack-sm">
        <Link
          href="/docs"
          className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary uppercase tracking-widest"
        >
          ← DOCS
        </Link>
      </p>

      <header className="mb-stack-md border-b border-outline-variant pb-4 flex items-center justify-between">
        <h1 className="font-display text-display tracking-tight text-on-surface">
          🤖 CHATGPT
        </h1>
        <span className="font-code-sm text-code-sm text-on-surface-variant bg-surface-container px-3 py-1 rounded-full border border-outline-variant">
          mcp connector
        </span>
      </header>

      <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xl">
        Add Beeper to ChatGPT as a custom MCP connector. Five minutes, no code.
      </p>

      <H2>What you get</H2>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Beeper&apos;s host exposes a Streamable HTTP MCP server at{" "}
        <Code>/api/mcp/v1</Code>. Once added, you can:
      </p>
      <ul className="font-body-sm text-body-sm text-on-surface-variant list-disc pl-6 mt-2 space-y-1">
        <li>
          Send beeps with <Code>send_beep</Code>
        </li>
        <li>
          Check your inbox with <Code>list_open_beeps</Code>
        </li>
        <li>
          Reply with <Code>reply_beep</Code>
        </li>
        <li>
          Decline with <Code>decline_beep</Code>
        </li>
        <li>
          Silently close with <Code>acknowledge_beep</Code>
        </li>
      </ul>

      <H2>Requirements</H2>
      <ul className="font-body-sm text-body-sm text-on-surface-variant list-disc pl-6 space-y-1">
        <li>
          ChatGPT account on Plus, Pro, Business, Enterprise, or Edu (web only —
          not mobile).
        </li>
        <li>
          A Beeper user id and phone number registered on the host. Ask the
          admin (<Code>chinat</Code>) to add you.
        </li>
      </ul>

      <H2>Step 1 — Get registered on Beeper</H2>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Ask the host admin to register you and to seed the allowlist edges for
        anyone you want to beep (and anyone who&apos;ll beep you).
      </p>
      <Pre>{`# Admin: register a new user
curl -fsS -X POST "$BEEPER_API_URL/api/admin/users" \\
  -H "cookie: beeper_admin=$BEEPER_ADMIN_PASSWORD" \\
  -H 'content-type: application/json' \\
  -d '{
    "id": "alex",
    "phone": "+1XXXXXXXXXX",
    "display_name": "Alex",
    "channel_preference": "sms"
  }'

# Admin: allow alex to beep chinat (and vice versa)
curl -fsS -X POST "$BEEPER_API_URL/api/admin/allowlist" \\
  -H "cookie: beeper_admin=$BEEPER_ADMIN_PASSWORD" \\
  -H 'content-type: application/json' \\
  -d '{"owner_id":"chinat","sender_id":"alex"}'

curl -fsS -X POST "$BEEPER_API_URL/api/admin/allowlist" \\
  -H "cookie: beeper_admin=$BEEPER_ADMIN_PASSWORD" \\
  -H 'content-type: application/json' \\
  -d '{"owner_id":"alex","sender_id":"chinat"}'`}</Pre>

      <H2>Step 2 — Enable Developer Mode</H2>
      <ol className="font-body-sm text-body-sm text-on-surface-variant list-decimal pl-6 space-y-1">
        <li>Open ChatGPT on the web.</li>
        <li>
          Go to <strong>Settings → Apps → Advanced settings</strong>.
        </li>
        <li>
          Toggle <strong>Developer mode</strong> on.
        </li>
      </ol>

      <H2>Step 3 — Add Beeper as a connector</H2>
      <ol className="font-body-sm text-body-sm text-on-surface-variant list-decimal pl-6 space-y-1">
        <li>
          Go to <strong>Settings → Apps &amp; Connectors → Add new connector</strong>.
        </li>
        <li>Fill in:</li>
      </ol>
      <Pre>{`Name:            Beeper
Description:     Send and receive cross-Claude beeps
MCP Server URL:  https://beeper-v2-host.vercel.app/api/mcp/v1?user=<your-id>
Authentication:  None`}</Pre>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Replace <Code>&lt;your-id&gt;</Code> with the user id the admin gave
        you (e.g. <Code>alex</Code>).
      </p>

      <Callout>
        <strong>Treat the connector URL like a secret.</strong> Beeper uses the{" "}
        <Code>?user=</Code> query param as identity — anyone who sees the URL
        can post as you. Don&apos;t share it in shared workspaces, screenshots,
        or chats.
      </Callout>

      <H2>Step 4 — Use it in a conversation</H2>
      <ol className="font-body-sm text-body-sm text-on-surface-variant list-decimal pl-6 space-y-1">
        <li>Open a new chat.</li>
        <li>
          Click the <strong>+</strong> menu → <strong>Developer mode</strong> →
          enable Beeper.
        </li>
        <li>Try prompts like:</li>
      </ol>
      <ul className="font-body-sm text-body-sm text-on-surface-variant list-disc pl-6 mt-2 space-y-1 italic">
        <li>&quot;Check my beeps.&quot;</li>
        <li>
          &quot;Send a beep to chinat asking him for the latest Hopkins email.&quot;
        </li>
        <li>&quot;Reply to b_xxxx with &lsquo;yes, let&apos;s do Tuesday&rsquo;.&quot;</li>
        <li>&quot;Acknowledge b_xxxx silently.&quot;</li>
      </ul>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-stack-sm">
        ChatGPT surfaces the JSON payload for write actions and asks you to
        confirm before firing. Reads run without confirmation.
      </p>

      <H2>How auth works</H2>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Beeper has no API key. Identity is the <Code>?user=&lt;id&gt;</Code>{" "}
        query param on the MCP URL. The host reads that param, mints a signed
        session cookie internally, and uses it to call gated endpoints. Sending
        is gated by an <strong>allowlist</strong>: there must be an edge{" "}
        <Code>(owner=recipient, sender=you)</Code> for the recipient to accept
        your beep.
      </p>
      <p className="font-body-sm text-body-sm text-on-surface-variant mt-stack-sm">
        This is the same trust model as the Claude Code plugin, which sets{" "}
        <Code>BEEPER_USER</Code> as an env var.
      </p>

      <H2>Troubleshooting</H2>
      <H3>403 not_allowed</H3>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        You&apos;re not on the recipient&apos;s allowlist. Ask the admin to add
        the edge.
      </p>
      <H3>404 unknown_user</H3>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        The recipient id (or your own id) isn&apos;t registered. Check spelling
        against the canonical ids.
      </p>
      <H3>409 already_closed</H3>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        The beep was already replied to, declined, or acknowledged.
      </p>
      <H3>Write tools don&apos;t fire</H3>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Some ChatGPT plans (Plus / Pro) may surface published MCP connectors as
        read-only. Developer Mode is meant to allow write tools with per-call
        confirmation. Double-check Developer Mode is on and that you&apos;re
        using the connector inside a Developer mode chat session.
      </p>
      <H3>Mobile</H3>
      <p className="font-body-sm text-body-sm text-on-surface-variant">
        Custom MCP connectors are web-only as of 2026. Use ChatGPT in a browser
        for sends.
      </p>

      <H2>Alternatives</H2>
      <ul className="font-body-sm text-body-sm text-on-surface-variant list-disc pl-6 space-y-2">
        <li>
          <strong>SMS only.</strong> If you&apos;re registered with a phone
          number, you already get beeps as text messages. Replying via SMS
          routes through the existing Twilio webhook — no ChatGPT setup needed.
        </li>
        <li>
          <strong>Custom GPT with Actions.</strong> If Developer Mode isn&apos;t
          available, the same functionality can be wrapped as a Custom GPT with
          an OpenAPI schema over the REST API. Slightly more setup but works on
          standard Plus.
        </li>
        <li>
          <strong>Claude Code.</strong> Install{" "}
          <a
            href="https://github.com/edumame/beeper-v2"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            edumame/beeper-v2
          </a>{" "}
          as a plugin — slash commands handle auth and routing.
        </li>
      </ul>

      <p className="font-code-sm text-code-sm text-on-surface-variant mt-stack-md pt-stack-sm border-t border-outline-variant">
        Last updated: 2026-06-07
      </p>
    </main>
  );
}
