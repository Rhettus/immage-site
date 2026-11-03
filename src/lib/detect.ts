// Runs in the browser. Works out the visitor's platform so the page can
// point them at the right download. Everything that uses it falls back to
// the download cards when the answer is unknown.
export type OS = "macos" | "windows" | "linux";
export type Arch = "x64" | "arm64";
export interface Platform {
  os?: OS;
  arch?: Arch;
}

interface UAData {
  platform?: string;
  getHighEntropyValues?(hints: string[]): Promise<{ architecture?: string; bitness?: string }>;
}

export async function detectPlatform(): Promise<Platform> {
  const ua = navigator.userAgent;
  // Phones and tablets can't run Immage; iPads also claim to be Macs.
  if (/Android|iPhone|iPad|CrOS/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1)) return {};

  const data = (navigator as Navigator & { userAgentData?: UAData }).userAgentData;
  let os: OS | undefined;
  // The user agent still names the OS in every current browser; client
  // hints are the fallback.
  for (const platform of [ua, data?.platform ?? ""]) {
    if (/Macintosh|Mac OS X|macOS/i.test(platform)) os = "macos";
    else if (/Windows/i.test(platform)) os = "windows";
    else if (/Linux|X11/i.test(platform)) os = "linux";
    if (os) break;
  }

  // Only Linux has builds per architecture. Chromium reports it through
  // client hints; Firefox puts it in the user agent.
  let arch: Arch | undefined;
  if (os === "linux") {
    try {
      const hints = await data?.getHighEntropyValues?.(["architecture"]);
      if (hints?.architecture) arch = hints.architecture === "arm" ? "arm64" : "x64";
    } catch {
      // not available: fall through to the user agent
    }
    if (!arch && /aarch64|arm64/i.test(ua)) arch = "arm64";
    else if (!arch && /x86_64|x86-64|amd64/i.test(ua)) arch = "x64";
  }
  return { os, arch };
}
