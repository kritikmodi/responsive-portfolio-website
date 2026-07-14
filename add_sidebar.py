import os
import re

sidebar_html = """
  <nav class="sidebar-nav" aria-label="Page Sections">
    <ul class="sidebar-nav__list">
      <li><a href="/#about">About</a></li>
      <li><a href="/#work">Work</a></li>
      <li><a href="/#proud">Proud of</a></li>
      <li><a href="/#contact">Contact</a></li>
    </ul>
  </nav>
"""

files = ['index.html', 'writing/index.html', 'photography/index.html']

for f in files:
    with open(f, 'r') as file:
        content = file.read()
    
    # Add class to body
    content = content.replace('<body>', '<body class="has-sidebar">')
    
    # Add section-link class to the top nav items so they can be hidden on desktop
    content = content.replace('<li><a href="/#about"', '<li class="section-link"><a href="/#about"')
    content = content.replace('<li><a href="/#work"', '<li class="section-link"><a href="/#work"')
    content = content.replace('<li><a href="/#proud"', '<li class="section-link"><a href="/#proud"')
    content = content.replace('<li><a href="/#contact"', '<li class="section-link"><a href="/#contact"')
    
    # Inject sidebar after header
    if '<main>' in content:
        content = content.replace('<main>', sidebar_html + '\n  <main>')
    
    with open(f, 'w') as file:
        file.write(content)

print("Sidebar HTML injected.")
