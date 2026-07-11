import os
import re

html = open('index.html').read()

hero = re.search(r'(    <!-- ==================== HERO ==================== -->.*?)(?=    <!-- ==================== ABOUT ==================== -->)', html, re.DOTALL).group(1)
about = re.search(r'(    <!-- ==================== ABOUT ==================== -->.*?)(?=    <!-- ==================== WORK ==================== -->)', html, re.DOTALL).group(1)
work = re.search(r'(    <!-- ==================== WORK ==================== -->.*?)(?=    <!-- ==================== WRITING ==================== -->)', html, re.DOTALL).group(1)
writing = re.search(r'(    <!-- ==================== WRITING ==================== -->.*?)(?=    <!-- ==================== PHOTOGRAPHY ==================== -->)', html, re.DOTALL).group(1)
photography = re.search(r'(    <!-- ==================== PHOTOGRAPHY ==================== -->.*?)(?=    <!-- ==================== PROUD OF ==================== -->)', html, re.DOTALL).group(1)
proud = re.search(r'(    <!-- ==================== PROUD OF ==================== -->.*?)(?=    <!-- ==================== CONTACT ==================== -->)', html, re.DOTALL).group(1)
contact = re.search(r'(    <!-- ==================== CONTACT ==================== -->.*?</section>\n)', html, re.DOTALL).group(1)

top = html[:html.find('    <!-- ==================== HERO ==================== -->')]
bottom = html[html.find('  </main>'):]

top = top.replace('href="#top"', 'href="index.html"')
top = top.replace('href="#about"', 'href="about.html"')
top = top.replace('href="#work"', 'href="work.html"')
top = top.replace('href="#writing"', 'href="writing.html"')
top = top.replace('href="#photography"', 'href="photography.html"')
top = top.replace('href="#proud"', 'href="proud.html"')
top = top.replace('href="#contact"', 'href="contact.html"')

open('index.html', 'w').write(top + hero + bottom)
open('about.html', 'w').write(top + about + bottom)
open('work.html', 'w').write(top + work + bottom)
open('writing.html', 'w').write(top + writing + bottom)
open('photography.html', 'w').write(top + photography + bottom)
open('proud.html', 'w').write(top + proud + bottom)
open('contact.html', 'w').write(top + contact + bottom)

print("Split successful")
