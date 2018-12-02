#!/usr/bin/env python3
from jinja2 import Environment, FileSystemLoader, select_autoescape
env = Environment(
    loader=FileSystemLoader('templates'),
    autoescape=select_autoescape(['html', 'xml']),
    trim_blocks=True,
    lstrip_blocks=True
)
for tmpl in env.list_templates('html'):
    with open(f"docs/{tmpl}", "w") as f:
        f.write(env.get_template(tmpl).render())
