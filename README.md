# MySite Portfolio

เว็บพอร์ตโฟลิโอส่วนตัวของ summer / 0ii โทนมืด ขาวดำ มี animation, bilingual text, music section, skills globe, projects, contact และ supporter panel

## ทำอะไรไปแล้ว

- จัดหน้าเว็บหลักด้วย `index.html`, `style.css`, `script.js`
- ทำ navbar แบบ floating รองรับ desktop/mobile
- เพิ่มปุ่มสลับภาษา EN/TH
- เพิ่มปุ่ม theme switch แบบพระจันทร์/ดวงอาทิตย์ โดยค่าเริ่มต้นเป็นพระจันทร์หรือ dark mode
- ทำ hero section พร้อม typewriter, stats, และ code card
- เปลี่ยน code card เป็น `python.py` และเนื้อหาเกี่ยวกับ Python skill
- เพิ่ม animation dedication stat ให้แตก/แฟลชก่อนกลายเป็น `inf`
- ทำ About section แบบ bento card พร้อม mouse shine
- ทำ Music Vibe section พร้อม player, progress bar, volume และ mobile layout แบบ list card
- ทำ Skills section เป็น globe canvas พร้อม orbit icon และเพิ่ม glow/ring ให้ไม่มืดโล่งเกินไป
- ทำ Projects section พร้อม responsive mobile แบบเลื่อนแนวนอน
- ทำ Contact section พร้อม glow วิบวับด้านหลังและปุ่ม GitHub, Instagram, guns.lol, Email
- เพิ่มปุ่ม `Supporter` ใต้ contact card
- เพิ่ม Supporter UI แบบ 3 คอลัมน์ พร้อมช่อง profile, quote, Name และ About this person
- ดัก internal link ไม่ให้ URL โชว์ `#hero`, `#about`, `#projects`, `#contact`
- เพิ่ม text shimmer สีฟ้าแบบ CSS-only ให้ข้อความหลัก ๆ ทั่วเว็บ

## ไฟล์สำคัญ

- `index.html` - โครงหน้าเว็บและ content ทั้งหมด
- `style.css` - layout, responsive, animation, theme, shimmer, contact glow และ supporter UI
- `script.js` - language toggle, theme toggle, particles, nav scroll, music player, supporter panel, stats animation และ globe canvas
- `server.js` - local static server
- `start.bat` - ตัวเปิด server บน Windows แบบพอร์ต 80
- `start.sh` - ตัวเปิด server บน Linux

## วิธีรัน

รันที่พอร์ต 2522:

```bat
node server.js 2522
```

แล้วเปิด:

```text
http://localhost:2522/
```

ถ้าใช้ `start.bat` จะเปิดด้วยพอร์ต 80 ตามค่าที่อยู่ในไฟล์นั้น
