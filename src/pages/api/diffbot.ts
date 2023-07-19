import { Diff } from "lucide-react";
import { NextApiRequest, NextApiResponse } from "next";
import zod from "zod";
import { DiffbotArticleResponse, DiffbotAPIResponse } from "~/types";
import { DiffbotAPIResponseSchema } from "~/schemas";
import TurndownService from "turndown";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

const urlSchema = zod.string().url();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { url } = req.body;

  if (!url) {
    res.status(400).json({ error: "Missing url query parameter" });
    return;
  }

  try {
    urlSchema.parse(url as string);
  } catch (error) {
    return res
      .status(400)
      .send({ message: "Invalid url query parameter, zod failed" });
  }

  const encodedUrl = encodeURIComponent(url as string);

  // Replace YOUR_DIFFBOT_TOKEN with your actual Diffbot token
  //   const diffbotUrl = `https://api.diffbot.com/v3/analyze?token=${process.env.DIFFBOT_API_KEY}&url=${'https%3A%2F%2Fwww.troubleinterroristtown.com%2F'}&mode=article&fallback=article&discussion=true`;

  const diffbotUrl = `https://api.diffbot.com/v3/analyze?url=${encodedUrl}&token=${process.env.DIFFBOT_API_KEY}`;

  try {
    const response = await fetch(diffbotUrl, {
      headers: {
        Accept: "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();

      // check for errors

      if (data.error) {
        res.status(400).json({ message: data.error });
        return;
      }

      const diffbotArticleResponse = data as DiffbotArticleResponse;

      if (diffbotArticleResponse.objects.length === 0) {
        res.status(400).json({ message: "No article found" });
        return;
      }

      // check that the data is a diffbot article response

      const html = diffbotArticleResponse.objects?.[0]?.html;



      const turndownService = new TurndownService();
      const cheerio = require('cheerio');
      const $ = cheerio.load(html);

      // Remove social media links
      $('a[href*="facebook.com"]').remove();
      $('a[href*="twitter.com"]').remove();
      $('a[href*="instagram.com"]').remove();
      $('a[href*="youtube.com"]').remove();
      $('a[href*="linkedin.com"]').remove();
      $('a[href*="reddit.com"]').remove();
      $('a[href*="pinterest.com"]').remove();
      $('a[href*="tiktok.com"]').remove();
      $('a[href*="t.me"]').remove();
      $('a[href*="discord.gg"]').remove();
      $('a[href*="whatsapp.com"]').remove();
      $('a[href*="snapchat.com"]').remove();
      $('a[href*="tumblr.com"]').remove();
      $('a[href*="quora.com"]').remove();
      $('a[href*="medium.com"]').remove();
      $('a[href*="twitch.tv"]').remove();
      $('a[href*="patreon.com"]').remove();
      $('a[href*="paypal.com"]').remove();
      $('a[href*="cash.app"]').remove();
      $('a[href*="venmo.com"]').remove();
      $('a[href*="onlyfans.com"]').remove();



      // remove any really long links
      $('a').each((i: number, elem: any) => {
        const href: string | undefined = elem.attribs?.href;
        if (href && href.length > 100) {
          console.log("removing long link", href);
          $(elem).remove();
        }
      });
      

  
      
      // Add any other social media links you want to remove

      // Convert modified HTML to Markdown
      const modifiedHtml = $.html();

      let rhtml = modifiedHtml.replace(/\n{3,}/g, '\n\n'); // Replace 3 or more consecutive line breaks with 2 line breaks
      rhtml = rhtml.trim(); // Remove leading and trailing whitespace



      // remove image captions

      turndownService.remove(["script", "style", "noscript", "img", "iframe", "video", "audio", "canvas", "map", "object", "embed", "span"]);

      const markdown = turndownService.turndown(modifiedHtml ?? "");

      const diffbotAPIResponse = {
        type: diffbotArticleResponse.objects?.[0]?.type,
        title: diffbotArticleResponse.objects?.[0]?.title,
        author: diffbotArticleResponse.objects?.[0]?.author,
        date: diffbotArticleResponse.objects?.[0]?.date,
        url: diffbotArticleResponse.request.pageUrl,
        html: html,
        items: diffbotArticleResponse.objects?.[0]?.items,
        markdown: markdown,
      };

      DiffbotAPIResponseSchema.parse(diffbotAPIResponse);

      res.status(200).json(diffbotAPIResponse);
    } else {
      res
        .status(response.status)
        .json({ message: "Error calling Diffbot API" });
    }
  } catch (err) {
    // res.status(500).json({ message: err }); change to something more useful
    res.status(500).json({ message: err });
  }
}
