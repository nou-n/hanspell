# hanspell
한국어 맞춤법 검사기

## 기능

<details open><summary><h3>인크루트 맞춤법 검사기</h3></summary>
  
<h4>코드</h4>

```typescript
import { incruit } from "./hanspell";

(async () => {
    const result = await incruit.speller("푸르른 하늘 아레, 구름이 춤추듣 흘러간다.");
    console.log(result);
})();
```

<h4>출력</h4>

```typescript
{
  success: true,
  origin: "푸르른 하늘 아레, 구름이 춤추듣 흘러간다.",
  text: "푸른 하늘 아래, 구름이 춤추듯 흘러간다.",
  errors: [
    {
      origin: "푸르른",
      text: [ "푸른", "푸릇한" ],
    }, {
      origin: "아레",
      text: [ "아래" ],
    }, {
      origin: "춤추듣",
      text: [ "춤추듯" ],
    }
  ],
  count: 3,
}
```
</details>
