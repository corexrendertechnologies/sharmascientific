#!/usr/bin/env python3
"""Generate accessible, printable SSI technical sheets from products.json."""
from __future__ import annotations
import io, json, os, re
from pathlib import Path
from PIL import Image
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
                                Image as RLImage, KeepTogether, PageBreak)

ROOT = Path(__file__).resolve().parents[1]
DATA = json.loads((ROOT / 'products.json').read_text())
OUT = ROOT / 'assets' / 'docs'
OUT.mkdir(parents=True, exist_ok=True)
FONT = '/System/Library/Fonts/Supplemental/Arial.ttf'
FONT_BOLD = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
if Path(FONT).exists() and Path(FONT_BOLD).exists():
    pdfmetrics.registerFont(TTFont('SSI', FONT)); pdfmetrics.registerFont(TTFont('SSI-Bold', FONT_BOLD))
    REG, BOLD = 'SSI', 'SSI-Bold'
else:
    REG, BOLD = 'Helvetica', 'Helvetica-Bold'

INK = colors.HexColor('#173b33')
GREEN = colors.HexColor('#285b4f')
COPPER = colors.HexColor('#b96543')
MUTED = colors.HexColor('#68776f')
LINE = colors.HexColor('#dce5dc')
PALE = colors.HexColor('#f2f5ef')
WHITE = colors.white
PAGE_W, PAGE_H = A4
styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='EyebrowSSI', fontName=BOLD, fontSize=7.2, leading=10, textColor=COPPER, tracking=1.0, spaceAfter=4))
styles.add(ParagraphStyle(name='TitleSSI', fontName=BOLD, fontSize=24, leading=28, textColor=INK, spaceAfter=4))
styles.add(ParagraphStyle(name='LeadSSI', fontName=REG, fontSize=9, leading=13, textColor=MUTED))
styles.add(ParagraphStyle(name='BodySSI', fontName=REG, fontSize=8, leading=11, textColor=INK))
styles.add(ParagraphStyle(name='SmallSSI', fontName=REG, fontSize=7, leading=9.4, textColor=MUTED))
styles.add(ParagraphStyle(name='SectionSSI', fontName=BOLD, fontSize=10.5, leading=13, textColor=INK, spaceBefore=8, spaceAfter=5))
styles.add(ParagraphStyle(name='TableKeySSI', fontName=BOLD, fontSize=7.2, leading=9.3, textColor=GREEN))
styles.add(ParagraphStyle(name='TableValueSSI', fontName=REG, fontSize=7.3, leading=9.5, textColor=INK))
styles.add(ParagraphStyle(name='PillSSI', fontName=BOLD, fontSize=7, leading=9, textColor=GREEN, alignment=TA_LEFT))


def safe(text):
    s = str(text)
    return s.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;').replace('\n', '<br/>')


def label(key):
    return re.sub(r'([a-z0-9])([A-Z])', r'\1 \2', str(key)).replace('_', ' ').replace('-', ' ').strip().capitalize()


def paragraph(text, style='BodySSI'):
    return Paragraph(safe(text), styles[style])


def page_decor(canvas, doc):
    canvas.saveState()
    canvas.setFillColor(GREEN); canvas.rect(0, PAGE_H-5*mm, PAGE_W, 5*mm, stroke=0, fill=1)
    if doc.page > 1:
        canvas.setFont(BOLD, 7); canvas.setFillColor(GREEN)
        canvas.drawString(16*mm, PAGE_H-10*mm, 'SSI / SHARMA SCIENTIFIC INSTRUMENTS')
        canvas.setFont(REG, 7); canvas.setFillColor(MUTED)
        canvas.drawRightString(PAGE_W-16*mm, PAGE_H-10*mm, 'PRODUCT SPECIFICATION · CONTINUED')
    canvas.setStrokeColor(LINE); canvas.setLineWidth(.5); canvas.line(16*mm, 14*mm, PAGE_W-16*mm, 14*mm)
    canvas.setFont(REG, 7); canvas.setFillColor(MUTED)
    canvas.drawString(16*mm, 9*mm, 'SHARMA SCIENTIFIC INSTRUMENTS  /  PRODUCT SPECIFICATION')
    canvas.drawRightString(PAGE_W-16*mm, 9*mm, f'{doc.page:02d}')
    canvas.restoreState()


def make_image(product):
    p = ROOT / product.get('image', '')
    if not p.exists(): p = ROOT / product.get('imageFallback', '')
    if not p.exists(): return None
    try:
        im = Image.open(p).convert('RGB'); im.thumbnail((560, 400))
        buf = io.BytesIO(); im.save(buf, format='JPEG', quality=90); buf.seek(0)
        obj = RLImage(buf, width=61*mm, height=48*mm, kind='proportional')
        obj.hAlign = 'CENTER'
        return obj
    except Exception:
        return None


def kv_table(mapping):
    rows = []
    for key, value in mapping.items():
        if value is None or isinstance(value, (dict, list)): continue
        rows.append([Paragraph(safe(label(key)), styles['TableKeySSI']), Paragraph(safe(value), styles['TableValueSSI'])])
    if not rows: return None
    table = Table(rows, colWidths=[39*mm, 119*mm], repeatRows=0, hAlign='LEFT')
    table.setStyle(TableStyle([
        ('BACKGROUND',(0,0),(-1,-1),WHITE),('VALIGN',(0,0),(-1,-1),'TOP'),
        ('LINEBELOW',(0,0),(-1,-1),.45,LINE),('LEFTPADDING',(0,0),(-1,-1),6),
        ('RIGHTPADDING',(0,0),(-1,-1),6),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5),
        ('ROWBACKGROUNDS',(0,0),(-1,-1),[WHITE,PALE]),
    ]))
    return table


def build(product):
    path = OUT / f"{product['id']}.pdf"
    doc = SimpleDocTemplate(str(path), pagesize=A4, rightMargin=16*mm, leftMargin=16*mm,
                            topMargin=13*mm, bottomMargin=20*mm, title=f"{product['name']} | Technical specification",
                            author='Sharma Scientific Instruments', subject='Product catalogue specification')
    story = []
    brand = Table([[Paragraph('SSI <font color="#b96543">/</font> SHARMA SCIENTIFIC INSTRUMENTS', ParagraphStyle('BrandSSI',fontName=BOLD,fontSize=8,leading=11,textColor=GREEN)),
                    Paragraph('PRODUCT TECHNICAL SHEET<br/><font color="#68776f">Catalogue information · confirm configuration before ordering</font>', ParagraphStyle('BrandRightSSI',fontName=REG,fontSize=7,leading=10,textColor=INK,alignment=2))]], colWidths=[100*mm,58*mm])
    brand.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'MIDDLE'),('BOTTOMPADDING',(0,0),(-1,-1),8),('LINEBELOW',(0,0),(-1,-1),1.2,GREEN)]))
    story += [brand, Spacer(1, 7*mm)]
    visual = make_image(product)
    left = [paragraph(product.get('categoryName','Laboratory equipment').upper(),'EyebrowSSI'),
            paragraph(product['name'],'TitleSSI'),
            paragraph(product.get('tagline') or product.get('description') or 'Product information from the current catalogue.','LeadSSI'),
            Spacer(1, 4*mm),
            Table([[paragraph('MODEL / CATALOGUE CODE','EyebrowSSI')],[Paragraph(safe(product.get('catalogueCode') or 'Ask supplier'), ParagraphStyle('ModelSSI',fontName=BOLD,fontSize=11,leading=14,textColor=GREEN))]], colWidths=[83*mm], style=TableStyle([('BACKGROUND',(0,0),(-1,-1),PALE),('BOX',(0,0),(-1,-1),.6,LINE),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5)]))]
    hero = Table([[left, visual or '']], colWidths=[98*mm,60*mm], hAlign='LEFT')
    hero.setStyle(TableStyle([('VALIGN',(0,0),(-1,-1),'MIDDLE'),('LEFTPADDING',(0,0),(-1,-1),0),('RIGHTPADDING',(0,0),(-1,-1),4),('TOPPADDING',(0,0),(-1,-1),0),('BOTTOMPADDING',(0,0),(-1,-1),4)]))
    story += [hero, Spacer(1, 5*mm)]
    chips = product.get('chips') or []
    if chips:
        data = [[Paragraph(safe(c), styles['PillSSI']) for c in chips[:3]]]
        pills = Table(data, colWidths=[158*mm/max(1,min(3,len(chips)))]*min(3,len(chips)), hAlign='LEFT')
        pills.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),PALE),('BOX',(0,0),(-1,-1),.5,LINE),('INNERGRID',(0,0),(-1,-1),.5,LINE),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7),('VALIGN',(0,0),(-1,-1),'MIDDLE')]))
        story += [pills, Spacer(1, 3*mm)]

    groups=[]
    for key in ['temperature','operatingSpecs','specifications','humidity','refrigeration','coolingHeating','heating','construction']:
        value=product.get(key)
        if isinstance(value,dict) and value:
            groups.append((label(key),value))
    for title, mapping in groups:
        table=kv_table(mapping)
        if table: story += [paragraph(title,'SectionSSI'), table]
    sizes=product.get('sizes') or product.get('models')
    if isinstance(sizes,list) and sizes and all(isinstance(r,dict) for r in sizes):
        keys=list(dict.fromkeys(k for row in sizes for k in row.keys()))
        dimension_unit = 'mm' if product.get('id') in ['laboratory-furnace','oven-and-incubator-combined','seed-germinator'] else 'cm'
        dimension_labels = {'h':f'Height ({dimension_unit})','w':f'Width ({dimension_unit})','d':f'Depth ({dimension_unit})','l':f'Length ({dimension_unit})','dia':'Diameter (cm)','kw':'Power','cap':'Capacity','model':'Model'}
        head=[Paragraph(safe(dimension_labels.get(k,label(k))),ParagraphStyle('SizeHead'+k,fontName=BOLD,fontSize=6.5,leading=8,textColor=WHITE)) for k in keys]
        rows=[head]
        for item in sizes:
            rows.append([Paragraph(safe(item.get(k,'-')),styles['TableValueSSI']) for k in keys])
        widths=[158*mm/len(keys)]*len(keys)
        table=Table(rows,colWidths=widths,repeatRows=1,hAlign='LEFT')
        table.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,0),GREEN),('ROWBACKGROUNDS',(0,1),(-1,-1),[WHITE,PALE]),('GRID',(0,0),(-1,-1),.4,LINE),('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),5),('RIGHTPADDING',(0,0),(-1,-1),5),('TOPPADDING',(0,0),(-1,-1),5),('BOTTOMPADDING',(0,0),(-1,-1),5)]))
        story += [KeepTogether([paragraph('Published models & dimensions','SectionSSI'), table])]
    for key,title in [('optionalAccessories','Optional accessories'),('applications','Typical applications')]:
        vals=product.get(key)
        if isinstance(vals,list) and vals:
            items=[Paragraph('<font color="#b96543">&#8226;</font> '+safe(v),styles['BodySSI']) for v in vals]
            story += [paragraph(title,'SectionSSI'), Table([[items]],colWidths=[158*mm],style=TableStyle([('BACKGROUND',(0,0),(-1,-1),PALE),('BOX',(0,0),(-1,-1),.5,LINE),('LEFTPADDING',(0,0),(-1,-1),8),('RIGHTPADDING',(0,0),(-1,-1),8),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),7)]))]
    note=Table([[Paragraph('<b>Procurement note</b><br/>This sheet summarizes published catalogue information. Confirm the exact model, operating conditions, supply requirements, included accessories, documentation, price and delivery details with Sharma Scientific Instruments before placing an order. Application examples are indicative and do not certify process suitability.',styles['SmallSSI'])]], colWidths=[158*mm])
    note.setStyle(TableStyle([('BACKGROUND',(0,0),(-1,-1),PALE),('BOX',(0,0),(-1,-1),.6,LINE),('LINEBEFORE',(0,0),(0,0),3,COPPER),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),8),('BOTTOMPADDING',(0,0),(-1,-1),8)]))
    story += [Spacer(1,5*mm),note,Spacer(1,2*mm),Paragraph('Ahmedabad, Gujarat, India  ·  +91 98984 57997  ·  +91 74050 57997  ·  ssirajesh2010@gmail.com  ·  sharmascientificinstruments.in',ParagraphStyle('ContactSSI',fontName=REG,fontSize=7,leading=9,textColor=MUTED))]
    doc.build(story,onFirstPage=page_decor,onLaterPages=page_decor)
    return path

if __name__=='__main__':
    for p in DATA['products']:
        build(p)
    print(f"Generated {len(DATA['products'])} product technical sheets in {OUT}")
