import type { NoSerialize } from "@builder.io/qwik";
import {
  $,
  component$,
  noSerialize,
  useOnDocument,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { routeLoader$, type DocumentHead } from "@builder.io/qwik-city";
import type { HelloWorldResponse } from "~/api/hello-world";
import { fetchHelloWorld } from "~/api/hello-world";
import { css } from "~/styled-system/css";

export const useHelloWorldSSR = routeLoader$(async () => {
  return fetchHelloWorld();
});

export const useHelloWorld = () => {
  const data = useSignal<HelloWorldResponse | null>(null);

  useOnDocument(
    "DOMContentLoaded",
    $(async () => {
      data.value = await fetchHelloWorld();
    }),
  );

  return data;
};

export const useHelloWorldWS = () => {
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
  const helloWorldSSR = useHelloWorldSSR();
  const helloWorld = useHelloWorld();
  const { ws: helloWorldWS, data: helloWorldWSData } = useHelloWorldWS();

  const sendDummyMessage = $(() => {
    helloWorldWS.value?.send("Dummy message");
  });

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
      <p>Server-side value: {helloWorldSSR.value.message}</p>
      <p>Client-side value: {helloWorld.value?.message ?? "Loading..."}</p>
      <p>
        WebSocket value:{" "}
        {JSON.stringify(helloWorldWSData.value ?? "Loading...")}
      </p>
      <button onClick$={() => sendDummyMessage()}>Send dummy message</button>
    </div>
  );
});

export const head: DocumentHead = {
  title: "LambdaBistro",
};
