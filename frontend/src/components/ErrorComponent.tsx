import ErrorIconComponent from "@mui/icons-material/ErrorOutline";
import { Alert, AlertTitle } from "@mui/material";

export default function ErrorComponent() {
  return (
    <Alert severity="error" icon={<ErrorIconComponent fontSize="inherit" />}>
      <AlertTitle>エラー</AlertTitle>
      必要なデータがありません。管理者に問い合わせください。
    </Alert>
  );
}
