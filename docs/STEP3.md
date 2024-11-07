## 코드 리뷰 기반 고려 사항

[ ] Domain과 Controller를 웹에서도 재활용하기

-   View -> HTMLView / ConsoleView 상속 방식 도입

```javaScript
class View {}
class HTMLView extends View {}
class ConsoleView extends View {}
```
