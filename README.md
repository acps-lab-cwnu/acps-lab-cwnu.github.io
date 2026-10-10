# Prof. Sung-Ju Park — Academic Portfolio & Lab Website

Official GitHub Pages website for **Professor Sung-Ju Park (박성주 교수님)**, head of the **Applied Cyber-Physical Systems Laboratory (ACPS Lab / 응용 사이버물리시스템 연구실)** at the Department of Artificial Intelligence & Defense Engineering, Changwon National University.

- **Institution:** Department of Artificial Intelligence & Defense Engineering (인공지능디펜스공학과), Changwon National University (from March 2027; previously Tongmyong University)
- **Leadership Roles:** Vice Director of RISE Center (지역혁신중심 대학지원체계사업 부단장), Director of I-URP Center (대학혁신연구단지 조성사업단장), Board Director of SNAK (대한조선학회 홍보이사 & 플랫폼홍보활성화위원장), Technical Advisory Committee Member of DAPA (방위사업청 함정사업부 자문위원)

---

## 🌟 Key Research Scope

1. **Structural Mechanics & Extreme Environment Material DB**: 3D ductile fracture strain surfaces (Hosford-Coulomb), cryogenic (-197°C) & high strain rate testing, hydrogen embrittlement for subsea pipelines.
2. **Underwater Radiated Noise (URN) & Target Strength (TS)**: Structure-borne noise transfer function analysis, bubble layer insertion loss, small-tank cumulative energy TS measurement, hyperelastic resilient mounts.
3. **Radar Cross Section (RCS) & Naval Survivability**: Anti-ship missile hit location estimation algorithms, panel-type radar reflectors, surface ship concept stage RCS estimation.
4. **AI-Driven Structural Engineering (PINN / DNN)**: Physics-Informed Neural Networks (PINN) and Deep Neural Networks (DNN) for submarine pressure hull collapse strength and optimal stiffened cylinder design.
5. **Digital Twin & Autonomous Systems**: Unity-ROS2 virtual-real synchronization framework for remote-controlled unmanned surface vessels (USV) and structural health monitoring (SHM).

---

## 📁 구조

```text
index.html         첫 페이지: 소개, 통계(자동 계산), 대표 논문, News, Join Us
research.html      연구 분야 5개 + 실험 장비
projects.html      연구과제 (data/projects.js에서 자동 생성, 진행중/완료 자동 판정)
publications.html  논문·학회·특허·기술이전 (data/publications.js에서 자동 생성)
people.html        지도교수 이력·수상, 지도학생 수상
contact.html       연락처, 지도
data/              ← 내용은 여기서 고칩니다
js/main.js         data를 화면에 그리는 코드 (고칠 일 없음)
```

## ✏️ 내용 고치기

| 하고 싶은 것 | 고칠 파일 | 방법 |
|---|---|---|
| 논문 추가 | `data/publications.js` | `"journal": [` 바로 아래에 항목 복사·붙여넣기. `"featured": true`면 첫 페이지에 표시 |
| 과제 추가 | `data/projects.js` | 맨 위에 항목 추가. `end`(YYYY.MM)가 지나면 자동으로 '완료' |
| 수상·소식 추가 | `data/news.js` | 맨 위에 추가. `type`은 Faculty Award / Student Award / Event. People 페이지 수상 목록도 여기서 자동 생성 |
| 소개·연구분야 | `index.html`, `research.html` | HTML 직접 수정 |

- 항목 사이에는 쉼표(`,`)가 필요하고, **마지막 항목 뒤에는 쉼표를 붙이지 않습니다.** 틀리면 해당 목록이 통째로 안 보입니다.
- 첫 페이지의 논문·과제·기술이전 숫자는 data에서 자동으로 셉니다. 직접 고치지 마세요.
- 로컬 미리보기: 폴더에서 `python -m http.server 8000` 실행 후 http://localhost:8000

## 🚀 배포 (GitHub Pages)

- 저장소: `https://github.com/acps-lab-cwnu/acps-lab-cwnu.github.io`
- 사이트: `https://acps-lab-cwnu.github.io`
- 수정 후 `git add -A` → `git commit -m "메시지"` → `git push` 하면 1~2분 뒤 자동 반영

---

## 📬 Contact & Inquiries

- **Email:** [parksj0314@tu.ac.kr](mailto:parksj0314@tu.ac.kr) / [parksj0314@gmail.com](mailto:parksj0314@gmail.com)
- **Office:** Changwon National University, 20 Changwondaehak-ro, Uichang-gu, Changwon-si, Gyeongsangnam-do 51140, Republic of Korea

&copy; 2026 Prof. Sung-Ju Park. All rights reserved.
