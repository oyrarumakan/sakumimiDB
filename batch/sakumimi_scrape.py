import datetime
import json
import os
import time
from pathlib import Path
from typing import Optional
from urllib.parse import urlsplit, urlunsplit

from selenium.common.exceptions import TimeoutException, WebDriverException
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options as ChromeOptions
from selenium.webdriver.chrome.webdriver import WebDriver as ChromeDriver
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

# 遷移先のURLとUAの設定
SAKUMIMI_TOP_URL = "https://sakurazaka46.com/s/s46/diary/radio?ima=0000"
USER_AGENT = (
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
    "(KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36"
)
WAIT_SECONDS = 10
RETRY_COUNT = 3
RETRY_WAIT_SECONDS = 1
EPISODE_DATA_PATH = Path(__file__).resolve().parents[1] / "data" / "episode_data.json"
MEMBER_DATA_PATH = Path(__file__).resolve().parents[1] / "frontend" / "src" / "data" / "members.json"

KEYAMIMI_TOP_LIST = (By.ID, "keyamimiTopList")

# ロケータの定義
## エピソード情報のセレクタ
LATEST_EPISODE_EPISODE_SELECTOR = (
    By.CSS_SELECTOR,
    "#keyamimiTopList > li:nth-child(1) > .sakumimi-list-head > p.ttl > span",
)
LATEST_EPISODE_DATE_SELECTOR = (
    By.CSS_SELECTOR,
    "#keyamimiTopList > li:nth-child(1) > .sakumimi-list-head > .date",
)
LATEST_EPISODE_CAPTION_SELECTOR = (
    By.CSS_SELECTOR,
    "#keyamimiTopList > li:nth-child(1) > .sakumimi-list-body > .caption",
)
PREVIOUS_EPISODE_LINKS_SELECTOR = (
    By.CSS_SELECTOR,
    "#fcweb_radio_detail > main > div.btn-wrap > div > p.btn-type1s.wf-a.rev.pos-left > a",
)

## ログイン画面のセレクタ
LOGIN_BUTTON_XPATH = (By.XPATH, "/html/body/div/div/div/form/button")
LOGIN_EMAIL_INPUT_XPATH = (By.XPATH, '//*[@id="form"]/div[1]/div/input')
LOGIN_PASSWORD_INPUT_XPATH = (By.XPATH, '//*[@id="form"]/div[2]/div/input')
LOGIN_SUBMIT_BUTTON_ID = (By.ID, "SaveAccount")

RETURN_PAGE_BUTTON_ID = (By.ID, "prevPageBtn")
SAKUMIMI_DETAIL_SELECTOR = (By.CSS_SELECTOR, "body > main > div.sakumimi_detail")
MORE_BUTTON_SELECTOR = (By.CSS_SELECTOR, "p.btn-type3 > a")
INDI_TAGS_SELECTOR = (
    By.CSS_SELECTOR,
    "body > main > div.filterwrp.filterwrp_pc > div.indi-tags > p",
)
NEWEST_EPISODE_LINK_SELECTOR = (
    By.CSS_SELECTOR,
    "body > main > ul > li:nth-child(1) > div > div > a:nth-child(3)",
)

# リンクが違うエピソードとその正しいリンクのマッピング
WRONG_LINK_URL_MAP = {
    "https://sakurazaka46.com/s/s46/diary/detail/61288?ima=0000&cd=radio": (
        "https://sakurazaka46.com/s/s46/diary/detail/61260?ima=0000&cd=radio"
    ),
}


def build_driver() -> WebDriver:
    """Chromeドライバを生成する。"""
    options = ChromeOptions()
    options.add_argument(f"user-agent={USER_AGENT}")
    options.add_argument("--headless=new")
    driver = ChromeDriver(options=options)
    return driver


def wait_for(driver: WebDriver, locator: tuple[str, str]) -> None:
    """指定した要素がDOM上に現れるまで待機する。"""
    WebDriverWait(driver, WAIT_SECONDS).until(EC.presence_of_element_located(locator))

def navigate_to(driver: WebDriver, url: str) -> None:
    """URL遷移を実行し、読み込み完了まで待機する。"""
    driver.get(url)
    wait_for_page_ready(driver)

def wait_for_page_ready(driver: WebDriver) -> None:
    """ページ遷移後にdocument.readyStateがcompleteになるまで待機する。"""
    WebDriverWait(driver, WAIT_SECONDS).until(
        lambda d: d.execute_script("return document.readyState") == "complete"
    )

def get_required_env(name: str) -> str:
    """必須環境変数を取得し、未設定なら例外を送出する。"""
    value = os.getenv(name)
    if not value:
        raise RuntimeError(f"環境変数 {name} を設定してください")
    return value


def load_existing_data(path: Path) -> list[dict]:
    """既存のエピソードJSONを読み込み、配列として返す。"""
    if not path.exists():
        return []

    with path.open("r", encoding="utf-8") as f:
        data = json.load(f)

    if not isinstance(data, list):
        raise ValueError("episode_data.json は配列形式である必要があります")

    return data


def load_member_names(path: Path) -> list[str]:
    """members.jsonからメンバー名一覧を読み込む。"""
    with path.open("r", encoding="utf-8") as f:
        members_data = json.load(f)

    if not isinstance(members_data, dict):
        raise ValueError("members.json はオブジェクト形式である必要があります")

    names: list[str] = []
    for _, value in members_data.items():
        if isinstance(value, dict):
            name = value.get("name")
            if isinstance(name, str) and name:
                names.append(name)

    # 部分一致時の誤判定を避けるため長い名前を優先する
    return sorted(set(names), key=len, reverse=True)


def infer_members_from_caption(caption: str, member_names: list[str]) -> list[str]:
    """caption本文に含まれるメンバー名を推定して返す。"""
    inferred: list[str] = []
    for name in member_names:
        if name in caption:
            inferred.append(name)
    return inferred


def normalize_episode_url(url: str) -> str:
    """エピソードURLからクエリパラメータとフラグメントを除去する。"""
    parsed = urlsplit(url)
    return urlunsplit((parsed.scheme, parsed.netloc, parsed.path, "", ""))


def save_data(path: Path, episodes: list[dict]) -> None:
    """エピソード一覧を整形済みJSONとして保存する。"""
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as f:
        json.dump(episodes, f, ensure_ascii=False, indent=2)
        f.write("\n")


def retry(operation_name: str, func):
    """一時的な失敗に備えて処理をリトライ実行する。"""
    last_error: Optional[Exception] = None
    for attempt in range(1, RETRY_COUNT + 1):
        try:
            return func()
        except (TimeoutException, WebDriverException) as e:
            last_error = e
            if attempt == RETRY_COUNT:
                break
            print(
                f"{operation_name} に失敗しました。{attempt}/{RETRY_COUNT} 回目をリトライします: {e}"
            )
            time.sleep(RETRY_WAIT_SECONDS)

    raise RuntimeError(f"{operation_name} が {RETRY_COUNT} 回失敗しました") from last_error


def click_with_fallback_js(driver: WebDriver, locator: tuple[str, str]) -> None:
    """通常クリックが遮られた場合にJavaScriptクリックへフォールバックする。"""
    element = WebDriverWait(driver, WAIT_SECONDS).until(EC.presence_of_element_located(locator))
    try:
        WebDriverWait(driver, WAIT_SECONDS).until(EC.element_to_be_clickable(locator)).click()
    except WebDriverException:
        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
        driver.execute_script("arguments[0].click();", element)


def extract_current_episode(driver: WebDriver, member_names: list[str]) -> dict:
    """現在表示中のページから1件分のエピソード情報を抽出する。"""
    url = normalize_episode_url(driver.current_url)
    episode = retry(
        "最新エピソード番号の取得",
        lambda: driver.find_element(*LATEST_EPISODE_EPISODE_SELECTOR).text,
    )
    date_section = retry(
        "最新エピソード日付の取得",
        lambda: driver.find_element(*LATEST_EPISODE_DATE_SELECTOR).text,
    )
    date_part = date_section.split(" ")[0]
    # 日付のフォーマット変更時に備えて、警告を表示して元の文字列を返すようにする
    try:
        date = datetime.datetime.strptime(date_part, "%Y.%m.%d").strftime("%Y/%m/%d")
    except ValueError:
        print(f"⚠️警告: 日付フォーマットが想定外です⚠️: {date_part}")
        date = date_part

    caption = retry(
        "最新エピソードキャプションの取得",
        lambda: driver.find_element(*LATEST_EPISODE_CAPTION_SELECTOR).text,
    )
    members = infer_members_from_caption(caption, member_names)
    return {
        "url": url,
        "date": date,
        "episode": episode,
        "caption": caption,
        "members": members,
    }


def move_to_previous_episode(driver: WebDriver) -> None:
    """前回エピソードへ遷移し、必要に応じて既知の誤リンクを補正する。"""
    old_url = driver.current_url

    retry(
        "前回エピソードリンクのクリック",
        lambda: click_with_fallback_js(driver, PREVIOUS_EPISODE_LINKS_SELECTOR),
    )

    # Wait for URL to change
    def wait_for_url_change():
        WebDriverWait(driver, WAIT_SECONDS).until(lambda d: d.current_url != old_url)

    retry("URL変更の待機", wait_for_url_change)

    # Check if we landed on a wrong link and redirect if needed
    current_url = driver.current_url
    redirect_url = WRONG_LINK_URL_MAP.get(current_url)
    if redirect_url:
        retry("誤リンク補正のページ遷移", lambda: navigate_to(driver, redirect_url))
    else:
        wait_for_page_ready(driver)

    retry("前回エピソード画面の待機", lambda: wait_for(driver, KEYAMIMI_TOP_LIST))


def iterate_episode_pages(driver: WebDriver):
    """現在ページから過去回へ1件ずつ辿るための共通イテレータ。"""
    while True:
        yield

        previous_episode_links = retry(
            "前回エピソードリンクの検索",
            lambda: driver.find_elements(*PREVIOUS_EPISODE_LINKS_SELECTOR),
        )
        if not previous_episode_links:
            break

        move_to_previous_episode(driver)


def collect_episodes(driver: WebDriver, member_names: list[str]) -> list[dict]:
    """最新回から過去回へ辿り、取得可能な全エピソードを収集する。"""
    episodes: list[dict] = []
    for _ in iterate_episode_pages(driver):
        episodes.append(extract_current_episode(driver, member_names))

    return episodes


def parse_episode_number(episode: str) -> Optional[int]:
    """'#123' のようなepisode文字列から数値部分を取り出す。"""
    normalized = str(episode).strip().replace("#", "")
    if normalized.isdigit():
        return int(normalized)
    return None


def get_latest_existing_episode(existing: list[dict]) -> Optional[str]:
    """既存データから最大episode番号のラベル(例: '#560')を返す。"""
    latest_label: Optional[str] = None
    latest_number = -1

    for row in existing:
        episode = row.get("episode")
        if not isinstance(episode, str) or not episode:
            continue

        episode_number = parse_episode_number(episode)
        if episode_number is None:
            continue

        if episode_number > latest_number:
            latest_number = episode_number
            latest_label = episode

    return latest_label


def get_episode_labels(rows: list[dict]) -> set[str]:
    """episodeラベル集合を返す。追加件数算出に利用する。"""
    labels: set[str] = set()
    for row in rows:
        episode = row.get("episode")
        if isinstance(episode, str) and episode:
            labels.add(episode)
    return labels


def collect_new_episodes(
    driver: WebDriver,
    latest_existing_episode: Optional[str],
    member_names: list[str],
) -> list[dict]:
    """既存最新回に到達するまで、新規エピソードのみを収集する。"""
    new_episodes: list[dict] = []
    latest_existing_number: Optional[int] = None
    if latest_existing_episode:
        latest_existing_number = parse_episode_number(latest_existing_episode)

    for _ in iterate_episode_pages(driver):
        current_episode = extract_current_episode(driver, member_names)
        current_label = str(current_episode.get("episode", ""))
        current_number = parse_episode_number(current_label)

        if latest_existing_episode and current_label == latest_existing_episode:
            break

        if (
            latest_existing_number is not None
            and current_number is not None
            and current_number <= latest_existing_number
        ):
            break

        new_episodes.append(current_episode)

    return new_episodes


def merge_by_episode(existing: list[dict], fetched: list[dict]) -> list[dict]:
    """episode番号で重複排除し、同一番号は既存データを優先して保持する。"""
    merged: dict[str, dict] = {}

    for row in existing:
        episode = row.get("episode")
        if isinstance(episode, str) and episode:
            merged[episode] = row

    for row in fetched:
        episode = row.get("episode")
        if isinstance(episode, str) and episode and episode not in merged:
            merged[episode] = row

    # #123 の数値部分で降順ソート
    def safe_episode_key(row: dict) -> int:
        episode = row.get("episode")
        if not isinstance(episode, str):
            return 0
        episode_number = parse_episode_number(episode)
        return episode_number if episode_number is not None else 0

    return sorted(
        merged.values(),
        key=safe_episode_key,
        reverse=True,
    )


def login(driver: WebDriver, email: str, password: str) -> None:
    """ログインフォームを開き、認証情報を入力してログインする。"""
    login_button = retry(
        "ログインボタンの取得",
        lambda: driver.find_element(*LOGIN_BUTTON_XPATH),
    )
    retry("ログインボタンのクリック", login_button.click)

    retry(
        "メールアドレス入力",
        lambda: WebDriverWait(driver, WAIT_SECONDS)
        .until(EC.element_to_be_clickable(LOGIN_EMAIL_INPUT_XPATH))
        .send_keys(email),
    )

    retry(
        "パスワード入力",
        lambda: WebDriverWait(driver, WAIT_SECONDS)
        .until(EC.element_to_be_clickable(LOGIN_PASSWORD_INPUT_XPATH))
        .send_keys(password),
    )

    login_submit_button = retry(
        "ログイン送信ボタンの取得",
        lambda: driver.find_element(*LOGIN_SUBMIT_BUTTON_ID),
    )
    retry("ログイン送信ボタンのクリック", login_submit_button.click)
    retry("ログイン後画面の読み込み待機", lambda: wait_for(driver, RETURN_PAGE_BUTTON_ID))


def open_latest_episode_page(driver: WebDriver) -> None:
    """詳細画面から一覧へ遷移し、最新回の詳細ページを開く。"""
    retry(
        "元のページに戻るボタンのクリック",
        lambda: click_with_fallback_js(driver, RETURN_PAGE_BUTTON_ID),
    )
    retry("さくみみ詳細画面の待機", lambda: wait_for(driver, SAKUMIMI_DETAIL_SELECTOR))

    retry("一覧ボタンのクリック", lambda: click_with_fallback_js(driver, MORE_BUTTON_SELECTOR))
    retry("フィルタ表示の待機", lambda: wait_for(driver, INDI_TAGS_SELECTOR))

    retry(
        "最新回リンクのクリック",
        lambda: click_with_fallback_js(driver, NEWEST_EPISODE_LINK_SELECTOR),
    )
    retry("最新回詳細画面の待機", lambda: wait_for(driver, KEYAMIMI_TOP_LIST))


def main() -> None:
    """スクレイピング全体を実行し、重複排除後のデータを保存する。"""
    email = get_required_env("SAKUMIMI_EMAIL")
    password = get_required_env("SAKUMIMI_PASSWORD")
    member_names = load_member_names(MEMBER_DATA_PATH)
    existing = load_existing_data(EPISODE_DATA_PATH)
    latest_existing_episode = get_latest_existing_episode(existing)
    existing_labels = get_episode_labels(existing)

    driver = build_driver()
    try:
        driver.set_window_size(1920, 1080)
        navigate_to(driver, SAKUMIMI_TOP_URL)
        login(driver, email, password)
        open_latest_episode_page(driver)

        fetched = collect_new_episodes(driver, latest_existing_episode, member_names)
        if not fetched:
            print(f"Start latest episode: {latest_existing_episode or 'N/A'}")
            print(f"End latest episode: {latest_existing_episode or 'N/A'}")
            print("Added new episodes: 0")
            print("No new episodes found. Skip saving.")
            return

        merged = merge_by_episode(existing, fetched)
        merged_labels = get_episode_labels(merged)
        added_count = len(merged_labels - existing_labels)
        latest_merged_episode = get_latest_existing_episode(merged)

        save_data(EPISODE_DATA_PATH, merged)

        print(f"Start latest episode: {latest_existing_episode or 'N/A'}")
        print(f"End latest episode: {latest_merged_episode or 'N/A'}")
        print(f"Added new episodes: {added_count}")
        print(f"Fetched: {len(fetched)} / Saved total: {len(merged)}")
    finally:
        driver.quit()


if __name__ == "__main__":
    main()