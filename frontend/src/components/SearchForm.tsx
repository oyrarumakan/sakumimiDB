import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Card,
  Grid,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import type { SearchConditions } from "@/types/search";

interface SearchFormProps {
  conditions: SearchConditions;
  onConditionChange: (key: keyof SearchConditions, value: string) => void;
  availableMembers: string[];
  availableEpisodes: string[];
  availableYears: string[];
  onClear: () => void;
}

export default function SearchForm({
  conditions,
  onConditionChange,
  availableMembers,
  availableEpisodes,
  availableYears,
  onClear,
}: SearchFormProps) {
  return (
    <Card sx={{ p: 3, my: 4, backgroundColor: "background.paper" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <SearchIcon sx={{ mr: 1, color: "primary.main" }} />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          検索条件
        </Typography>
      </Box>

      <Grid container spacing={2}>
        {/* メンバー1 */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel shrink>メンバー 1</InputLabel>
            <Select
              value={conditions.member1}
              label="メンバー 1"
              onChange={(e) => onConditionChange("member1", e.target.value)}
              displayEmpty
              renderValue={(value) => value || "すべて"}
            >
              <MenuItem value="">すべて</MenuItem>
              {availableMembers.map((m) => (
                <MenuItem key={`m1-${m}`} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* メンバー2 */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel shrink>メンバー 2 (AND)</InputLabel>
            <Select
              value={conditions.member2}
              label="メンバー 2 (AND)"
              onChange={(e) => onConditionChange("member2", e.target.value)}
              displayEmpty
              renderValue={(value) => value || "すべて"}
            >
              <MenuItem value="">すべて</MenuItem>
              {availableMembers
                .filter((m) => m !== conditions.member1)
                .map((m) => (
                  <MenuItem key={`m2-${m}`} value={m}>
                    {m}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>

        {/* エピソード */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel shrink>エピソード番号</InputLabel>
            <Select
              value={conditions.episode}
              label="エピソード番号"
              onChange={(e) => onConditionChange("episode", e.target.value)}
              displayEmpty
              renderValue={(value) => value || "すべて"}
            >
              <MenuItem value="">すべて</MenuItem>
              {availableEpisodes.map((ep) => (
                <MenuItem key={ep} value={ep}>
                  {ep}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        {/* 配信年 */}
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel shrink>配信年</InputLabel>
            <Select
              value={conditions.year}
              label="配信年"
              onChange={(e) => onConditionChange("year", e.target.value)}
              displayEmpty
              renderValue={(value) => value || "すべて"}
            >
              <MenuItem value="">すべて</MenuItem>
              {availableYears.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
        <Button
          onClick={onClear}
          variant="outlined"
          startIcon={<ClearIcon />}
          sx={{ textTransform: "none" }}
        >
          検索結果をクリアする
        </Button>
      </Box>
    </Card>
  );
}
