#!/usr/bin/env python3
"""Static site quality gates for the GitHub Pages build (no dependencies)."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://www.psychopedagog.org"
EXCLUDED = {"404.html", "inspiracja/index.html"}

class Document(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.title = ""
        self.meta = {}
        self.links = []
        self.h1 = 0
        self.lang = None
        self.jsonld = []
        self.current_script = None
        self.in_title = False
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "html":
            self.lang = attrs.get("lang")
        if tag == "h1":
            self.h1 += 1
        if tag == "title":
            self.in_title = True
        if tag == "meta":
            key = attrs.get("name") or attrs.get("property")
            if key:
                self.meta[key] = attrs.get("content", "")
        if tag == "link":
            self.links.append(attrs)
        if tag == "script" and attrs.get("type") == "application/ld+json":
            self.current_script = []
        for key in ("href", "src"):
            if attrs.get(key):
                self.links.append({"url_ref": attrs[key]})
    def handle_data(self, data):
        if self.in_title:
            self.title += data
        if self.current_script is not None:
            self.current_script.append(data)
    def handle_endtag(self, tag):
        if tag == "title":
            self.in_title = False
        if tag == "script" and self.current_script is not None:
            self.jsonld.append("".join(self.current_script))
            self.current_script = None

def url_to_file(path):
    path = unquote(path).lstrip("/")
    if not path or path.endswith("/"):
        return ROOT / path / "index.html"
    return ROOT / path

def check():
    errors = []
    sitemap = ROOT / "sitemap-0.xml"
    index = ROOT / "sitemap-index.xml"
    robots = (ROOT / "robots.txt").read_text()
    if f"Sitemap: {ORIGIN}/sitemap-index.xml" not in robots:
        errors.append("robots.txt sitemap declaration missing")
    if "sitemap-0.xml" not in index.read_text():
        errors.append("Sitemap index missing the URL set")
    ns = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    root = ET.parse(sitemap).getroot()
    urls = [el.text for el in root.findall("s:url/s:loc", ns)]
    if len(urls) != len(set(urls)):
        errors.append("Duplicate sitemap URLs")
    if len(urls) < 18:
        errors.append(f"Expected >=18 canonical URLs, got {len(urls)}")
    if not any(u.endswith("/en/") for u in urls):
        errors.append("English homepage missing in sitemap")
    for url in urls:
        if not url.startswith(ORIGIN + "/") or "#" in url:
            errors.append(f"Invalid canonical sitemap URL: {url}")
            continue
        path = urlsplit(url).path
        file = url_to_file(path)
        if not file.is_file():
            errors.append(f"Sitemap target missing: {file}")
            continue
        doc = Document()
        source = file.read_text(encoding="utf-8")
        doc.feed(source)
        if doc.h1 != 1:
            errors.append(f"{file}: expected one H1, got {doc.h1}")
        if len(doc.title.strip()) < 15:
            errors.append(f"{file}: missing descriptive title")
        if len(doc.meta.get("description", "")) < 70:
            errors.append(f"{file}: missing descriptive meta description")
        if not doc.lang:
            errors.append(f"{file}: missing html lang")
        if "noindex" in doc.meta.get("robots", ""):
            errors.append(f"{file}: sitemap URL set to noindex")
        can = [x.get("href") for x in doc.links if x.get("rel") == "canonical"]
        if can != [url]:
            errors.append(f"{file}: canonical mismatch {can} vs {url}")
        # Ensure consistent full-screen navigation on every public canonical page.
        required_menu = (
            'id="site-menu-toggle"',
            'id="site-menu"',
            'class="language-picker"',
            'href="/assets/fullscreen-menu.css"',
            'src="/assets/menu-2026.js"',
            "<noscript>",
        )
        for fragment in required_menu:
            if fragment not in source:
                errors.append(f"{file}: missing menu integration: {fragment}")
        if 'class="main-nav"' in source:
            errors.append(f"{file}: old horizontal navigation still present")
        if source.count('id="site-menu"') != 1 or source.count('id="site-menu-toggle"') != 1:
            errors.append(f"{file}: duplicated or missing menu IDs")
        if 'aria-controls="site-menu"' not in source or 'aria-expanded="false"' not in source:
            errors.append(f"{file}: menu toggle lacks accessible state")
        if not doc.jsonld:
            errors.append(f"{file}: missing structured data")
        for script in doc.jsonld:
            try:
                json.loads(script)
            except json.JSONDecodeError as exc:
                errors.append(f"{file}: invalid JSON-LD {exc}")
        for link in doc.links:
            uri = link.get("url_ref")
            if not uri or not uri.startswith("/") or uri.startswith("//"):
                continue
            target = url_to_file(urlsplit(uri).path)
            if not target.exists():
                errors.append(f"{file}: broken internal URL {uri}")
        if file in [ROOT / "index.html", ROOT / "en/index.html"]:
            # The biographies must be the complete source text, not previews.
            import re
            cards = re.findall(r'<article class="team-card">(.*?)</article>', source, flags=re.S)
            if len(cards) != 8:
                errors.append(f"{file}: expected 8 public specialist cards")
            for i, card in enumerate(cards, 1):
                match = re.search(r'<div class="bio">(.*?)</div>', card, flags=re.S)
                if not match or "..." in match.group(1) or len(match.group(1)) < 150:
                    errors.append(f"{file}: incomplete biography in card #{i}")
        if file in [ROOT / "index.html", ROOT / "en/index.html", ROOT / "cennik/index.html", ROOT / "en/pricing/index.html"]:
            count = source.count('class="service-row"')
            if count != 25:
                errors.append(f"{file}: service catalog has {count} rather than 25 items")
    for path in EXCLUDED:
        source = (ROOT / path).read_text(encoding="utf-8").lower()
        if "noindex" not in source:
            errors.append(f"{path}: needs noindex")
    print(f"Checked {len(urls)} sitemap entries, URLs, canonicals, JSON-LD, assets and catalogs.")
    if errors:
        print("ERRORS:")
        for err in errors:
            print(" -", err)
        return 1
    print("All static SEO and integrity checks passed.")
    return 0

if __name__ == "__main__":
    raise SystemExit(check())
