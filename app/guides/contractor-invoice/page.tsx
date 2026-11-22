import GuidePage from "@/components/content/GuidePage";
import { guides } from "@/data/guides";

export default function Page() {
  return <GuidePage content={guides.contractor} />;
}
