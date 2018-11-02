all:
	python3 compile_html.py
	tsc --build tsconfig.json