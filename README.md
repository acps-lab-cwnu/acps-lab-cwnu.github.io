# Prof. Sung-Ju Park — Academic Portfolio & Lab Website

Official GitHub Pages website for **Professor Sung-Ju Park (박성주 교수님)**, head of the **Applied Cyber-Physical Systems Laboratory (ACPS Lab / 응용 사이버물리시스템 연구실)** at the Department of Artificial Intelligence & Defense Engineering, Changwon National University.

- **Institution:** Department of Artificial Intelligence & Defense Engineering (인공지능디펜스공학과), Changwon National University (previously Tongmyong University)
- **Site:** https://acps-lab-cwnu.github.io · **Repository:** https://github.com/acps-lab-cwnu/acps-lab-cwnu.github.io

---

## 📁 구조

```text
index.html         Home: 소개, 숫자(자동), 연구 분야 4개 카드, 대표 논문, News 5개, 교수·모집 카드
people.html        약력, Career Milestone Summary(연표+3단계), Professional Service
research.html      연구 분야 4개(방법·그림·대표 논문/과제 자동) + 실험 장비
projects.html      연구과제 (data에서 자동, 진행중/완료 자동 판정)
publications.html  저널·학회·특허·기술이전·저서 (data에서 자동)
news.html          수상·소식 (data에서 자동, 구분 필터)
contact.html       Join Us & Contact
data/              ← 자주 바뀌는 내용은 여기서만 고칩니다
images/            로고(logo-*.svg), 공유 이미지(og-image.png), 연구 그림(trajectory/)
```

## ✏️ 무엇을 어디서 고치나

| 하고 싶은 것 | 파일 | 요령 |
|---|---|---|
| 수상·소식 | `data/news.js` | 맨 위에 한 줄 추가. `type`: Faculty Award / Student Award / Event |
| 논문 | `data/publications.js` | `"journal": [` 바로 아래에 추가. `thrust` 필수, `"featured": true`면 Home 대표 논문 |
| 학회·특허·기술이전 | `data/publications.js` | 해당 목록 맨 위에 `{"year": 2027, "text": "..."}` 또는 문자열 |
| 연구과제 | `data/projects.js` | 맨 위에 추가. `end`(YYYY.MM)가 지나면 자동으로 완료. `thrust` 필수 |
| 약력·학회 활동·연표 | `people.html` | HTML 직접 수정. 학회 활동은 Present → 진행 중 임기 → 종료 순 |
| 연구 분야 설명·그림 | `research.html` | HTML 직접 수정 |
| 소개 문구 | `index.html` | HTML 직접 수정 |

- `thrust` 값: `structures`(구조) · `acoustics`(음향) · `survivability`(생존성) · `ai-twin`(AI·디지털 트윈) · `""`(해당 없음)
- 쉼표: 항목 사이에는 쉼표, **마지막 항목 뒤에는 쉼표 없음.** 틀리면 그 목록이 통째로 안 보이고 GitHub이 "Validate data" 실패 메일을 보냅니다.
- 숫자(과제·논문·학회·기술이전·학생 수상)는 data에서 자동으로 셉니다. 직접 고치지 않습니다.
- `css/`, `js/`, `data/` 파일을 고쳤으면 모든 HTML의 `?v=…` 값을 새 값(예: `20261101a`)으로 바꿉니다. 방문자 브라우저가 예전 파일을 쓰지 않게 합니다.
- 로컬 미리보기: 이 폴더에서 `python -m http.server 8000` → http://localhost:8000

## 🚀 반영(배포)

- PC: `git pull` → 수정 → `git add -A` → `git commit -m "메시지"` → `git push`
- GitHub 웹: 파일 열기 → 연필 아이콘 → 수정 → **Commit changes** (이후 PC에서 작업할 땐 먼저 `git pull`)
- 1~2분 뒤 반영. 저장소 **Actions** 탭에서 초록 체크 확인. 화면이 그대로면 Ctrl+F5
- 되돌리기: GitHub에서 해당 커밋 → **Revert**, 또는 Claude에게 "어제 수정 되돌려줘"
- 카카오톡 미리보기가 예전 그대로면 [카카오 공유 디버거](https://developers.kakao.com/tool/debugger/sharing)에서 캐시 초기화

---

## 📬 Contact & Inquiries

- **Email:** [parksj0314@tu.ac.kr](mailto:parksj0314@tu.ac.kr) / [parksj0314@gmail.com](mailto:parksj0314@gmail.com)
- **Office:** Changwon National University, 20 Changwondaehak-ro, Uichang-gu, Changwon-si, Gyeongsangnam-do 51140, Republic of Korea

&copy; 2026 Prof. Sung-Ju Park. All rights reserved.
