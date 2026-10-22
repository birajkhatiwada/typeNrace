import time,sys
from playwright.sync_api import sync_playwright
URL='http://localhost:8765/index.html?server=ws://localhost:8788'
ARGS=['--use-gl=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist']
with sync_playwright() as p:
    b=p.chromium.launch(args=ARGS); logs=[]
    def mk(name):
        pg=b.new_page(viewport={'width':800,'height':500})
        pg.on('pageerror',lambda e: logs.append(name+' PAGEERR '+str(e)[:300])); pg.on('console',lambda m: logs.append(name+' C '+m.text[:200]) if m.type=='error' else None)
        pg.goto(URL,timeout=120000); pg.wait_for_function("window.__tt && window.__tt.state==='profile'",timeout=150000); return pg
    A=mk('A'); B=mk('B')
    A.fill('#pName','Alice'); B.fill('#pName','Bob')
    # B tries a bad code first
    B.click('#codeBtn'); B.fill('#jCode','ZZZZ-999'); B.click('#jGo'); time.sleep(1.5); print('bad code ->',B.inner_text('#jErr'))
    A.click('#goBtn'); A.wait_for_function("window.__tt.state==='garage'",timeout=30000); time.sleep(1.5)
    code=A.inner_text('#rcTxt'); print('code',code,'| A msg:',A.inner_text('#roomMsg').replace('\n',' '),'| btn:',A.inner_text('#startBtn').replace('\n',' '))
    A.click('#startBtn'); time.sleep(.5); print('A solo OK ->',A.evaluate("window.__tt.state"))
    B.fill('#jCode',code); B.click('#jGo'); B.wait_for_function("window.__tt.state==='garage'",timeout=30000); time.sleep(2)
    print('A sees',A.inner_text('#roomMsg').replace('\n',' '),'| joined cards',A.evaluate("document.querySelectorAll('#joined .alt:not(.slot)').length"))
    print('B sees',B.inner_text('#roomMsg').replace('\n',' '),'| joined cards',B.evaluate("document.querySelectorAll('#joined .alt:not(.slot)').length"))
    A.click('#startBtn'); time.sleep(.8); print('A btn',A.inner_text('#startBtn').replace('\n',' '),'| B msg',B.inner_text('#roomMsg').replace('\n',' '))
    B.click('#startBtn')
    for n,pg in (('A',A),('B',B)): pg.wait_for_function("['countdown','racing'].includes(window.__tt.state)",timeout=60000)
    print('both racing; racers A',A.evaluate("window.__tt.racers.map(r=>r.name+(r.remote?'(remote)':''))"),'B',B.evaluate("window.__tt.racers.map(r=>r.name+(r.remote?'(remote)':''))"))
    print('map A/B',A.evaluate("window.__tt.cells.length"),B.evaluate("window.__tt.cells.length"))
    for pg in (A,B): pg.wait_for_function("window.__tt.state==='racing'",timeout=200000)
    A.evaluate("window.__tt.player.dist+=60"); time.sleep(8)
    print('B sees Alice dist',B.evaluate("Math.round(window.__tt.racers.find(r=>r.remote).dist)"),'(Alice real',A.evaluate("Math.round(window.__tt.player.dist)"),')')
    A.evaluate("window.__tt.finishNow()"); time.sleep(1)
    B.evaluate("window.__tt.finishNow()")
    A.wait_for_function("!document.getElementById('results').hidden",timeout=60000)
    print('results shown'); 
    # leave mid-lobby: new room via results -> garage
    A.click('#garageBtn'); time.sleep(2); print('A new code',A.inner_text('#rcTxt'),'(old',code,')')
    print('\n'.join(logs[:20])); b.close()
