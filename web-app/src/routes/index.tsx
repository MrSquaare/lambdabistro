import type { NoSerialize } from "@builder.io/qwik";
import {
  component$,
  noSerialize,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { css } from "~/styled-system/css";

export const useWSClient = () => {
  const ws = useSignal<NoSerialize<WebSocket>>();
  const data = useSignal<any | null>(null);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    ws.value = noSerialize(new WebSocket("ws://localhost:3001"));

    ws.value?.addEventListener("open", () => {
      console.log("WebSocket connection opened");
    });

    ws.value?.addEventListener("close", () => {
      console.log("WebSocket connection closed");
    });

    ws.value?.addEventListener("message", (event) => {
      console.log("WebSocket message", event.data);

      data.value = event.data;
    });

    return () => {
      ws.value?.close();
    };
  });

  return { ws, data };
};

export default component$(() => {
  const { data: wsClientData } = useWSClient();

  return (
    <div
      class={css({
        display: "flex",
        flexDir: "column",
        alignItems: "center",
        justifyContent: "center",
        w: "screen",
        h: "screen",
      })}
    >
      <h1 class={css({ fontSize: "2xl", fontWeight: "bold" })}>Hi 👋</h1>
      <p>
        WebSocket client value:{" "}
        {JSON.stringify(wsClientData.value ?? "Loading...")}
      </p>
    </div>
  );
});

export const head: DocumentHead = {
  title: "LambdaBistro",
};
