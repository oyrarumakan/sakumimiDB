import Headphones from "@mui/icons-material/Headphones";
import {
  Box,
  Card,
  Chip,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import type { Episode } from "@/types/episode";

interface EpisodeListProps {
  episodes: Episode[];
}

export default function EpisodeList({ episodes }: EpisodeListProps) {
  if (episodes.length === 0) {
    return (
      <Card
        sx={{
          py: 6,
          textAlign: "center",
          backgroundColor: "action.hover",
          color: "text.secondary",
        }}
      >
        <Typography>該当するエピソードが見つかりませんでした。</Typography>
      </Card>
    );
  }

  return (
    <Stack spacing={2}>
      {episodes.map((ep) => (
        <Card
          key={ep.episode}
          sx={{
            p: 3,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            gap: 2,
            transition: "box-shadow 0.3s ease-in-out",
            "&:hover": {
              boxShadow: (theme) =>
                `0 4px 8px ${theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.7)" : "rgba(0, 0, 0, 0.15)"}`,
            },
          }}
        >
          <Box sx={{ flex: 1 }}>
            {/* Episode badge and date */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
              <Chip
                label={ep.episode}
                sx={{
                  backgroundColor: "primary.main",
                  color: "common.white",
                  fontWeight: "bold",
                }}
              />
              <Typography variant="body2" sx={{ color: "text.secondary" }}>
                {ep.date}
              </Typography>
            </Box>

            {/* Members */}
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
              {Array.from(new Set(ep.members)).map((member, index) => (
                <Chip
                  key={`${member}-${index}`}
                  label={member}
                  size="small"
                  variant="outlined"
                />
              ))}
            </Box>

            {/* Caption */}
            <Typography
              variant="body2"
              sx={{
                color: "text.primary",
                lineHeight: 1.6,
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                mb: { xs: 2, md: 0 },
              }}
            >
              {ep.caption}
            </Typography>
          </Box>

          {/* Link button */}
          <Box sx={{ flexShrink: 0 }}>
            <Button
              href={ep.url}
              target="_blank"
              rel="noopener noreferrer"
              variant="contained"
              color="primary"
              startIcon={<Headphones />}
              sx={{
                whiteSpace: "nowrap",
                width: { xs: "100%", md: "auto" },
                textTransform: "none",
              }}
            >
              聴く
            </Button>
          </Box>
        </Card>
      ))}
    </Stack>
  );
}
