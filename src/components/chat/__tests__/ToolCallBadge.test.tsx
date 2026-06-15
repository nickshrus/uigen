import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { ToolCallBadge, getToolCallLabel } from "../ToolCallBadge";
import type { ToolInvocation } from "ai";

afterEach(() => {
  cleanup();
});

function makeToolInvocation(
  toolName: string,
  args: Record<string, unknown>,
  state: "result" | "call" = "result",
  result?: unknown
): ToolInvocation {
  if (state === "result") {
    return { toolCallId: "id", toolName, args, state, result: result ?? "ok" } as ToolInvocation;
  }
  return { toolCallId: "id", toolName, args, state } as ToolInvocation;
}

// --- getToolCallLabel unit tests ---

test("getToolCallLabel: str_replace_editor create", () => {
  const tool = makeToolInvocation("str_replace_editor", { command: "create", path: "/src/App.jsx" });
  expect(getToolCallLabel(tool)).toBe("Creating App.jsx");
});

test("getToolCallLabel: str_replace_editor str_replace", () => {
  const tool = makeToolInvocation("str_replace_editor", { command: "str_replace", path: "/src/Card.tsx" });
  expect(getToolCallLabel(tool)).toBe("Editing Card.tsx");
});

test("getToolCallLabel: str_replace_editor insert", () => {
  const tool = makeToolInvocation("str_replace_editor", { command: "insert", path: "/src/Foo.tsx" });
  expect(getToolCallLabel(tool)).toBe("Editing Foo.tsx");
});

test("getToolCallLabel: str_replace_editor undo_edit", () => {
  const tool = makeToolInvocation("str_replace_editor", { command: "undo_edit", path: "/src/Bar.tsx" });
  expect(getToolCallLabel(tool)).toBe("Editing Bar.tsx");
});

test("getToolCallLabel: str_replace_editor view", () => {
  const tool = makeToolInvocation("str_replace_editor", { command: "view", path: "/src/index.tsx" });
  expect(getToolCallLabel(tool)).toBe("Viewing index.tsx");
});

test("getToolCallLabel: file_manager rename", () => {
  const tool = makeToolInvocation("file_manager", { command: "rename", path: "/src/old.tsx" });
  expect(getToolCallLabel(tool)).toBe("Renaming old.tsx");
});

test("getToolCallLabel: file_manager delete", () => {
  const tool = makeToolInvocation("file_manager", { command: "delete", path: "/src/old.tsx" });
  expect(getToolCallLabel(tool)).toBe("Deleting old.tsx");
});

test("getToolCallLabel: unknown tool falls back to toolName", () => {
  const tool = makeToolInvocation("some_other_tool", { command: "foo", path: "/src/x.ts" });
  expect(getToolCallLabel(tool)).toBe("some_other_tool");
});

test("getToolCallLabel: missing path falls back to toolName", () => {
  const tool = makeToolInvocation("str_replace_editor", { command: "create" });
  expect(getToolCallLabel(tool)).toBe("str_replace_editor");
});

test("getToolCallLabel: missing command falls back to toolName", () => {
  const tool = makeToolInvocation("str_replace_editor", { path: "/src/App.jsx" });
  expect(getToolCallLabel(tool)).toBe("str_replace_editor");
});

// --- ToolCallBadge render tests ---

test("ToolCallBadge shows green dot when state is result", () => {
  const tool = makeToolInvocation("str_replace_editor", { command: "create", path: "/src/App.jsx" }, "result");
  const { container } = render(<ToolCallBadge tool={tool} />);
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("ToolCallBadge shows spinner when state is call", () => {
  const tool = makeToolInvocation("str_replace_editor", { command: "create", path: "/src/App.jsx" }, "call");
  const { container } = render(<ToolCallBadge tool={tool} />);
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("ToolCallBadge renders friendly label for file_manager delete", () => {
  const tool = makeToolInvocation("file_manager", { command: "delete", path: "/src/Card.tsx" }, "result");
  render(<ToolCallBadge tool={tool} />);
  expect(screen.getByText("Deleting Card.tsx")).toBeDefined();
});

test("ToolCallBadge falls back to toolName for unknown tool", () => {
  const tool = makeToolInvocation("mystery_tool", {}, "result");
  render(<ToolCallBadge tool={tool} />);
  expect(screen.getByText("mystery_tool")).toBeDefined();
});
