# New.md

ไฟล์นี้เป็นไอเดียเท่านั้น ห้ามเอาไปแก้โค้ดจริงในรอบนี้

เป้าหมายคือจดว่าอนาคตอยากเพิ่มอะไร หรือส่วนไหนน่าขัดให้เว็บดูสวยขึ้น ลื่นขึ้น และเป็นตัวตนของ summer / 0ii มากขึ้น

## กติกา

- ห้าม implement จากไฟล์นี้ทันที
- ห้ามลบ animation เดิมทิ้ง
- ห้ามทำให้เว็บหนักขึ้นแบบไม่จำเป็น
- ถ้าจะทำจริงภายหลัง ให้เลือกทีละจุด แล้วเช็กมือถือก่อนเสมอ

## Hero

- ปรับ copy ให้ชัดขึ้นว่าเป็นนักเรียนสาย Sci Com ที่สนใจ Cyber Security / Pentesting
- ทำ code card ให้มี cursor blink หรือ line highlight เบา ๆ แบบ editor จริง
- เพิ่ม micro animation ตอน hover ปุ่ม GitHub ให้ icon ขยับนิดเดียว
- เพิ่ม decorative background จากรูปจริงใน `img/idk` ถ้ามีไฟล์ภาพพร้อมแล้ว

## Navbar

- เพิ่ม active state ให้ theme switch ดูรู้ทันทีว่าอยู่ moon หรือ sun
- ทำ mobile menu ให้เปิดแบบ slide/fade ที่นุ่มขึ้น แต่ยังเบา
- เปลี่ยน logo จาก `MySite` เป็นชื่อจริง เช่น `0ii.dev` ถ้าต้องการ identity ชัดขึ้น

## About

- แก้ข้อความ EN/TH ให้เป็นเสียงของเจ้าของเว็บมากขึ้น ไม่ generic เกินไป
- เพิ่ม hover depth ให้ bento cards เช่น border glow เบา ๆ ตามเมาส์
- ทำ card `Tech Stack` ให้แต่ละ pill กดแล้วแสดง note สั้น ๆ ได้ในอนาคต

## Music Vibe

- เพิ่มสถานะเพลงที่กำลังเล่นให้เด่นขึ้น เช่น border สีฟ้าอ่อนหรือ glow รอบ card
- บนมือถืออาจทำ progress bar ให้จับง่ายขึ้นอีกนิด
- เพิ่ม placeholder fallback ถ้ารูปหรือไฟล์เพลงโหลดไม่ได้
- เพิ่มชื่อ album/เพลงแบบแก้ใน data ง่าย ไม่ต้องไล่แก้ HTML หลายจุด

## Skills

- ทำ orbit icons ให้กดแล้วโชว์รายละเอียดสกิลตรงกลาง globe
- เพิ่ม skill panel ขนาดเล็ก มี title, level, currently learning, next goal
- ถ้าเพิ่ม icon มากขึ้น ควรจำกัดจำนวนบนมือถือเพื่อไม่ให้แน่นเกิน
- ลดจำนวน dot globe บนมือถือรุ่นเก่า ถ้าเจออาการกระตุก

## Projects

- ทำ project card ให้กดดูรายละเอียดได้ เช่น modal หรือ expanded card
- เพิ่ม link demo / GitHub ต่อ project
- เพิ่มสถานะโปรเจกต์ เช่น Learning, Finished, Experiment
- mobile carousel ตอนนี้ดีแล้ว อนาคตเพิ่ม scroll hint เล็ก ๆ ได้

## Contact

- ปรับปุ่ม `guns.lol` เป็น URL profile จริง เช่น `https://guns.lol/username`
- เพิ่ม copy ไทย/อังกฤษใน contact ให้เป็นธรรมชาติกว่านี้
- เพิ่ม icon animation ตอน hover แบบเบา ๆ ไม่หมุนเยอะ
- เช็กว่า light theme ยังอ่านง่ายใน contact card

## Supporter

- แทนช่อง `Profile` ด้วยรูปจริงของแต่ละคน
- เพิ่มชื่อจริง/alias และ short about ของ supporter
- ถ้ามีเกิน 3 คน อาจเปลี่ยนเป็น horizontal scroll บนมือถือ
- เพิ่มปุ่มปิด panel หรือกดนอก panel เพื่อปิด ถ้ารู้สึกว่า UX ยังไม่ชัด

## Performance

- รวมข้อมูล music/player เป็น array ใน JS แล้ว render ลด HTML ซ้ำในอนาคต
- จำกัด animation ที่ใช้ blur ให้อยู่เฉพาะจุดสำคัญ
- เพิ่ม `loading="lazy"` ให้รูปที่ไม่ได้อยู่หน้าแรก
- ทดสอบบนมือถือจริงก่อนเพิ่ม effect ใหม่ทุกครั้ง

## Accessibility

- เพิ่ม `aria-expanded` ให้ mobile menu ถ้ายังไม่ครบ
- เช็ก contrast ตอนเปิด light theme
- เพิ่ม focus state ให้ปุ่มทุกตัว โดยเฉพาะ supporter/theme/music controls
- ปุ่มหรือ card ที่กดได้ควรใช้ `<button>` หรือ `<a>` จริง ไม่ใช่แค่ `<div>`
