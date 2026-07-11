import os
import shutil

pages = ["about", "work", "writing", "photography", "proud", "contact"]

for page in pages:
    if os.path.exists(f"{page}.html"):
        os.makedirs(page, exist_ok=True)
        shutil.move(f"{page}.html", f"{page}/index.html")

# Get list of all index.html files
files = ["index.html"] + [f"{page}/index.html" for page in pages]

for f in files:
    if not os.path.exists(f):
        continue
    with open(f, 'r') as file:
        content = file.read()
    
    # Asset paths
    content = content.replace('href="assets/', 'href="/assets/')
    content = content.replace('src="assets/', 'src="/assets/')
    
    # Navigation links
    content = content.replace('href="about.html"', 'href="/about"')
    content = content.replace('href="work.html"', 'href="/work"')
    content = content.replace('href="writing.html"', 'href="/writing"')
    content = content.replace('href="photography.html"', 'href="/photography"')
    content = content.replace('href="proud.html"', 'href="/proud"')
    content = content.replace('href="contact.html"', 'href="/contact"')
    content = content.replace('href="index.html"', 'href="/"')
    
    with open(f, 'w') as file:
        file.write(content)

print("Restructured successfully")
