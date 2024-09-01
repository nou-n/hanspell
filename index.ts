import { incruit } from "./hanspell";

async function main() {
    const result = await incruit.speller("푸르른 하늘 아레, 구름이 춤추듣 흘러간다.");
    console.log(result);
}
main();