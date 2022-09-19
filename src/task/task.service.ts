import { ForbiddenException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Keyword, SearchResult } from '@prisma/client';
import { mkdirSync, readdirSync } from 'fs';
import puppeteer from 'puppeteer';
import { PrismaService } from 'src/prisma/prisma.service';
import { UtilService } from 'src/util/util.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService, private util: UtilService) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  runTaskEveryHalfADay() {
    return this.runAllTask();
  }

  async runAllTask() {
    const keywords = await this.prisma.keyword.findMany({
      where: { enabled: true },
    });

    for (const keyword of keywords) {
      await this.doTask(keyword);
    }
  }

  async runUserTask(userId: number, keywordId: number) {
    const keyword = await this.prisma.keyword.findUnique({
      where: { id: keywordId },
    });

    if (!keyword || keyword.userId !== userId || !keyword.enabled) {
      throw new ForbiddenException();
    }

    return this.doTask(keyword);
  }

  async doTask(keyword: Keyword) {
    const dateString = new Date().toISOString().split('T')[0];
    const folderDest = `media/${dateString}`;
    try {
      readdirSync(folderDest);
    } catch {
      mkdirSync(folderDest);
    }

    const PageLimit = 2;
    const Lang = 'zh-TW';
    // const Device = 'iPhone 12';
    const GoogleSearchUrl = 'https://www.google.com.tw';

    const browser = await puppeteer.launch({
      args: [`--lang=${Lang}`, '--no-sandbox'],
      headless: true,
    });

    const page = await browser.newPage();
    // Specify browser language in Puppeteer
    // ref: https://stackoverflow.com/questions/46908636/how-to-specify-browser-language-in-puppeteer
    await page.setExtraHTTPHeaders({ 'Accept-Language': Lang });
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'language', {
        get: function () {
          return Lang;
        },
      });
      Object.defineProperty(navigator, 'languages', {
        get: function () {
          return [Lang];
        },
      });
    });

    // await page.emulate(puppeteer.devices[Device]);
    await page.goto(GoogleSearchUrl, { waitUntil: 'networkidle0' });
    await page.waitForSelector('input[name=q]');
    await page.type('input[name=q]', keyword.value);
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    const results: Omit<SearchResult, 'historyId' | 'id' | 'order'>[] = [];
    const media: string[] = [];

    for (let i = 0; i < PageLimit; i++) {
      const filename = `${this.util.nanoid(10)}.png`;
      media.push(filename);
      await page.screenshot({
        path: `${folderDest}/${filename}`,
        fullPage: true,
      });

      const output = await page.evaluate(() => {
        const $$ = document.querySelectorAll.bind(document);

        return [...$$('[data-sokoban-container]')].map((el) => {
          const hrefEl = el.querySelector('a');
          const titleEl = el.querySelector('[data-header-feature] h3');
          const breadcrumbEl = el.querySelector('[data-header-feature] cite');
          const contentEls = [...el.querySelectorAll('[data-content-feature]')];
          const starEl = el.querySelector('g-review-stars');

          console.log(hrefEl, titleEl, breadcrumbEl);

          return {
            href: hrefEl ? String(hrefEl.getAttribute('href')) : '',
            title: titleEl ? String(titleEl.textContent) : '',
            breadcrumb: breadcrumbEl ? String(breadcrumbEl.textContent) : '',
            content: contentEls.map((el) => {
              const imageEls = [...el.querySelectorAll('img')];

              return {
                images: imageEls.map((el) => String(el.getAttribute('src'))),
                text: String(el.textContent),
              };
            }),
            hasReviews: starEl !== null,
          };
        });
      });

      results.push(...output);

      try {
        if (i === PageLimit - 1) continue;
        await page.click('#pnnext');
        await page.waitForNavigation({ waitUntil: 'networkidle0' });
      } catch {
        break;
      }
    }

    const promise = browser.close();

    await this.prisma.history.create({
      data: {
        userId: keyword.userId,
        keywordId: keyword.id,
        media: media.map((filename) => `/${folderDest}/${filename}`),
        search_results: {
          create: results.map((result, index) => ({
            ...result,
            order: index + 1,
          })),
        },
      },
    });

    await promise;
  }
}
