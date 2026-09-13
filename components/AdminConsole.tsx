"use client";

import { useEffect, useMemo, useState } from "react";

type LoreItem = { code: string; title: string; copy: string };
type FeaturedBroadcast = {
  title: string;
  subtitle: string;
  videoUrl: string;
  posterUrl: string;
  imageUrl: string;
  audioUrl: string;
};
type SiteData = {
  status: string;
  eyebrow: string;
  heroTitle: string;
  heroCopy: string;
  characterUrl: string;
  contractAddress: string;
  featuredBroadcast: FeaturedBroadcast;
  lore: LoreItem[];
  socials: { x: string; telegram: string };
};

const blank: SiteData = {
  status: "STILL EARLY",
  eyebrow: "",
  heroTitle: "",
  heroCopy: "",
  characterUrl: "",
  contractAddress: "",
  featuredBroadcast: {
    title: "",
    subtitle: "",
    videoUrl: "",
    posterUrl: "",
    imageUrl: "",
    audioUrl: "",
  },
  lore: [],
  socials: { x: "", telegram: "" },
};

export default function AdminConsole() {
  const [data, setData] = useState<SiteData>(blank);
  const [state, setState] = useState<"loading" | "ready" | "saving" | "saved" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/site", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error || "Could not load site data");
        return r.json();
      })
      .then((payload) => { setData(payload); setState("ready"); })
      .catch((error) => { setMessage(error.message); setState("error"); });
  }, []);

  const dirtyLabel = useMemo(() => state === "saving" ? "SAVING…" : state === "saved" ? "SAVED" : "SAVE CHANGES", [state]);
  const broadcast = data.featuredBroadcast;
  const broadcastMode = broadcast.videoUrl
    ? "VIDEO FIRST"
    : broadcast.imageUrl && broadcast.audioUrl
      ? "IMAGE + AUDIO FALLBACK"
      : broadcast.audioUrl
        ? "CHARACTER/POSTER + AUDIO"
        : broadcast.imageUrl || broadcast.posterUrl
          ? "VISUAL ONLY"
          : "WAITING FOR MEDIA";
  const previewImage = broadcast.imageUrl || broadcast.posterUrl || data.characterUrl;

  function field<K extends keyof SiteData>(key: K, value: SiteData[K]) {
    setData((current) => ({ ...current, [key]: value }));
    if (state === "saved") setState("ready");
  }

  function broadcastField<K extends keyof FeaturedBroadcast>(key: K, value: FeaturedBroadcast[K]) {
    field("featuredBroadcast", { ...data.featuredBroadcast, [key]: value });
  }

  async function save() {
    setState("saving"); setMessage("");
    try {
      const response = await fetch("/api/site", { method: "PUT", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Save failed");
      setData(result); setState("saved");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed");
      setState("error");
    }
  }

  function updateLore(index: number, key: keyof LoreItem, value: string) {
    const lore = [...data.lore];
    lore[index] = { ...lore[index], [key]: value };
    field("lore", lore);
  }

  if (state === "loading") return <div className="center">OPENING ROYAL FILE…</div>;

  return (
    <main>
      <header>
        <div><b>NEBUCHADREKTZAR</b><span>// ADMIN DESK</span></div>
        <button onClick={save} disabled={state === "saving" || (state === "error" && !data.heroTitle)}>{dirtyLabel}</button>
      </header>
      <section className="intro">
        <p>ROYAL CONTENT CONTROL</p>
        <h1>KEEP THE JOKE SHARP.<br />CHANGE THE CONTENT, NOT THE CODE.</h1>
        {message && <div className="alert">{message}</div>}
      </section>

      <div className="grid">
        <section className="panel wide">
          <div className="panel-title"><span>01</span><b>HOW HE ENTERS THE ROOM</b></div>
          <label>STATE<input value={data.status} onChange={(e) => field("status", e.target.value)} /></label>
          <label>EYEBROW<input value={data.eyebrow} onChange={(e) => field("eyebrow", e.target.value)} /></label>
          <label>DEFAULT HEADLINE<textarea rows={2} value={data.heroTitle} onChange={(e) => field("heroTitle", e.target.value)} /></label>
          <label>ONE-LINER<textarea rows={3} value={data.heroCopy} onChange={(e) => field("heroCopy", e.target.value)} /></label>
          <div className="hint">Public rule: NEBU speaks for himself. Do not explain the Bible reference, his biography or why the joke works.</div>
        </section>

        <section className="panel">
          <div className="panel-title"><span>02</span><b>THE KING</b></div>
          <label>NEBUFILES CHARACTER / LOGO URL<input placeholder="https://..." value={data.characterUrl} onChange={(e) => field("characterUrl", e.target.value)} /></label>
          <div className="hint">Use the approved Fallen King identity. His face and character stay consistent across the site, covers and future videos.</div>
        </section>

        <section className="panel broadcast-panel">
          <div className="panel-title"><span>03</span><b>NEW MASTERPIECE</b></div>
          <div className="mode-line"><span>PUBLIC MODE</span><strong>{broadcastMode}</strong></div>
          <label>TRACK / BROADCAST TITLE<input value={broadcast.title} onChange={(e) => broadcastField("title", e.target.value)} /></label>
          <label>NEBU'S INTRO LINE<input value={broadcast.subtitle} onChange={(e) => broadcastField("subtitle", e.target.value)} /></label>
          <label>NEBUFILES VIDEO URL — PREFERRED<input placeholder="https://...mp4" value={broadcast.videoUrl} onChange={(e) => broadcastField("videoUrl", e.target.value)} /></label>
          <label>VIDEO POSTER URL<input placeholder="https://...jpg" value={broadcast.posterUrl} onChange={(e) => broadcastField("posterUrl", e.target.value)} /></label>
          <label>FEATURE IMAGE URL<input placeholder="https://...jpg" value={broadcast.imageUrl} onChange={(e) => broadcastField("imageUrl", e.target.value)} /></label>
          <label>AUDIO URL<input placeholder="https://...mp3" value={broadcast.audioUrl} onChange={(e) => broadcastField("audioUrl", e.target.value)} /></label>
          <div className="hint">The public page treats music like something NEBU made and is forcing everybody to appreciate — not like a generic embedded streaming card.</div>

          <div className="admin-preview">
            <div className="preview-head"><span>PREVIEW</span><small>{broadcastMode}</small></div>
            {broadcast.videoUrl ? (
              <video key={broadcast.videoUrl} src={broadcast.videoUrl} poster={broadcast.posterUrl || previewImage || undefined} controls playsInline preload="metadata" />
            ) : previewImage ? (
              <img src={previewImage} alt="Featured broadcast preview" />
            ) : (
              <div className="preview-empty">NO BROADCAST MEDIA YET</div>
            )}
          </div>
        </section>

        <section className="panel wide">
          <div className="panel-title"><span>04</span><b>OLDER MASTERPIECES</b></div>
          <div className="hint">These become the older-record rows under the current release. Keep each description short and in NEBU's voice.</div>
          <div className="lore-editor">
            {data.lore.map((item, i) => (
              <div className="lore-item" key={i}>
                <label>LABEL<input value={item.code} onChange={(e) => updateLore(i, "code", e.target.value)} /></label>
                <label>TRACK TITLE<input value={item.title} onChange={(e) => updateLore(i, "title", e.target.value)} /></label>
                <label>NEBU'S COMMENT<textarea rows={4} value={item.copy} onChange={(e) => updateLore(i, "copy", e.target.value)} /></label>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <div className="panel-title"><span>05</span><b>SUPPORT THE ARTS</b></div>
          <label>CONTRACT ADDRESS<input value={data.contractAddress} onChange={(e) => field("contractAddress", e.target.value)} /></label>
          <div className="hint">Token stays secondary. The joke is that the handlers added fundraising while NEBU continues behaving like a wealthy king.</div>
        </section>

        <section className="panel">
          <div className="panel-title"><span>06</span><b>WHERE HE YELLS ONLINE</b></div>
          <label>X URL<input value={data.socials.x} onChange={(e) => field("socials", { ...data.socials, x: e.target.value })} /></label>
          <label>TELEGRAM URL<input value={data.socials.telegram} onChange={(e) => field("socials", { ...data.socials, telegram: e.target.value })} /></label>
        </section>
      </div>
    </main>
  );
}
