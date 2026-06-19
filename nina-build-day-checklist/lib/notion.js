import { Client } from "@notionhq/client";

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

export const DB_ID = process.env.NOTION_DB_ID;

export function title(text = "") {
  return {
    title: [{ type: "text", text: { content: String(text || "Untitled").slice(0, 1900) } }],
  };
}

export function rich(text = "") {
  return {
    rich_text: text
      ? [{ type: "text", text: { content: String(text).slice(0, 1900) } }]
      : [],
  };
}

export function email(value) {
  return { email: value || null };
}

export function dateProp(value) {
  return value ? { date: { start: value } } : { date: null };
}

export function checkbox(value) {
  return { checkbox: Boolean(value) };
}
