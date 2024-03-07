import { $, component$, useOnDocument, useSignal } from "@builder.io/qwik";
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

export default component$(() => {
  const helloWorldSSR = useHelloWorldSSR();
  const helloWorld = useHelloWorld();

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
    </div>
  );
});

export const head: DocumentHead = {
  title: "LambdaBistro",
};
