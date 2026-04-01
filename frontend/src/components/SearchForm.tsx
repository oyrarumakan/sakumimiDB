import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Card,
  Grid2,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ListSubheader,
  TextField,
} from "@mui/material";
import type { SearchConditions } from "@/types/search";
import type { GroupedMembers } from "./SearchContainer";

interface SearchFormProps {
  conditions: SearchConditions;
  onConditionChange: (key: keyof SearchConditions, value: string) => void;
  availableMembers: GroupedMembers[];
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

      <Grid2 container spacing={2}>
        {/* メンバー1 */}
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="member1-label" shrink>メンバー 1</InputLabel>
            <Select
              labelId="member1-label"
              id="member1-select"
              value={conditions.member1}
              label="メンバー 1"
              onChange={(e) => onConditionChange("member1", e.target.value)}
              displayEmpty
              renderValue={(value) => value || "すべて"}
            >
              <MenuItem value="">すべて</MenuItem>
              {availableMembers.flatMap((g) => {
                const filteredMembers = g.members.filter((m) => m !== conditions.member2);
                if (filteredMembers.length === 0) return [];
                return [
                  <ListSubheader key={`g1-${g.group}`}>{g.group}</ListSubheader>,
                  ...filteredMembers.map((m) => (
                    <MenuItem key={`m1-${m}`} value={m}>
                      {m}
                    </MenuItem>
                  ))
                ];
              })}
            </Select>
          </FormControl>
        </Grid2>

        {/* メンバー2 */}
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth disabled={!conditions.member1}>
            <InputLabel id="member2-label" shrink>メンバー 2 (AND)</InputLabel>
            <Select
              labelId="member2-label"
              id="member2-select"
              value={conditions.member2}
              label="メンバー 2 (AND)"
              onChange={(e) => onConditionChange("member2", e.target.value)}
              displayEmpty
              renderValue={(value) => value || "すべて"}
            >
              <MenuItem value="">すべて</MenuItem>
              {availableMembers.flatMap((g) => {
                const filteredMembers = g.members.filter((m) => m !== conditions.member1);
                if (filteredMembers.length === 0) return [];
                return [
                  <ListSubheader key={`g2-${g.group}`}>{g.group}</ListSubheader>,
                  ...filteredMembers.map((m) => (
                    <MenuItem key={`m2-${m}`} value={m}>
                      {m}
                    </MenuItem>
                  ))
                ];
              })}
            </Select>
          </FormControl>
        </Grid2>

        {/* エピソード */}
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="episode-label" shrink>エピソード番号</InputLabel>
            <Select
              labelId="episode-label"
              id="episode-select"
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
        </Grid2>

        {/* 配信年 */}
        <Grid2 size={{ xs: 12, sm: 6, md: 3 }}>
          <FormControl fullWidth>
            <InputLabel id="year-label" shrink>配信年</InputLabel>
            <Select
              labelId="year-label"
              id="year-select"
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
        </Grid2>

        {/* フリーワード */}
        <Grid2 size={{ xs: 12, md: 12 }}>
          <TextField
            fullWidth
            id="caption-search"
            label="フリーワード"
            value={conditions.caption}
            onChange={(e) => onConditionChange("caption", e.target.value)}
            placeholder="フリー検索"
          />
        </Grid2>
      </Grid2>

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
