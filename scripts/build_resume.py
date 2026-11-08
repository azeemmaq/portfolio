"""Generate the site's two-page PDF from the same data used by React.

Requires reportlab and pypdf. Run: python3 scripts/build_resume.py
"""
import json
from html import escape
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / 'src/data/profile.json').read_text())
OUTPUT = ROOT / 'public/Azeem-Maqbool-Resume.pdf'
W, H = A4
M = 43
WIDTH = W - M * 2
INK = colors.HexColor('#142d4e')
BLUE = colors.HexColor('#0866d9')
HEADER = colors.HexColor('#eaf4ff')
PAPER = colors.white
MUTED = colors.HexColor('#4a5c70')
style = ParagraphStyle('body', fontName='Helvetica', fontSize=9.1, leading=12.4, textColor=INK, alignment=TA_LEFT)
small = ParagraphStyle('small', parent=style, fontSize=8.3, leading=11.5, textColor=MUTED)
c = canvas.Canvas(str(OUTPUT), pagesize=A4)
c.setTitle('Azeem Maqbool | Telecommunications Project Engineer')
c.setAuthor(DATA['name'])
c.setSubject('Experience, selected projects, technical skills and qualifications')
y = H - M


def text(value, x=M, width=WIDTH, text_style=style, gap=7):
    global y
    paragraph = Paragraph(value, text_style)
    _, height = paragraph.wrap(width, H)
    assert y - height > 48, f'Content overflow: {value[:60]}'
    paragraph.drawOn(c, x, y - height)
    y -= height + gap


def label(value):
    global y
    y -= 8
    c.setFillColor(INK)
    c.setFillColor(BLUE)
    c.setFont('Helvetica-Bold', 9)
    c.drawString(M, y, value.upper())
    y -= 16


def job(item, compact=False):
    global y
    c.setFillColor(INK)
    c.setFont('Helvetica-Bold', 16 if not compact else 14)
    c.drawString(M, y - 14, item['company'])
    c.setFont('Helvetica', 8.1)
    c.drawRightString(W - M, y - 13, item['period'].replace('–', '-'))
    y -= 26 if compact else 30
    text(escape(item['title']) + ' | ' + escape(item['location']), text_style=small, gap=3)
    if compact:
        text(escape(item['project']) + '. ' + escape(' '.join(item['bullets'])), gap=3)
    else:
        text(escape(item['project']), text_style=small, gap=4)
        for bullet in item['bullets']:
            if item['company'] == 'Nokia' and bullet.startswith('Delivered 16'):
                continue  # Airport results are already highlighted above.
            text('• ' + escape(bullet), gap=3)
    y -= 10 if not compact else 0


def footer(page):
    c.setFillColor(MUTED)
    c.setFont('Helvetica', 8)
    c.drawString(M, 30, 'AZEEM MAQBOOL / TELECOMMUNICATIONS ENGINEERING')
    c.drawRightString(W - M, 30, f'{page} / 2')


# Page 1: contact details, positioning and recent delivery experience.
c.setFillColor(HEADER)
c.rect(0, H - 144, W, 144, fill=1, stroke=0)
c.setFillColor(INK)
c.setFont('Helvetica-Bold', 38)
c.drawString(M, H - 62, DATA['name'])
c.setFont('Helvetica', 12)
c.drawString(M, H - 86, DATA['title'])
c.setFont('Helvetica', 8.5)
c.drawString(M, H - 107, f"Melbourne, VIC  |  {DATA['phoneDisplay']}  |  {DATA['email']}")
c.drawString(M, H - 123, 'Australian permanent resident | Full work rights | Victorian full driver’s licence')
contact_prefix = f"Melbourne, VIC  |  {DATA['phoneDisplay']}  |  "
email_x = M + pdfmetrics.stringWidth(contact_prefix, 'Helvetica', 8.5)
c.linkURL(f"mailto:{DATA['email']}", (email_x, H - 111, W - M, H - 98), relative=0)
phone_x = M + pdfmetrics.stringWidth('Melbourne, VIC  |  ', 'Helvetica', 8.5)
phone_end = phone_x + pdfmetrics.stringWidth(DATA['phoneDisplay'], 'Helvetica', 8.5)
c.linkURL(f"tel:{DATA['phoneInternational']}", (phone_x, H - 111, phone_end, H - 98), relative=0)
y = H - 166
text(escape(DATA['summary']), gap=8)
label('Selected project / Zayed International Airport')
text('Delivered <b>16 passive SRAN/5G sites</b> and <b>one active 5G site</b> with <b>more than 100 pRRHs</b>, coordinating <b>eight teams</b> through completion.', gap=9)
label('Recent experience')
for item in DATA['experience'][:4]:
    job(item)
footer(1)
c.showPage()

# Page 2: the complete earlier timeline, skills, education and training.
c.setFillColor(PAPER)
c.rect(0, 0, W, H, fill=1, stroke=0)
y = H - M
c.setFillColor(INK)
c.setFont('Helvetica-Bold', 29)
c.drawString(M, y - 6, 'Experience & qualifications')
y -= 38
label('Earlier experience')
for item in DATA['experience'][4:]:
    job(item, compact=True)
label('Other project delivery')
text(escape(', '.join(DATA['projects'])), text_style=small, gap=8)
label('Technical skills & equipment')
text(escape(' · '.join(DATA['skills'])), gap=8)
text(escape(DATA['equipment']), text_style=small, gap=8)
label('Education & professional assessment')
text(escape(DATA['education']['degree']) + ' | ' + escape(DATA['education']['period']).replace('–', '-') + '<br/>' + escape(DATA['education']['institution']) + '<br/>' + escape(DATA['education']['assessment']), gap=8)
label('Training & certifications')
for cert in DATA['certifications']:
    text(escape(cert['title']) + ' (' + cert['year'] + ')', gap=3)
y -= 6
text('<link href="' + DATA['linkedin'] + '" color="#0866d9">linkedin.com/in/azeem-maqbool-67233516/</link>', text_style=small)
footer(2)
c.save()

reader = PdfReader(OUTPUT)
assert len(reader.pages) == 2, 'Resume must have exactly two pages'
extracted = '\n'.join(page.extract_text() for page in reader.pages)
for required in [DATA['email'], DATA['phoneDisplay'], '100 pRRHs', 'Foresight Communication', 'Feb 2019', 'Feb 2016', '2001-2005']:
    assert required in extracted, f'Missing content: {required}'
for item in DATA['experience']:
    assert item['title'] in extracted, f"Missing role: {item['title']}"
assert 'Career Break' not in extracted
assert any('/Annots' in page for page in reader.pages), 'Contact links must remain clickable'
print(f'Created and verified {OUTPUT} (2 pages)')
