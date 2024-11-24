import { textStatsOf } from "@keybr/unicode";
import { Article, TextField, useDebounced } from "@keybr/widget";
import { useEffect, useMemo, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { EXAMPLE } from "./example.ts";
import { TextStats } from "./TextStats.tsx";

export function WordCountPage() {
  const { locale, formatMessage } = useIntl();
  const initialText = useInitialText();
  const [text, setText] = useState(initialText);
  const textStats = useTextStats(locale, text);
  return (
    <Article>
      <FormattedMessage
        id="page.wordCount.content"
        defaultMessage={
          "<h1>Word Count</h1>" +
          "<p>Count the characters and words in your text. Find out what the most common words are. Measure the time taken to type read these words.</p>"
        }
      />
      <TextField
        type="textarea"
        placeholder={formatMessage({
          id: "wordCount.textInput.placeholder",
          defaultMessage: "Paste your text here",
        })}
        value={text}
        onFocus={() => {
          if (text === initialText) {
            setText("");
          }
        }}
        onChange={(value) => {
          setText(value);
        }}
      />
      <TextStats textStats={textStats} />
    </Article>
  );
}

function useInitialText() {
  const { formatMessage } = useIntl();
  return useMemo(
    () =>
      formatMessage({
        id: "wordCount.exampleText",
        defaultMessage: "(Example text, click here to clear it.)",
      }) +
      "\n\n" +
      EXAMPLE,
    [formatMessage],
  );
}

function useTextStats(locale: string, text: string) {
  const [textStats, setTextStats] = useState(textStatsOf(locale, text));
  const debouncedText = useDebounced(text);
  useEffect(() => {
    setTextStats(textStatsOf(locale, debouncedText));
  }, [locale, debouncedText]);
  return textStats;
}
