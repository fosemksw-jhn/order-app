# GitHub 이메일 확인 및 Git 설정 가이드

## GitHub 계정 이메일 확인 방법

1. **GitHub 웹사이트 접속**: https://github.com
2. **로그인** 후 우측 상단 프로필 아이콘 클릭
3. **Settings** 클릭
4. 왼쪽 메뉴에서 **Emails** 클릭
5. **Primary email address** 또는 **Email addresses** 목록에서 확인

## Git 설정 변경

GitHub 계정에 등록된 이메일 주소를 확인한 후, 아래 명령어로 Git 설정을 변경하세요:

```bash
git config --global user.email "확인한-이메일-주소"
```

## GitHub noreply 이메일 사용 (권장)

이메일 확인 없이도 커밋이 계정에 연결되도록 GitHub의 noreply 이메일을 사용할 수 있습니다:

**형식**: `username@users.noreply.github.com`

현재 사용자 이름이 `fosemksw-jhn`이므로:
```bash
git config --global user.email "fosemksw-jhn@users.noreply.github.com"
```

이미 이 설정은 완료되었습니다.

## 확인 방법

새로운 커밋을 만들면 GitHub에서 아이콘이 표시됩니다:
```bash
git commit --allow-empty -m "테스트 커밋"
git push
```


