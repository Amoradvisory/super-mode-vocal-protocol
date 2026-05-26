"""Fast Super Mode Vocal helper for Amor/Hermes on Windows.

Purpose:
- Focus the persistent common Chrome window titled `ChatGPT - Mode Vocal - Google Chrome`.
- Paste/send text into the ChatGPT project `Mode Vocal`.
- Poll the Windows UI Automation tree for the latest `Plus d’actions` button.
- Click the exact `MenuItem` named `Lire à haute voix`.
- Verify playback by finding `Arrêter` when available.

Dependencies: pyautogui, pyperclip, pywinauto.
Run with the Windows Python used on Amor's machine.
"""

from __future__ import annotations

import argparse
import ctypes
import sys
import time
from ctypes import wintypes

import pyautogui
import pyperclip
from pywinauto import Desktop

WINDOW_TITLE_PARTS = ("Mode Vocal", "Google Chrome")


def focus_mode_vocal_window() -> int:
    user32 = ctypes.WinDLL("user32", use_last_error=True)
    kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
    enum_windows = user32.EnumWindows
    is_visible = user32.IsWindowVisible
    get_len = user32.GetWindowTextLengthW
    get_text = user32.GetWindowTextW
    get_thread_pid = user32.GetWindowThreadProcessId
    show_window = user32.ShowWindow
    set_foreground = user32.SetForegroundWindow
    bring_top = user32.BringWindowToTop
    attach_thread = user32.AttachThreadInput
    get_foreground = user32.GetForegroundWindow
    get_current_thread = kernel32.GetCurrentThreadId

    enum_proc = ctypes.WINFUNCTYPE(wintypes.BOOL, wintypes.HWND, wintypes.LPARAM)
    matches: list[tuple[int, str]] = []

    @enum_proc
    def callback(hwnd, _lparam):
        if is_visible(hwnd):
            length = get_len(hwnd)
            if length:
                buffer = ctypes.create_unicode_buffer(length + 1)
                get_text(hwnd, buffer, length + 1)
                title = buffer.value
                if all(part in title for part in WINDOW_TITLE_PARTS):
                    matches.append((int(hwnd), title))
        return True

    enum_windows(callback, 0)
    if not matches:
        raise RuntimeError("No `ChatGPT - Mode Vocal - Google Chrome` window found")

    hwnd = matches[0][0]
    show_window(hwnd, 3)  # SW_MAXIMIZE
    bring_top(hwnd)
    current_thread = get_current_thread()
    foreground = get_foreground()
    target_thread = get_thread_pid(hwnd, None)
    foreground_thread = get_thread_pid(foreground, None)
    attach_thread(current_thread, target_thread, True)
    attach_thread(current_thread, foreground_thread, True)
    set_foreground(hwnd)
    attach_thread(current_thread, target_thread, False)
    attach_thread(current_thread, foreground_thread, False)
    return hwnd


def visible_latest_plus_button():
    window = Desktop(backend="uia").window(title_re=".*Mode Vocal.*Chrome.*")
    candidates = []
    for button in window.descendants(control_type="Button"):
        name = button.window_text()
        rect = button.rectangle()
        if name == "Plus d’actions" and 0 <= rect.top <= 767 and 420 <= rect.left <= 700:
            candidates.append((rect.top, button, rect))
    if not candidates:
        return None
    return sorted(candidates, key=lambda item: item[0])[-1]


def click_read_aloud_menu_item(timeout: float = 2.0) -> bool:
    deadline = time.time() + timeout
    while time.time() < deadline:
        for win in Desktop(backend="uia").windows():
            try:
                nodes = [win] + win.descendants()
            except Exception:
                nodes = [win]
            for node in nodes:
                try:
                    name = node.window_text().strip()
                    control_type = node.element_info.control_type
                    rect = node.rectangle()
                except Exception:
                    continue
                if name == "Lire à haute voix" and control_type == "MenuItem" and 0 <= rect.top <= 767:
                    node.click_input()
                    return True
        time.sleep(0.05)
    return False


def playback_started() -> bool:
    for win in Desktop(backend="uia").windows():
        try:
            nodes = [win] + win.descendants()
        except Exception:
            nodes = [win]
        for node in nodes:
            try:
                name = node.window_text().strip()
                rect = node.rectangle()
            except Exception:
                continue
            if name == "Arrêter" and 0 <= rect.top <= 767:
                return True
    return False


def run(text: str, wait_timeout: float = 18.0) -> dict:
    pyperclip.copy(text)
    focus_mode_vocal_window()
    time.sleep(0.2)
    pyautogui.press("esc")
    pyautogui.press("end")
    time.sleep(0.1)

    pyautogui.click(730, 676)
    pyautogui.hotkey("ctrl", "v")
    time.sleep(0.05)
    pyautogui.press("enter")
    sent_at = time.time()

    clicked_plus = False
    plus_at = None
    while time.time() - sent_at < wait_timeout:
        pyautogui.press("end")
        time.sleep(0.16)
        latest = visible_latest_plus_button()
        if latest:
            _top, button, rect = latest
            plus_at = time.time() - sent_at
            button.click_input()
            clicked_plus = True
            break

    if not clicked_plus:
        raise RuntimeError("Could not find visible latest `Plus d’actions` button")

    time.sleep(0.15)
    if not click_read_aloud_menu_item():
        raise RuntimeError("Could not find exact `Lire à haute voix` MenuItem")
    lire_at = time.time() - sent_at

    time.sleep(0.5)
    return {
        "clicked_plus": round(plus_at or -1, 2),
        "clicked_lire_a_haute_voix": round(lire_at, 2),
        "verified_arreter": playback_started(),
    }


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--text", help="Text to paste/send/read")
    parser.add_argument("--file", help="UTF-8 text file to read aloud")
    args = parser.parse_args()
    if args.file:
        with open(args.file, encoding="utf-8") as handle:
            text = handle.read()
    elif args.text:
        text = args.text
    else:
        text = sys.stdin.read()
    if not text.strip():
        raise SystemExit("No text provided")
    print(run(text))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
