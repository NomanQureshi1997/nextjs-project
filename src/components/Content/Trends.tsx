import { useEffect, useState } from "react";
import Link from "next/link";
import stringify from "query-string";
import "cal-sans";

interface NewsItem {
  "ht:news_item_title": string;
  "ht:news_item_snippet": string;
  "ht:news_item_url": string;
  "ht:news_item_source": string;
}

interface FeedItem {
  title: string;
  "ht:approx_traffic": string;
  description: string;
  link: string;
  pubDate: string;
  "ht:picture": string;
  "ht:picture_source": string;
  "ht:news_item": NewsItem[];
}

const Trends = () => {
  const [items, setItems] = useState<FeedItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/trends");
        if (!res.ok) throw new Error(res.statusText);
        const feed = await res.json();
        setItems(feed.rss.channel.item);
        console.log(feed.rss.channel.item);
      } catch (error) {
        console.error(
          "Error occurred while fetching the RSS feed:",
          (error as Error).message
        );
      }
    };

    fetchData();
  }, []);

  const descriptionOrSnippet = (item: FeedItem) => {
    if (item.description) {
      return item.description;
    } else if (item["ht:news_item"] && item["ht:news_item"][0]) {
      return item["ht:news_item"][0]["ht:news_item_snippet"];
    } else {
      return "";
    }
  };

  return (
    <>
      <div className="mx-auto mb-10 mt-20 max-w-2xl text-2xl font-semibold text-gray-800">
        <div className="flex items-center space-x-2">
          <div
            className="mb-4 ml-2 text-2xl font-semibold text-gray-800"
            style={{ fontFamily: "Cal Sans" }}
          >
            Popular Now
          </div>
        </div>

        <div
          className="mx-auto max-w-2xl divide-y divide-gray-200 rounded-2xl bg-white shadow"
          style={{ fontFamily: "Cal Sans" }}
        >
          {items?.map((item, i) => (
            <Link
              href={{
                pathname: "/serp",
                query: stringify.stringify({ q: item.title + descriptionOrSnippet(item)
                 }),
              }}
              passHref
            >
              <div
                key={i}
                className="relative grid grid-cols-4 items-start gap-4 p-4 py-4 group"
              >
                <div className="absolute left-3 top-4 w-6 pr-2 text-right text-xl text-gray-500">
                  {i + 1}
                </div>

                <div className="ml-8 space-y-2 md:col-span-3">
                  <div className="flex items-center space-x-2">
                    <div className="text-lg font-semibold md:text-xl group-hover:text-blue-500">
                      {item.title}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm md:text-base">
                      {item.description
                        ? item.description
                        : item["ht:news_item"] && item["ht:news_item"][0]
                        ? item["ht:news_item"][0]["ht:news_item_snippet"]
                        : null}
                    </div>

                    <div className="text-sm text-gray-500">
                      {item["ht:approx_traffic"]} searches
                    </div>
                  </div>
                </div>

                <img
                  className="h-24 w-full self-center justify-self-end rounded-2xl object-cover md:col-span-1 md:w-24"
                  src={item["ht:picture"]}
                  alt={item.title}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default Trends;
