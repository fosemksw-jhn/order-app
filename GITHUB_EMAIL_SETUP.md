# GitHub 커밋 그래프 아이콘 표시 설정

## 문제
GitHub 커밋 그래프에서 보라색 아이콘(프로필 아바타)이 보이지 않습니다.

## 원인
커밋에 사용된 이메일 주소(`fosemksw@gmail.com`)가 GitHub 계정에 등록되어 있지 않거나 확인되지 않았기 때문입니다.

## 해결 방법

### 방법 1: GitHub 계정에 이메일 추가 (권장)

1. GitHub에 로그인
2. 우측 상단 프로필 아이콘 클릭 → **Settings**
3. 왼쪽 메뉴에서 **Emails** 클릭
4. **Add email address** 클릭
5. `fosemksw@gmail.com` 입력
6. 이메일로 전송된 확인 링크 클릭
7. **Keep my email addresses private** 체크 해제 (또는 원하는 대로 설정)

### 방법 2: GitHub noreply 이메일 사용

GitHub의 noreply 이메일을 사용하면 이메일 확인 없이도 커밋이 계정에 연결됩니다.

**현재 설정된 이메일**: `fosemksw@gmail.com`
**GitHub noreply 이메일**: `fosemksw-jhn@users.noreply.github.com`

Git 설정을 변경하려면:
```bash
git config user.email "fosemksw-jhn@users.noreply.github.com"
```

**주의**: 이 방법은 새로운 커밋부터 적용됩니다. 과거 커밋은 변경되지 않습니다.

## 확인 방법

설정 후 새로운 커밋을 만들면 GitHub에서 아이콘이 표시됩니다:
```bash
git commit --allow-empty -m "테스트 커밋"
git push
```

GitHub 저장소의 커밋 그래프에서 프로필 아이콘이 표시되는지 확인하세요.

