"""Original conceptual artwork. Deterministic synthetic values only; no research data."""
import math, random
from pathlib import Path
random.seed(63)
out=Path(__file__).resolve().parents[1]/'public/assets'
ink='#3a453d'; blue='#7294a0'; ochre='#b98d56'; red='#ba7b68'; green='#8c9b7b'
def svg(name,body,bg='#eeeee5'):
 (out/(name+'.svg')).write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400" role="img"><title>Conceptual illustration using synthetic values</title><rect width="600" height="400" fill="{bg}"/>{body}</svg>')
def path(points,stroke,width=1,opacity=1):
 return f'<path d="M'+ ' L'.join(f'{x:.2f},{y:.2f}' for x,y in points)+f'" fill="none" stroke="{stroke}" stroke-width="{width}" opacity="{opacity}"/>'
def circle(x,y,r,color,opacity=1):return f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{r}" fill="{color}" opacity="{opacity}"/>'
# Fixed illustrative pattern coordinates are shared by geometry.svg and matrix.svg.
points=[]; colors=[blue,ochre,red,green]
centers=[(-1.15,-.30),(.45,.8),(1.15,-.50),(-.25,-.75)]
for i,(cx,cy) in enumerate(centers):
 for j in range(24):
  x=cx+random.gauss(0,.42);y=cy+random.gauss(0,.35)
  points.append((x,y,i))
b=''
for k in range(9):
 b+=path([(50+t*5.3,315-k*14-45*math.sin(t/28+k/9)) for t in range(95)],'#a7b7a4',.6,.38)
for k in range(12):
 b+=path([(75+k*39+v*2,312-v*6-43*math.sin(k/3+v/30)) for v in range(25)],'#a7b7a4',.6,.3)
for x,y,i in points:
 px=300+x*112+y*20;py=204-y*74+x*6
 b+=circle(px,py,3.4,colors[i],.76)
 b+=circle(px,py,6.4,colors[i],.08)
b+=path([(73,319),(526,319)],ink,.7,.35)+path([(73,319),(73,70)],ink,.7,.35)
svg('geometry',b)
# Pairwise Euclidean distances of the exact same coordinates.
b='';dist=lambda a,c:math.hypot(a[0]-c[0],a[1]-c[1]);maxd=max(dist(a,c) for a in points for c in points)
for i,a in enumerate(points):
 for j,c in enumerate(points):
  v=dist(a,c)/maxd
  rgb=tuple(round(x+(y-x)*v) for x,y in [(239,50),(235,78),(210,91)])
  b+=f'<rect x="{142+j*3.3:.2f}" y="{31+i*3.3:.2f}" width="3.4" height="3.4" fill="rgb{rgb}"/>'
svg('matrix',b)
# Two abstract hemispheres made of points; no anatomical claims.
b=''; nodes=[]
for half in [-1,1]:
 for k in range(82):
  angle=random.random()*2*math.pi;r=math.sqrt(random.random())
  x=300+half*76+math.cos(angle)*105*r;y=190+math.sin(angle)*128*r
  nodes.append((x,y,half))
for i,(x,y,h) in enumerate(nodes):
 candidates=sorted([(math.hypot(x-x2,y-y2),j) for j,(x2,y2,h2) in enumerate(nodes) if j!=i and h2==h])[:3]
 for d,j in candidates:
  x2,y2,_=nodes[j];b+=path([(x,y),(x2,y2)],blue if h<0 else ochre,.6,.35)
 b+=circle(x,y,1.8,blue if h<0 else ochre,.75)
for k in range(4):
 pts=[(45+t*5.2,320+12*math.sin(t/10+k*.8)+k*5) for t in range(98)]
 b+=path(pts,colors[k],1,.35)
svg('states',b,'#eeece2')
# Abstract feature matrix, deliberately without result labels or statistical values.
b=''
for i in range(16):
 for j in range(16):
  val=(math.sin(i*.53+j*.22)+math.cos(i*.4-j*.68)+2)/4
  c=[round(a+(z-a)*val) for a,z in [(44,208),(78,169),(95,93)]]
  b+=f'<rect x="{135+j*21}" y="{25+i*21}" width="20" height="20" fill="rgb{tuple(c)}"/>'
b+='<circle cx="168" cy="70" r="50" fill="#f5f1e8" opacity=".83"/><circle cx="168" cy="70" r="30" fill="none" stroke="#8d9c87" stroke-width="1"/>'
b+='<path d="M125 70H210M168 28V112" fill="none" stroke="#aab49b" stroke-width=".6"/>'
svg('features',b,'#eceadf')
# EEG-like curves: purely analytic wave functions, never recordings.
b=''
for x in range(50,560,50):b+=path([(x,35),(x,338)],'#bbc4b6',.6,.45)
for y in range(55,340,35):b+=path([(40,y),(560,y)],'#bbc4b6',.6,.45)
b+='<rect x="325" y="35" width="57" height="303" fill="#b4a276" opacity=".18"/>'
for k in range(7):
 pts=[]
 for x in range(40,561,2):
  y=65+k*40+6*math.sin(x*.105+k)+4*math.sin(x*.247+k*2)+2.3*math.cos(x*.51)
  y+=18*math.exp(-((x-351)/16)**2)*math.sin(x*.22+k)
  pts.append((x,y))
 b+=path(pts,blue if k%2==0 else '#7b8876',1,.9)
svg('eeg',b,'#edf0e7')
print('Created five original conceptual SVG illustrations.')
