import { useState } from "react";
import { Camera } from "lucide-react";
import Button from "@/components/UI/Button/Button";
import Chip from "@/components/UI/Chip/Chip";
import { initials } from "@/utils/text";
import styles from "./Settings.module.scss";

interface SettingsHeaderProps {
  name: string;
  email?: string;
  role: string;
  avatarUrl?: string;
  /** Submits the form with this id, so the button can live outside it. */
  formId: string;
  saving: boolean;
}

/** Who is signed in, with the photo picker and the one save button for the whole page. */
const SettingsHeader = ({ name, email, role, avatarUrl, formId, saving }: SettingsHeaderProps) => {
  const [preview, setPreview] = useState(avatarUrl);

  // Preview only — uploading needs the Storage endpoint, which does not exist yet.
  const onPick = (file?: File) => {
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <header className={styles.header}>
      <div className={styles.identity}>
        <label className={styles.avatar} title="Cambiar foto">
          {preview ? <img src={preview} alt="" /> : <span aria-hidden="true">{initials(name)}</span>}
          <span className={styles.avatarOverlay}>
            <Camera size={18} strokeWidth={1.7} aria-hidden="true" />
          </span>
          <input type="file" accept="image/*" aria-label="Cambiar foto de perfil" onChange={(e) => onPick(e.target.files?.[0])} />
        </label>

        <div className={styles.identityText}>
          <div className={styles.nameRow}>
            <h2>{name}</h2>
            <Chip size="small">{role}</Chip>
          </div>
          {email ? <p>{email}</p> : null}
        </div>
      </div>

      <Button type="submit" form={formId} loading={saving}>
        {saving ? "Guardando..." : "Guardar cambios"}
      </Button>
    </header>
  );
};

export default SettingsHeader;
