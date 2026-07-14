import os
import re

files = ['index.html', 'writing/index.html', 'photography/index.html']

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    # 1. Revert body class
    content = content.replace('<body class="has-sidebar">', '<body>')
    
    # 2. Remove the injected sidebar block
    # It looks like:
    #   <nav class="sidebar-nav" aria-label="Page Sections">
    #     <ul class="sidebar-nav__list">
    #       <li><a href="/#about">About</a></li>
    #       ...
    #     </ul>
    #   </nav>
    content = re.sub(r'[ \t]*<nav class="sidebar-nav" aria-label="Page Sections">[\s\S]*?</nav>\n?', '', content)
    
    # 3. Remove class="section-link" from list items
    content = content.replace('<li class="section-link">', '<li>')
    
    with open(f, 'w') as file:
        file.write(content)

# 4. Remove the CSS block from styles.css
with open('assets/css/styles.css', 'r') as file:
    css_content = file.read()

# Find the exact block we appended and remove it
css_block_pattern = r'/\* ---------- Sidebar Navigation ---------- \*/[\s\S]*'
css_content = re.sub(css_block_pattern, '', css_content)

# We also added empty line(s) before it, but just stripping end is fine
css_content = css_content.rstrip() + '\n'

with open('assets/css/styles.css', 'w') as file:
    file.write(css_content)

print("Sidebar reverted successfully.")
