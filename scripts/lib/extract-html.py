"""Deterministic extraction from supplied HTML bytes; no fetching or script execution."""
import base64
import importlib.metadata
import json
import sys

from lxml import html


v = json.load(sys.stdin)
body = base64.b64decode(v["htmlBase64"]) if v.get("htmlBase64") else v["html"]
doc = html.fromstring(body, base_url=v["url"], parser=html.HTMLParser(encoding=v.get("encoding")))


def first(values):
    return values[0].strip() if values and isinstance(values[0], str) else None


title = first(doc.xpath("//meta[@property='og:title']/@content")) or first(doc.xpath("//title/text()"))
canonical = first(doc.xpath("//link[contains(concat(' ',normalize-space(@rel),' '),' canonical ')]/@href"))
dates = []
for node in doc.xpath("//meta[@content]"):
    field = node.get("property") or node.get("name") or node.get("itemprop") or ""
    if field.lower() in ["article:published_time", "article:modified_time", "datepublished", "datemodified", "pubdate", "publishdate"]:
        dates.append({"field": field, "raw": node.get("content"), "origin": "html-meta"})
for node in doc.xpath("//time[@datetime]"):
    dates.append({"field": "time", "raw": node.get("datetime"), "origin": "html-time"})
for node in doc.xpath("//script[@type='application/ld+json']"):
    try:
        data = json.loads(node.text or "")
        stack = data if isinstance(data, list) else [data]
        while stack:
            item = stack.pop()
            if not isinstance(item, dict):
                continue
            for field in ["datePublished", "dateModified"]:
                if isinstance(item.get(field), str):
                    dates.append({"field": field, "raw": item[field], "origin": "json-ld"})
            if isinstance(item.get("@graph"), list):
                stack.extend(item["@graph"])
    except (ValueError, TypeError):
        pass

result = {"title": title, "canonicalUrl": canonical, "pageTimestamps": dates}
if v["extractor"] == "trafilatura":
    import trafilatura

    version = importlib.metadata.version("trafilatura")
    if version != v["trafilaturaVersion"]:
        raise RuntimeError("The configured Trafilatura version is not the verified version")
    original = body.decode(v["encoding"]) if isinstance(body, bytes) and v.get("encoding") else body
    extracted = trafilatura.extract(original, url=v["url"], output_format="json", with_metadata=True,
                                    include_comments=False, include_tables=True)
    if not extracted:
        raise RuntimeError("No article candidate; use original tool text import")
    article = json.loads(extracted)
    result.update({"text": article.get("text") or "", "extractionMethod": "trafilatura-default",
                   "extractionTool": {"name": "trafilatura", "version": version,
                                      "profile": "default-no-comments-tables"}})
    if not result["title"]:
        result["title"] = article.get("title")
elif v["extractor"] != "metadata":
    raise RuntimeError("Unknown configured extraction method")

print(json.dumps(result, ensure_ascii=False))
