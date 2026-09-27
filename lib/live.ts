import { whatsAppHref } from "@/data/site";
import type { Content } from "./content-types";

export type LiveContent = Content & {
  communityJoinHref: string;
};

export function withDerived(content: Content): LiveContent {
  const first = content.coordinators[0];
  return {
    ...content,
    communityJoinHref: first
      ? whatsAppHref(first.whatsapp, content.site.communityJoinMessage)
      : "https://wa.me/",
  };
}
