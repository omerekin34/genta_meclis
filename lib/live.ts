import { whatsAppHref } from "@/data/site";
import type { Content } from "./content-types";

export type LiveContent = Content & {
  communityJoinHref: string;
};

function asHttpUrl(value: string) {
  const raw = value.trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

export function withDerived(content: Content): LiveContent {
  const first = content.coordinators[0];
  const fallback = first ? whatsAppHref(first.whatsapp, content.site.communityJoinMessage) : "https://wa.me/";
  return {
    ...content,
    communityJoinHref: asHttpUrl(content.site.communityJoinUrl) || fallback,
  };
}
