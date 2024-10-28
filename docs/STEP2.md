# 리팩토링 방향성

### 1. Rank 초기 생성 방식 간소화

[ ] Java enum 모방
[ ] static values를 추가해 외부에서 인스턴스를 만들지 않고 바로 참조할 수 있도록 처리

### 2. Controller와 Model 코드 영역 분리

[ ] Model 코드는 class 구현 여부에 따라 entries와 service로 분리
[ ] Controller에는 View와 상호작용하는 코드만 유지하고, Model과 상호작용하는 로직은 service로 이동

### 3. 기타 리팩토링 필요 부분 개선
