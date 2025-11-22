# 커피 주문 앱
## 1. 프로젝트 개요
### 1.1 프로젝트명
커피 주문 앱
### 1.2 프로젝트 목적
사용자가 커피 메뉴를 주문하고, 관리자가 주문을 관리할 수 있는 간단한 풀스택 웹 앱
### 1.3 개발 범위
-주문하기 화면(메뉴 선택 및 장바구니 기능)
-관리자 화면(재고 관리 및 주문 상태 관리)
- 데이터를 생성/조회/수정/삭제할 수 있는 기능

## 2. 기술 스택
- 프런트엔드 : HTML, CSS, 리액트, 자바스크립트
 백엔드 : Node.js, Express
 - 데이터베이스 : PostgreSQL

 ## 3. 기본 사항
 - 프론트엔드와 백엔드를 따로 개발
 - 기본적인 웹 기술만 사용
 - 학습 목적이므로 사용자 인증이나 결제 기능은 제외
 - 메뉴는 커피 메뉴만 있음

## 4. 화면별 상세 설계

### 4.1 주문하기 화면

#### 4.1.1 화면 구조
주문하기 화면은 헤더, 메인 콘텐츠 영역, 사이드바, 하단 섹션으로 구성됩니다.

#### 4.1.2 헤더 영역 (Header)
- **배경색**: 흰색 (#FFFFFF)
- **레이아웃**: 
  - 왼쪽: 앱 로고 및 브랜드명 표시
  - 중앙: 네비게이션 메뉴 (선택적, 주문하기 화면에서는 간소화 가능)
  - 오른쪽: 장바구니 아이콘 (쇼핑백 아이콘)
- **고정 위치**: 화면 상단에 고정 (스크롤 시에도 유지)
- **장바구니 아이콘**: 
  - 클릭 시 장바구니 모달/사이드바 표시
  - 장바구니에 담긴 상품 개수 배지 표시 (있는 경우)

#### 4.1.3 메인 콘텐츠 영역 (Main Content)
- **배경색**: 어두운 회색 (#2C2C2C 또는 유사한 색상)
- **제목 영역**:
  - 대제목: "HANNA MENU" (흰색 텍스트)
  - 부제목: "ALL MENU" (분홍색, 굵은 글씨)
- **브레드크럼 네비게이션**:
  - 위치: 제목 하단
  - 형식: "홈 > 메뉴소개 > 전체메뉴" (흰색 텍스트)
  - 클릭 가능한 링크로 구현 (현재는 주문하기 화면이므로 "홈 > 주문하기" 등으로 변경 가능)
- **메뉴 목록 영역**:
  - 커피 메뉴 카드들이 그리드 형태로 배치
  - 각 메뉴 카드에는:
    - 메뉴 이미지 (있는 경우)
    - 메뉴명
    - 가격
    - "장바구니에 담기" 버튼
  - 카드 배경: 흰색 또는 밝은 회색
  - 카드 호버 효과: 약간의 그림자 또는 색상 변화

#### 4.1.4 오른쪽 사이드바 (Floating Sidebar)
- **위치**: 화면 오른쪽 가장자리에 고정
- **형태**: 세로로 배치된 원형 또는 둥근 사각형 버튼들
- **배경색**: 어두운 회색 (메인 콘텐츠와 유사)
- **텍스트 색상**: 흰색
- **버튼 구성** (위에서 아래 순서):
  1. 고객센터 전화번호: "1588-0656" (클릭 시 전화 걸기)
  2. 가맹점 문의: "가맹점 인수 상담" (선택적)
  3. 고객센터 문의: "고객센터 문의/접수" (선택적)
  4. 고객센터 전화번호: "고객센터 1588-8298" (클릭 시 전화 걸기)
  5. 매장 정보: "(날짜) 누적 N호 오픈" (선택적, 정보 표시용)
- **스크롤 동작**: 화면 스크롤 시 함께 이동 (sticky 또는 fixed)

#### 4.1.5 하단 섹션 (Bottom Section)
- **배경색**: 밝은 분홍색 (#FF69B4 또는 유사한 색상)
- **텍스트**: 
  - "행복을 선사하는 다양한 음료" (검은색, 굵은 글씨)
  - "음료와 잘 어울리는 다양한 디저트" (검은색, 굵은 글씨)
- **하단 화살표**: 더 많은 콘텐츠가 있음을 나타내는 하단 화살표 아이콘 (선택적)

#### 4.1.6 장바구니 기능
- **장바구니 모달/사이드바**:
  - 헤더의 장바구니 아이콘 클릭 시 표시
  - 담긴 메뉴 목록 표시
  - 각 메뉴별 수량 조절 (증가/감소)
  - 메뉴 삭제 기능
  - 총 주문 금액 표시
  - "주문하기" 버튼
- **장바구니에 담기**:
  - 메뉴 카드의 "장바구니에 담기" 버튼 클릭 시
  - 장바구니에 해당 메뉴 추가
  - 토스트 메시지 또는 알림으로 추가 완료 표시

#### 4.1.7 반응형 디자인
- 데스크톱: 전체 레이아웃 유지
- 태블릿: 메뉴 그리드 열 수 조정
- 모바일: 
  - 사이드바는 하단으로 이동하거나 햄버거 메뉴로 통합
  - 메뉴 카드는 1-2열로 조정
  - 장바구니는 하단 시트 형태로 표시

#### 4.1.8 색상 팔레트
- **주요 색상**:
  - 헤더 배경: #FFFFFF (흰색)
  - 메인 배경: #2C2C2C (어두운 회색)
  - 강조 색상: #FF69B4 (분홍색)
  - 텍스트 (밝은 배경): #000000 (검은색)
  - 텍스트 (어두운 배경): #FFFFFF (흰색)
  - 버튼/링크: 분홍색 또는 브랜드 색상

#### 4.1.9 인터랙션
- 메뉴 카드 호버 효과
- 장바구니 아이콘 클릭 시 애니메이션
- 장바구니에 추가 시 피드백 (토스트 메시지)
- 부드러운 스크롤 효과
- 로딩 상태 표시 (메뉴 로딩 중)

### 4.2 관리자 화면

#### 4.2.1 화면 구조
관리자 화면은 헤더, 메인 콘텐츠 영역, 사이드바, 하단 섹션으로 구성되며, 주문하기 화면과 유사한 레이아웃을 가집니다.

#### 4.2.2 헤더 영역 (Header)
- **배경색**: 흰색 (#FFFFFF)
- **레이아웃**: 
  - 왼쪽: 앱 로고 및 브랜드명 표시
  - 중앙: 네비게이션 메뉴 (선택적)
  - 오른쪽: "주문하기 화면으로 이동" 버튼 또는 링크
- **고정 위치**: 화면 상단에 고정 (스크롤 시에도 유지)

#### 4.2.3 메인 콘텐츠 영역 (Main Content)
- **배경색**: 어두운 회색 (#2C2C2C 또는 유사한 색상)
- **제목 영역**:
  - 대제목: "HANNA ADMIN" (흰색 텍스트)
  - 부제목: "관리자 대시보드" (분홍색, 굵은 글씨)
- **브레드크럼 네비게이션**:
  - 위치: 제목 하단
  - 형식: "홈 > 관리자" (흰색 텍스트)
  - 클릭 가능한 링크로 구현
- **탭/버튼 영역**:
  - 위치: 브레드크럼 하단
  - 두 개의 탭 버튼 제공:
    1. "재고현황" 탭 (기본 선택)
    2. "주문현황" 탭
  - 활성 탭: 분홍색 배경 또는 밑줄 표시
  - 비활성 탭: 어두운 회색 배경, 흰색 텍스트
  - 클릭 시 해당 화면으로 전환

#### 4.2.4 재고현황 화면 (Inventory Status)
- **표시 조건**: "재고현황" 탭 클릭 시 표시
- **메뉴 목록 영역**:
  - 커피 메뉴 목록이 테이블 또는 카드 형태로 배치
  - 각 메뉴 항목에는:
    - 메뉴명
    - 현재 재고 수량
    - 재고 수량 입력 필드 (수정 가능)
    - "재고 수정" 버튼
    - 재고 부족 경고 표시 (재고가 일정 수준 이하일 경우)
  - 테이블 형태인 경우:
    - 컬럼: 메뉴명, 현재 재고, 수정할 재고, 수정 버튼
    - 행별로 수정 가능
  - 카드 형태인 경우:
    - 각 메뉴별 카드에 재고 정보와 수정 기능 포함
- **재고 수정 기능**:
  - 재고 수량 입력 필드에 새 수량 입력
  - "재고 수정" 버튼 클릭 시 데이터베이스 업데이트
  - 수정 완료 시 토스트 메시지 표시
  - 수정 실패 시 에러 메시지 표시

#### 4.2.5 주문현황 화면 (Order Status)
- **표시 조건**: "주문현황" 탭 클릭 시 표시
- **주문 목록 영역**:
  - 주문 목록이 테이블 또는 카드 형태로 배치
  - 각 주문 항목에는:
    - 주문 번호 (또는 주문 ID)
    - 주문 시간
    - 주문 메뉴 목록 (메뉴명, 수량)
    - 총 주문 금액
    - 주문 상태 (대기중, 준비중, 완료, 취소)
    - 주문 상태 변경 드롭다운 또는 버튼
    - "상태 변경" 버튼
  - 테이블 형태인 경우:
    - 컬럼: 주문번호, 주문시간, 주문내용, 금액, 상태, 상태변경, 액션
    - 최신 주문이 상단에 표시
  - 카드 형태인 경우:
    - 각 주문별 카드에 모든 정보 포함
    - 상태별로 색상 구분 (대기중: 노란색, 준비중: 파란색, 완료: 초록색, 취소: 빨간색)
- **주문 상태 변경 기능**:
  - 주문 상태 드롭다운에서 새 상태 선택
  - "상태 변경" 버튼 클릭 시 데이터베이스 업데이트
  - 상태 변경 완료 시 토스트 메시지 표시
  - 상태 변경 실패 시 에러 메시지 표시
- **주문 필터링** (선택적):
  - 상태별 필터 버튼 (전체, 대기중, 준비중, 완료, 취소)
  - 클릭 시 해당 상태의 주문만 표시

#### 4.2.6 오른쪽 사이드바 (Floating Sidebar)
- **위치**: 화면 오른쪽 가장자리에 고정
- **형태**: 세로로 배치된 원형 또는 둥근 사각형 버튼들
- **배경색**: 어두운 회색 (메인 콘텐츠와 유사)
- **텍스트 색상**: 흰색
- **버튼 구성** (위에서 아래 순서):
  1. "주문하기 화면" 버튼 (주문하기 화면으로 이동)
  2. "전체 재고 현황" 버튼 (재고현황 탭으로 이동)
  3. "전체 주문 현황" 버튼 (주문현황 탭으로 이동)
  4. "도움말" 버튼 (선택적)
- **스크롤 동작**: 화면 스크롤 시 함께 이동 (sticky 또는 fixed)

#### 4.2.7 하단 섹션 (Bottom Section)
- **배경색**: 밝은 분홍색 (#FF69B4 또는 유사한 색상)
- **텍스트**: 
  - "효율적인 재고 관리로 신선한 커피를 제공합니다" (검은색, 굵은 글씨)
  - "실시간 주문 현황을 확인하고 관리하세요" (검은색, 굵은 글씨)
- **하단 화살표**: 더 많은 콘텐츠가 있음을 나타내는 하단 화살표 아이콘 (선택적)

#### 4.2.8 반응형 디자인
- 데스크톱: 전체 레이아웃 유지
- 태블릿: 
  - 테이블/카드 그리드 열 수 조정
  - 탭 버튼 크기 조정
- 모바일: 
  - 사이드바는 하단으로 이동하거나 햄버거 메뉴로 통합
  - 테이블은 카드 형태로 변경
  - 탭 버튼은 전체 너비로 확장
  - 입력 필드와 버튼 크기 확대

#### 4.2.9 색상 팔레트
- **주요 색상**:
  - 헤더 배경: #FFFFFF (흰색)
  - 메인 배경: #2C2C2C (어두운 회색)
  - 강조 색상: #FF69B4 (분홍색)
  - 텍스트 (밝은 배경): #000000 (검은색)
  - 텍스트 (어두운 배경): #FFFFFF (흰색)
  - 버튼/링크: 분홍색 또는 브랜드 색상
  - 주문 상태 색상:
    - 대기중: #FFD700 (노란색)
    - 준비중: #4A90E2 (파란색)
    - 완료: #50C878 (초록색)
    - 취소: #FF6B6B (빨간색)

#### 4.2.10 인터랙션
- 탭 전환 시 부드러운 페이드 효과
- 재고 수정 시 입력 필드 포커스 효과
- 주문 상태 변경 시 색상 전환 애니메이션
- 버튼 호버 효과
- 데이터 업데이트 시 토스트 메시지 표시
- 로딩 상태 표시 (데이터 로딩 중)
- 에러 발생 시 에러 메시지 표시

## 5. 백엔드 개발

### 5.1 데이터 모델

#### 5.1.1 Menus (메뉴)
메뉴 정보를 저장하는 테이블입니다.

**필드:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT): 메뉴 고유 ID
- `name` (VARCHAR, NOT NULL): 커피 메뉴 이름
- `description` (TEXT): 메뉴 설명
- `price` (INTEGER, NOT NULL): 메뉴 가격 (원 단위)
- `image` (VARCHAR): 메뉴 이미지 URL 또는 경로 (선택적)
- `stock` (INTEGER, NOT NULL, DEFAULT 0): 재고 수량
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 생성 일시
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP): 수정 일시

**제약 조건:**
- `price`는 0 이상의 정수
- `stock`은 0 이상의 정수

#### 5.1.2 Options (옵션)
메뉴 옵션 정보를 저장하는 테이블입니다.

**필드:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT): 옵션 고유 ID
- `name` (VARCHAR, NOT NULL): 옵션 이름 (예: "샷 추가", "휘핑 크림", "시럽 추가" 등)
- `price` (INTEGER, NOT NULL, DEFAULT 0): 옵션 추가 가격 (원 단위)
- `menu_id` (INTEGER, FOREIGN KEY): 연결된 메뉴 ID (Menus 테이블 참조)
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 생성 일시
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP): 수정 일시

**제약 조건:**
- `price`는 0 이상의 정수
- `menu_id`는 Menus 테이블의 id를 참조 (CASCADE DELETE 또는 SET NULL 정책 적용)

#### 5.1.3 Orders (주문)
주문 정보를 저장하는 테이블입니다.

**필드:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT): 주문 고유 ID
- `order_number` (VARCHAR, UNIQUE, NOT NULL): 주문 번호 (예: "ORD-20250120-143000-001")
- `order_date` (TIMESTAMP, NOT NULL, DEFAULT CURRENT_TIMESTAMP): 주문 일시
- `status` (VARCHAR, NOT NULL, DEFAULT '주문 접수'): 주문 상태
  - 가능한 값: '주문 접수', '제조 중', '완료', '취소'
- `total_amount` (INTEGER, NOT NULL): 총 주문 금액 (원 단위)
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 생성 일시
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP): 수정 일시

**제약 조건:**
- `total_amount`는 0 이상의 정수
- `status`는 지정된 값 중 하나여야 함

#### 5.1.4 OrderItems (주문 항목)
주문에 포함된 메뉴와 옵션 정보를 저장하는 테이블입니다.

**필드:**
- `id` (INTEGER, PRIMARY KEY, AUTO_INCREMENT): 주문 항목 고유 ID
- `order_id` (INTEGER, FOREIGN KEY, NOT NULL): 주문 ID  (Orders 테이블 참조)
- `menu_id` (INTEGER, FOREIGN KEY, NOT NULL): 메뉴 ID (Menus 테이블 참조)
- `quantity` (INTEGER, NOT NULL): 주문 수량
- `unit_price` (INTEGER, NOT NULL): 주문 당시 단가 (메뉴 가격 + 옵션 가격)
- `total_price` (INTEGER, NOT NULL): 항목별 총 가격 (unit_price * quantity)
- `options` (JSON 또는 TEXT): 선택된 옵션 정보 (옵션 ID 배열 또는 JSON 형식)
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): 생성 일시

**제약 조건:**
- `quantity`는 1 이상의 정수
- `unit_price`, `total_price`는 0 이상의 정수
- `order_id`는 Orders 테이블의 id를 참조 (CASCADE DELETE 정책 적용)
- `menu_id`는 Menus 테이블의 id를 참조

**관계:**
- Orders와 OrderItems는 1:N 관계
- Menus와 OrderItems는 1:N 관계

### 5.2 사용자 흐름

#### 5.2.1 메뉴 조회 흐름
1. 사용자가 주문하기 화면에 접속합니다.
2. 프런트엔드에서 백엔드 API를 호출하여 메뉴 목록을 요청합니다.
   - API: `GET /api/menus`
3. 백엔드는 데이터베이스의 Menus 테이블에서 메뉴 정보를 조회합니다.
4. 조회된 메뉴 정보를 프런트엔드에 반환합니다.
   - 반환 데이터: 메뉴 ID, 이름, 설명, 가격, 이미지 URL
   - **주의**: 재고 수량(stock)은 관리자 화면에서만 조회되므로 일반 메뉴 조회 API에서는 제외
5. 프런트엔드는 받은 메뉴 정보를 화면에 표시합니다.

#### 5.2.2 장바구니 관리 흐름
1. 사용자가 메뉴 카드에서 "장바구니에 담기" 버튼을 클릭합니다.
2. 프런트엔드는 선택한 메뉴 정보를 클라이언트 측 상태(장바구니)에 추가합니다.
3. 사용자는 장바구니에서 수량을 조절하거나 메뉴를 삭제할 수 있습니다.
4. 모든 장바구니 관리 작업은 프런트엔드에서만 처리되며, 이 단계에서는 백엔드와 통신하지 않습니다.

#### 5.2.3 주문 생성 흐름
1. 사용자가 장바구니에서 "주문하기" 버튼을 클릭합니다.
2. 프런트엔드는 주문 정보를 백엔드 API로 전송합니다.
   - API: `POST /api/orders`
   - 요청 데이터:
     ```json
     {
       "items": [
         {
           "menu_id": 1,
           "quantity": 2,
           "options": [1, 3],  // 옵션 ID 배열 (선택적)
           "unit_price": 4500,
           "total_price": 9000
         }
       ],
       "total_amount": 9000
     }
     ```
3. 백엔드는 주문 정보를 검증합니다.
   - 각 메뉴의 재고 수량 확인
   - 주문 수량이 재고 수량을 초과하지 않는지 확인
   - 메뉴 ID, 옵션 ID 유효성 확인
4. 검증이 통과하면:
   - Orders 테이블에 주문 정보를 저장합니다.
     - 주문 번호 자동 생성 (형식: `ORD-YYYYMMDD-HHMMSS-XXX`)
     - 주문 상태는 기본값 '주문 접수'로 설정
   - OrderItems 테이블에 주문 항목들을 저장합니다.
   - Menus 테이블의 해당 메뉴들의 재고를 차감합니다.
     - `stock = stock - quantity` (각 주문 항목별로)
5. 백엔드는 생성된 주문 정보를 프런트엔드에 반환합니다.
   - 반환 데이터: 주문 ID, 주문 번호, 주문 일시, 총 금액
6. 프런트엔드는 주문 완료 메시지와 주문 번호를 사용자에게 표시합니다.

#### 5.2.4 관리자 화면 - 재고 조회 흐름
1. 관리자가 관리자 화면의 "재고 현황" 탭에 접속합니다.
2. 프런트엔드에서 백엔드 API를 호출하여 메뉴 목록과 재고 정보를 요청합니다.
   - API: `GET /api/menus/admin` 또는 `GET /api/menus?include_stock=true`
3. 백엔드는 Menus 테이블에서 메뉴 정보와 재고 수량을 조회합니다.
4. 조회된 정보를 프런트엔드에 반환합니다.
   - 반환 데이터: 메뉴 ID, 이름, 설명, 가격, 재고 수량
5. 프런트엔드는 재고 정보를 관리자 화면에 표시합니다.

#### 5.2.5 관리자 화면 - 재고 수정 흐름
1. 관리자가 재고 현황에서 특정 메뉴의 재고 수량을 수정합니다.
2. 프런트엔드는 수정된 재고 정보를 백엔드 API로 전송합니다.
   - API: `PUT /api/menus/:id/stock` 또는 `PATCH /api/menus/:id`
   - 요청 데이터:
     ```json
     {
       "stock": 15
     }
     ```
3. 백엔드는 Menus 테이블의 해당 메뉴의 재고를 업데이트합니다.
4. 업데이트된 재고 정보를 프런트엔드에 반환합니다.
5. 프런트엔드는 수정 완료 메시지를 표시합니다.

#### 5.2.6 관리자 화면 - 주문 조회 흐름
1. 관리자가 관리자 화면의 "주문 현황" 탭에 접속합니다.
2. 프런트엔드에서 백엔드 API를 호출하여 주문 목록을 요청합니다.
   - API: `GET /api/orders`
   - 선택적 쿼리 파라미터: `?status=주문 접수` (상태별 필터링)
3. 백엔드는 Orders 테이블과 OrderItems 테이블을 조인하여 주문 정보를 조회합니다.
4. 조회된 주문 정보를 최신순으로 정렬하여 반환합니다.
   - 반환 데이터: 주문 ID, 주문 번호, 주문 일시, 주문 상태, 총 금액, 주문 항목 목록
5. 프런트엔드는 주문 목록을 관리자 화면에 표시합니다.

#### 5.2.7 관리자 화면 - 주문 상태 변경 흐름
1. 관리자가 주문 현황에서 특정 주문의 상태를 변경합니다.
   - "주문 접수" → "제조 시작" 버튼 클릭 → 상태가 "제조 중"으로 변경
   - "제조 중" → "제조 완료" 버튼 클릭 → 상태가 "완료"로 변경
2. 프런트엔드는 변경된 주문 상태를 백엔드 API로 전송합니다.
   - API: `PUT /api/orders/:id/status` 또는 `PATCH /api/orders/:id`
   - 요청 데이터:
     ```json
     {
       "status": "제조 중"
     }
     ```
3. 백엔드는 Orders 테이블의 해당 주문의 상태를 업데이트합니다.
4. 업데이트된 주문 정보를 프런트엔드에 반환합니다.
5. 프런트엔드는 상태 변경 완료 메시지를 표시하고 주문 목록을 갱신합니다.

### 5.3 API 설계

#### 5.3.1 메뉴 관련 API

##### GET /api/menus
주문하기 화면에서 사용할 메뉴 목록을 조회합니다.

**요청:**
- Method: GET
- Headers: 없음
- Query Parameters: 없음

**응답:**
- Status Code: 200 OK
- Body:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "아메리카노",
        "description": "진한 에스프레소에 물을 더한 클래식 커피",
        "price": 4000,
        "image": "/images/americano.jpg"
      },
      {
        "id": 2,
        "name": "카페라떼",
        "description": "부드러운 우유와 에스프레소의 조화",
        "price": 4500,
        "image": "/images/latte.jpg"
      }
    ]
  }
  ```
- **주의**: 재고 수량(stock)은 포함하지 않음

##### GET /api/menus/admin
관리자 화면에서 사용할 메뉴 목록과 재고 정보를 조회합니다.

**요청:**
- Method: GET
- Headers: 없음 (향후 인증 토큰 추가 가능)
- Query Parameters: 없음

**응답:**
- Status Code: 200 OK
- Body:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "아메리카노",
        "description": "진한 에스프레소에 물을 더한 클래식 커피",
        "price": 4000,
        "image": "/images/americano.jpg",
        "stock": 10
      },
      {
        "id": 2,
        "name": "카페라떼",
        "description": "부드러운 우유와 에스프레소의 조화",
        "price": 4500,
        "image": "/images/latte.jpg",
        "stock": 3
      }
    ]
  }
  ```

##### GET /api/menus/:id
특정 메뉴의 상세 정보를 조회합니다.

**요청:**
- Method: GET
- Path Parameters:
  - `id`: 메뉴 ID (INTEGER)

**응답:**
- Status Code: 200 OK
- Body:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "name": "아메리카노",
      "description": "진한 에스프레소에 물을 더한 클래식 커피",
      "price": 4000,
      "image": "/images/americano.jpg",
      "stock": 10
    }
  }
  ```
- Status Code: 404 Not Found (메뉴가 존재하지 않는 경우)
- Body:
  ```json
  {
    "success": false,
    "message": "메뉴를 찾을 수 없습니다."
  }
  ```

##### PATCH /api/menus/:id/stock
특정 메뉴의 재고 수량을 수정합니다.

**요청:**
- Method: PATCH
- Path Parameters:
  - `id`: 메뉴 ID (INTEGER)
- Body:
  ```json
  {
    "stock": 15
  }
  ```

**응답:**
- Status Code: 200 OK
- Body:
  ```json
  {
    "success": true,
    "message": "재고가 수정되었습니다.",
    "data": {
      "id": 1,
      "name": "아메리카노",
      "stock": 15
    }
  }
  ```
- Status Code: 400 Bad Request (잘못된 요청)
- Body:
  ```json
  {
    "success": false,
    "message": "재고 수량은 0 이상의 정수여야 합니다."
  }
  ```
- Status Code: 404 Not Found (메뉴가 존재하지 않는 경우)

#### 5.3.2 주문 관련 API

##### POST /api/orders
새로운 주문을 생성합니다.

**요청:**
- Method: POST
- Body:
  ```json
  {
    "items": [
      {
        "menu_id": 1,
        "quantity": 2,
        "options": [1, 3],
        "unit_price": 4500,
        "total_price": 9000
      },
      {
        "menu_id": 2,
        "quantity": 1,
        "options": [],
        "unit_price": 4500,
        "total_price": 4500
      }
    ],
    "total_amount": 13500
  }
  ```

**응답:**
- Status Code: 201 Created
- Body:
  ```json
  {
    "success": true,
    "message": "주문이 완료되었습니다.",
    "data": {
      "id": 3,
      "order_number": "ORD-20250120-143000-001",
      "order_date": "2025-01-20T14:30:00Z",
      "status": "주문 접수",
      "total_amount": 13500,
      "items": [
        {
          "id": 1,
          "menu_id": 1,
          "menu_name": "아메리카노",
          "quantity": 2,
          "unit_price": 4500,
          "total_price": 9000,
          "options": [1, 3]
        },
        {
          "id": 2,
          "menu_id": 2,
          "menu_name": "카페라떼",
          "quantity": 1,
          "unit_price": 4500,
          "total_price": 4500,
          "options": []
        }
      ]
    }
  }
  ```
- Status Code: 400 Bad Request (재고 부족 또는 잘못된 요청)
- Body:
  ```json
  {
    "success": false,
    "message": "아메리카노의 재고가 부족합니다. (현재 재고: 5개, 주문 수량: 10개)"
  }
  ```

**비즈니스 로직:**
1. 요청 데이터 검증
2. 각 주문 항목의 메뉴 재고 확인
3. 재고가 충분한 경우:
   - 주문 번호 생성
   - Orders 테이블에 주문 정보 저장
   - OrderItems 테이블에 주문 항목들 저장
   - Menus 테이블의 재고 차감
4. 재고가 부족한 경우 에러 반환

##### GET /api/orders
주문 목록을 조회합니다. (관리자 화면용)

**요청:**
- Method: GET
- Query Parameters (선택적):
  - `status`: 주문 상태로 필터링 ('주문 접수', '제조 중', '완료', '취소')
  - `limit`: 조회할 최대 개수 (기본값: 100)
  - `offset`: 건너뛸 개수 (기본값: 0)

**응답:**
- Status Code: 200 OK
- Body:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 3,
        "order_number": "ORD-20250120-143000-001",
        "order_date": "2025-01-20T14:30:00Z",
        "status": "주문 접수",
        "total_amount": 13500,
        "items": [
          {
            "id": 1,
            "menu_id": 1,
            "menu_name": "아메리카노",
            "quantity": 2,
            "unit_price": 4500,
            "total_price": 9000,
            "options": []
          }
        ]
      }
    ],
    "total": 1
  }
  ```
- 주문 목록은 최신순(주문 일시 내림차순)으로 정렬

##### GET /api/orders/:id
특정 주문의 상세 정보를 조회합니다.

**요청:**
- Method: GET
- Path Parameters:
  - `id`: 주문 ID (INTEGER)

**응답:**
- Status Code: 200 OK
- Body:
  ```json
  {
    "success": true,
    "data": {
      "id": 3,
      "order_number": "ORD-20250120-143000-001",
      "order_date": "2025-01-20T14:30:00Z",
      "status": "주문 접수",
      "total_amount": 13500,
      "items": [
        {
          "id": 1,
          "menu_id": 1,
          "menu_name": "아메리카노",
          "quantity": 2,
          "unit_price": 4500,
          "total_price": 9000,
          "options": [
            {
              "id": 1,
              "name": "샷 추가",
              "price": 500
            }
          ]
        }
      ]
    }
  }
  ```
- Status Code: 404 Not Found (주문이 존재하지 않는 경우)

##### PATCH /api/orders/:id/status
주문 상태를 변경합니다.

**요청:**
- Method: PATCH
- Path Parameters:
  - `id`: 주문 ID (INTEGER)
- Body:
  ```json
  {
    "status": "제조 중"
  }
  ```

**응답:**
- Status Code: 200 OK
- Body:
  ```json
  {
    "success": true,
    "message": "주문 상태가 변경되었습니다.",
    "data": {
      "id": 3,
      "order_number": "ORD-20250120-143000-001",
      "status": "제조 중"
    }
  }
  ```
- Status Code: 400 Bad Request (잘못된 상태 값)
- Body:
  ```json
  {
    "success": false,
    "message": "유효하지 않은 주문 상태입니다. (가능한 값: 주문 접수, 제조 중, 완료, 취소)"
  }
  ```
- Status Code: 404 Not Found (주문이 존재하지 않는 경우)

**상태 변경 규칙:**
- '주문 접수' → '제조 중' → '완료'
- '주문 접수' 또는 '제조 중' → '취소'
- '완료' 또는 '취소' 상태는 변경 불가

#### 5.3.3 옵션 관련 API (선택적)

##### GET /api/menus/:id/options
특정 메뉴에 연결된 옵션 목록을 조회합니다.

**요청:**
- Method: GET
- Path Parameters:
  - `id`: 메뉴 ID (INTEGER)

**응답:**
- Status Code: 200 OK
- Body:
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "샷 추가",
        "price": 500,
        "menu_id": 1
      },
      {
        "id": 2,
        "name": "휘핑 크림",
        "price": 300,
        "menu_id": 1
      }
    ]
  }
  ```

### 5.4 에러 처리

#### 5.4.1 공통 에러 응답 형식
모든 API는 일관된 에러 응답 형식을 사용합니다.

```json
{
  "success": false,
  "message": "에러 메시지",
  "error": {
    "code": "ERROR_CODE",
    "details": "상세 에러 정보 (선택적)"
  }
}
```

#### 5.4.2 HTTP 상태 코드
- `200 OK`: 요청 성공
- `201 Created`: 리소스 생성 성공
- `400 Bad Request`: 잘못된 요청 (유효성 검사 실패 등)
- `404 Not Found`: 리소스를 찾을 수 없음
- `500 Internal Server Error`: 서버 내부 오류

#### 5.4.3 주요 에러 케이스
1. **재고 부족**: 주문 시 요청한 수량이 재고를 초과하는 경우
2. **존재하지 않는 메뉴**: 잘못된 메뉴 ID로 주문하는 경우
3. **존재하지 않는 주문**: 잘못된 주문 ID로 조회/수정하는 경우
4. **잘못된 상태 변경**: 유효하지 않은 주문 상태로 변경하려는 경우
5. **데이터베이스 오류**: 데이터베이스 연결 실패 또는 쿼리 오류

### 5.5 개발 환경 설정

#### 5.5.1 프로젝트 구조
```
order-app/
├── ui/                    # 프런트엔드 (기존)
├── server/                # 백엔드 (신규)
│   ├── src/
│   │   ├── config/        # 설정 파일
│   │   │   └── database.js
│   │   ├── models/        # 데이터 모델
│   │   │   ├── Menu.js
│   │   │   ├── Option.js
│   │   │   ├── Order.js
│   │   │   └── OrderItem.js
│   │   ├── routes/        # API 라우트
│   │   │   ├── menus.js
│   │   │   ├── orders.js
│   │   │   └── options.js
│   │   ├── controllers/   # 컨트롤러
│   │   │   ├── menuController.js
│   │   │   ├── orderController.js
│   │   │   └── optionController.js
│   │   ├── middleware/    # 미들웨어
│   │   │   ├── errorHandler.js
│   │   │   └── validator.js
│   │   └── app.js         # Express 앱 설정
│   ├── migrations/        # 데이터베이스 마이그레이션
│   ├── seeds/             # 시드 데이터
│   ├── package.json
│   └── .env               # 환경 변수
├── docs/
│   └── PRD.md
└── README.md
```

#### 5.5.2 필요한 패키지
- `express`: 웹 프레임워크
- `pg` 또는 `sequelize`: PostgreSQL 클라이언트 또는 ORM
- `dotenv`: 환경 변수 관리
- `cors`: CORS 설정
- `express-validator` 또는 `joi`: 요청 데이터 유효성 검사
- `nodemon`: 개발 시 자동 재시작 (devDependencies)

#### 5.5.3 환경 변수
`.env` 파일에 다음 변수들을 설정합니다:
```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_order_db
DB_USER=postgres
DB_PASSWORD=your_password
NODE_ENV=development
```

### 5.6 데이터베이스 스키마 예시

#### 5.6.1 SQL 스키마 (PostgreSQL)

```sql
-- Menus 테이블
CREATE TABLE menus (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price INTEGER NOT NULL CHECK (price >= 0),
    image VARCHAR(255),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Options 테이블
CREATE TABLE options (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price INTEGER NOT NULL DEFAULT 0 CHECK (price >= 0),
    menu_id INTEGER REFERENCES menus(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders 테이블
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT '주문 접수' 
        CHECK (status IN ('주문 접수', '제조 중', '완료', '취소')),
    total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OrderItems 테이블
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    menu_id INTEGER NOT NULL REFERENCES menus(id),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
    total_price INTEGER NOT NULL CHECK (total_price >= 0),
    options JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 인덱스 생성
CREATE INDEX idx_orders_order_date ON orders(order_date DESC);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_id ON order_items(menu_id);
CREATE INDEX idx_options_menu_id ON options(menu_id);
```

### 5.7 개발 우선순위

1. **1단계: 기본 설정**
   - Node.js/Express 프로젝트 초기화
   - PostgreSQL 데이터베이스 연결
   - 기본 라우팅 구조 설정

2. **2단계: 메뉴 API 구현**
   - GET /api/menus (일반 사용자용)
   - GET /api/menus/admin (관리자용)
   - PATCH /api/menus/:id/stock (재고 수정)

3. **3단계: 주문 API 구현**
   - POST /api/orders (주문 생성)
   - GET /api/orders (주문 목록 조회)
   - GET /api/orders/:id (주문 상세 조회)
   - PATCH /api/orders/:id/status (주문 상태 변경)

4. **4단계: 통합 테스트**
   - 프런트엔드와 백엔드 연동 테스트
   - 에러 처리 테스트
   - 재고 관리 로직 테스트

5. **5단계: 옵션 기능 (선택적)**
   - Options 테이블 및 관련 API 구현
   - 주문 시 옵션 선택 기능 추가
 