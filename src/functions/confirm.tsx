import { ConfirmModal, showModal } from "@decky/ui";

export default function confirm(text: string, action: string): Promise<boolean> {
  return new Promise((resolve) => {
    showModal(
      <ConfirmModal
        strTitle="Achievements Manager"
        strDescription={text}
        strOKButtonText={action}
        onOK={() => resolve(true)}
        onCancel={() => resolve(false)}
      />,
    );
  });
}
