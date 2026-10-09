#!/usr/bin/env python3
"""Render this site's simple Jekyll includes without installing Ruby.

This is an offline preview helper, not a replacement for Jekyll.
GitHub Pages performs the real build automatically after a commit.
"""
import argparse
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INCLUDE = re.compile(r"{%\s*include\s+([a-zA-Z0-9_./-]+)\s*%}")
VARIABLE = re.compile(r"{{\s*page\.([a-zA-Z0-9_]+)\s*}}")


def read_page(path):
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        return None
    metadata, content = text[4:].split("\n---", 1)
    fields = {}
    for line in metadata.splitlines():
        key, value = line.split(":", 1)
        value = value.strip()
        if value.startswith('"') and value.endswith('"'):
            value = value[1:-1]
        fields[key.strip()] = value
    return fields, content.lstrip("\n")


def render(text, fields, stack=()):
    def include(match):
        name = match.group(1)
        path = (ROOT / "_includes" / name).resolve()
        if not path.is_relative_to(ROOT / "_includes"):
            raise ValueError(f"Include outside _includes: {name}")
        if name in stack:
            raise ValueError(f"Recursive include: {name}")
        return render(path.read_text(encoding="utf-8"), fields, (*stack, name))

    text = INCLUDE.sub(include, text)
    text = VARIABLE.sub(lambda match: fields[match.group(1)], text)
    if "{%" in text or "{{" in text:
        raise ValueError("Unsupported Liquid syntax: verify with a full Jekyll build")
    return text


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", default="_preview",
                        help="Output directory, relative to the repository or absolute")
    args = parser.parse_args()
    destination = (ROOT / args.output_dir).resolve()
    if destination == ROOT or ROOT in destination.parents and not destination.name.startswith("_"):
        raise ValueError("Use an underscore-prefixed directory or a directory outside the repository")
    destination.mkdir(parents=True, exist_ok=True)
    for path in [ROOT / "index.html", *sorted((ROOT / "cn").glob("*.html")),
                 *sorted((ROOT / "en").glob("*.html"))]:
        target = destination / path.relative_to(ROOT)
        target.parent.mkdir(parents=True, exist_ok=True)
        page = read_page(path)
        if page:
            fields, content = page
            layout = ROOT / "_layouts" / (fields["layout"] + ".html")
            rendered = render(layout.read_text(encoding="utf-8"), fields)
        else:
            rendered = path.read_text(encoding="utf-8")
        target.write_text(rendered, encoding="utf-8")
    for name in ["assets", "images"]:
        shutil.copytree(ROOT / name, destination / name, dirs_exist_ok=True)
    print(destination)


if __name__ == "__main__":
    main()
