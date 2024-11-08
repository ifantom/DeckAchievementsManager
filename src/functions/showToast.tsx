import { toaster } from "@decky/api";
import { FaTrophy } from "react-icons/fa";

export function showToast(text: string) {
  toaster.toast({
    title: "Achievement Manager",
    body: text,
    logo: (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <FaTrophy size={22} />
      </div>
    ),
    expiration: 1,
  });
}
