import axios from "axios";
import qs from "qs";
import * as cheerio from "cheerio";
import iconv from "iconv-lite";
import type { SpellerResult } from "../types";

export class incruit {
    /**
     * 인크루트 맞춤법 검사
     * @param val 검사할 텍스트
     */
    public static async speller(val: string): Promise<SpellerResult> {
        const spellCheckRequest = await axios.post(
            "https://lab.incruit.com/editor/spell/spell_ajax.asp",
            qs.stringify({
                md: "spellerv2", selfintro: escape(val)
            }),
            {
                headers: {
                    "accept": "*/*",
                    "accept-encoding": "gzip, deflate, br, zstd",
                    "accept-language": "ko-KR,ko;q=0.9",
                    "cache-control": "no-cache",
                    "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                    "origin": "https://lab.incruit.com",
                    "pragma": "no-cache",
                    "priority": "u=1, i",
                    "referer": "https://lab.incruit.com/editor/spell/",
                    "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Google Chrome\";v=\"128\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
                    "x-requested-with": "XMLHttpRequest"
                },
                responseType: "arraybuffer"
            }
        );

        const spellCheck = iconv.decode(spellCheckRequest.data, "EUC-KR").toString();
        if (!spellCheck) return { success: false, origin: val, text: val, errors: [], count: 0 };

        const arrData = spellCheck.split("#^#");
        const checkedText = arrData[1];
        const errorDetail = arrData[2];
        const errorCount =  parseInt(arrData[3]);

        
        const result: SpellerResult = { success: true, origin: val, text: val, errors: [], count: errorCount };

        if (!checkedText) return result;
        
        {
            const $ = cheerio.load(checkedText);
            result.text = $("p#spellingAlltest").text();
        }
        {
            const $ = cheerio.load(errorDetail);
            $("dl").each((a, b) => {
                const dl = $(b);
                const text: string[] = [];
                
                dl.find("button").length > 1 ? dl.find("button").each((c, d) => { text.push($(d).text()); }) : text.push(dl.find("button").text());
                
                result.errors.push({
                    origin: dl.find("dt").text(),
                    text
                })
            });
        }

        return result;
    }
}